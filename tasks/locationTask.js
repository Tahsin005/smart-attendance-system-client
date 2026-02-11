import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';
const RETRY_QUEUE_KEY = '@location_retry_queue';

/**
 * Flush any queued locations that failed to send previously.
 * Sends them one-by-one; stops at first failure to preserve order.
 */
const flushRetryQueue = async (apiUrl, token) => {
    try {
        const raw = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
        if (!raw) return;

        const queue = JSON.parse(raw);
        if (!Array.isArray(queue) || queue.length === 0) return;

        console.log(`[LocationTask] Flushing ${queue.length} queued location(s)...`);

        const remaining = [...queue];

        while (remaining.length > 0) {
            const entry = remaining[0];

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${apiUrl}/location`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ lat: entry.lat, lng: entry.lng }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.warn(`[LocationTask] Retry flush failed (${response.status}), will try again later`);
                break;
            }

            remaining.shift(); // remove successfully sent entry
        }

        // save whatever is left (or clear if empty)
        if (remaining.length > 0) {
            await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(remaining));
        } else {
            await AsyncStorage.removeItem(RETRY_QUEUE_KEY);
            console.log('[LocationTask] Retry queue fully flushed');
        }
    } catch (error) {
        console.warn('[LocationTask] Error flushing retry queue:', error.message);
    }
};

/**
 * Queue a failed location for later retry.
 * Caps at 100 entries to prevent unbounded storage growth.
 */
const queueForRetry = async (lat, lng) => {
    try {
        const raw = await AsyncStorage.getItem(RETRY_QUEUE_KEY);
        const queue = raw ? JSON.parse(raw) : [];

        queue.push({ lat, lng, timestamp: new Date().toISOString() });

        // cap the queue to prevent unbounded growth
        const MAX_QUEUE_SIZE = 100;
        const trimmed = queue.length > MAX_QUEUE_SIZE ? queue.slice(-MAX_QUEUE_SIZE) : queue;

        await AsyncStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(trimmed));
        console.log(`[LocationTask] Queued location for retry (${trimmed.length} in queue)`);
    } catch (error) {
        console.error('[LocationTask] Failed to queue location:', error.message);
    }
};

/**
 * Background location task — triggered by the OS every ~30 seconds
 * via Location.startLocationUpdatesAsync.
 */
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error('[LocationTask] Task error:', error.message);
        return;
    }

    if (!data || !data.locations || data.locations.length === 0) {
        console.log('[LocationTask] No location data received');
        return;
    }

    const location = data.locations[0];
    const { latitude, longitude } = location.coords;
    const now = new Date().toLocaleTimeString();

    console.log(`[LocationTask] ${now} — lat: ${latitude}, lng: ${longitude}`);

    try {
        // 1. Get auth token
        const authDataJson = await AsyncStorage.getItem('@auth_data');
        if (!authDataJson) {
            console.log('[LocationTask] No auth data, skipping');
            return;
        }

        const { token } = JSON.parse(authDataJson);
        if (!token) {
            console.log('[LocationTask] No token, skipping');
            return;
        }

        // 2. Get API URL
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error('[LocationTask] EXPO_PUBLIC_API_URL is not defined');
            return;
        }

        // 3. Flush any previously queued locations first
        await flushRetryQueue(apiUrl, token);

        // 4. Send current location
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${apiUrl}/location`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            console.log(`[LocationTask] ✓ Location sent successfully`);
        } else {
            const errorText = await response.text();
            console.warn(`[LocationTask] Server error: ${response.status} — ${errorText}`);
            await queueForRetry(latitude, longitude);
        }
    } catch (error) {
        console.warn(`[LocationTask] Network error: ${error.message}`);
        await queueForRetry(latitude, longitude);
    }
});
