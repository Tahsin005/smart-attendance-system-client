import Constants, { AppOwnership } from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useGetTodaySessionQuery } from '../redux/api/workSessionApi';
import { LOCATION_TASK_NAME } from '../tasks/locationTask';

const isExpoGo = Constants.appOwnership === AppOwnership.Expo;

export const useLocationTracking = () => {
    const { data: sessionData, refetch } = useGetTodaySessionQuery();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            const statusMessage = `[AppState] Changed from ${appState.current} to ${nextAppState}`;
            const separator = '='.repeat(statusMessage.length);

            console.log('\n' + separator);
            console.log(statusMessage);
            console.log(separator + '\n');

            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                console.log('[LocationTracking] App returned to foreground, refetching session...');
                refetch();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [refetch]);

    useEffect(() => {
        const toggleTracking = async () => {
            const isWorking = sessionData?.success && sessionData?.data?.status === 'WORKING';

            if (isWorking) {
                // --- START tracking ---

                // 1. Request foreground permission
                const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
                if (fgStatus !== 'granted') {
                    console.warn('[LocationTracking] Foreground permission denied');
                    return;
                }

                // 2. Request background permission
                const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
                if (bgStatus !== 'granted') {
                    console.warn('[LocationTracking] Background permission denied');
                    return;
                }

                // 3. Skip in Expo Go (background location not supported)
                if (isExpoGo) {
                    console.log('[LocationTracking] Background location not supported in Expo Go');
                    return;
                }

                // 4. Start background location updates (if not already running)
                const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
                if (!isRegistered) {
                    console.log('[LocationTracking] Starting background location updates...');
                    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 30000,        // 30 seconds
                        distanceInterval: 0,         // fire on time interval alone, even when stationary
                        showsBackgroundLocationIndicator: true,
                        foregroundService: {
                            notificationTitle: 'Location Tracking Active',
                            notificationBody: 'Your location is being tracked during work hours.',
                        },
                    });
                    console.log('[LocationTracking] ✓ Background location started');
                } else {
                    console.log('[LocationTracking] Already tracking, skipping registration');
                }
            } else {
                // --- STOP tracking ---
                if (isExpoGo) return;

                try {
                    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
                    if (isRegistered) {
                        console.log('[LocationTracking] Stopping background location updates...');
                        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
                        console.log('[LocationTracking] ✓ Background location stopped');
                    }
                } catch (err) {
                    console.error('[LocationTracking] Failed to stop tracking:', err);
                }
            }
        };

        toggleTracking();
    }, [sessionData]);
};
