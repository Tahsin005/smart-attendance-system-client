import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundTask from 'expo-background-task';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

export const LOCATION_UPDATE_TASK = 'SMART_ATTENDANCE_LOCATION_TASK';

TaskManager.defineTask(LOCATION_UPDATE_TASK, async () => {
    const now = new Date().toLocaleTimeString();
    console.log(`[BackgroundFetch] Task executed at: ${now}`);

    try {
        // 1. Get Auth Data
        const authDataJson = await AsyncStorage.getItem('@auth_data');
        if (!authDataJson) {
            console.log('[BackgroundFetch] No auth data found, skipping.');
            return BackgroundTask.BackgroundTaskResult.NoData;
        }

        const { token } = JSON.parse(authDataJson);
        if (!token) {
            console.log('[BackgroundFetch] No token found, skipping.');
            return BackgroundTask.BackgroundTaskResult.NoData;
        }

        // 2. Get Location
        // We check foreground permissions first, though for background fetch it should ideally have background permission too
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.warn('[BackgroundFetch] Location permission not granted');
            return BackgroundTask.BackgroundTaskResult.Failed;
        }

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced, // Balanced for battery efficiency in background
        });

        const { latitude, longitude } = location.coords;
        console.log(`[BackgroundFetch] Location obtained: ${latitude}, ${longitude}`);

        // 3. Update Backend
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        if (!apiUrl) {
            console.error('[BackgroundFetch] EXPO_PUBLIC_API_URL is not defined');
            return BackgroundTask.BackgroundTaskResult.Failed;
        }

        const response = await fetch(`${apiUrl}/location`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                lat: latitude,
                lng: longitude
            })
        });

        if (response.ok) {
            console.log(`[BackgroundFetch] Successfully updated location at ${now}`);
            return BackgroundTask.BackgroundTaskResult.NewData;
        } else {
            const errorText = await response.text();
            console.error(`[BackgroundFetch] Server error: ${response.status} - ${errorText}`);
            return BackgroundTask.BackgroundTaskResult.Failed;
        }
    } catch (error) {
        console.error(`[BackgroundFetch] Error:`, error);
        return BackgroundTask.BackgroundTaskResult.Failed;
    }
});
