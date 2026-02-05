import * as BackgroundTask from 'expo-background-task';
import Constants, { AppOwnership } from 'expo-constants';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useGetTodaySessionQuery } from '../redux/api/workSessionApi';
import { LOCATION_UPDATE_TASK } from '../tasks/locationTask';

const isExpoGo = Constants.appOwnership === AppOwnership.Expo;

export const useLocationTracking = () => {
    const { data: sessionData } = useGetTodaySessionQuery();
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            const statusMessage = `[AppState] Changed from ${appState.current} to ${nextAppState}`;
            const separator = '='.repeat(statusMessage.length);

            console.log('\n' + separator);
            console.log(statusMessage);
            console.log(separator + '\n');

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const toggleTracking = async () => {
            const isWorking = sessionData?.success && sessionData?.data?.status === 'WORKING';

            if (isWorking) {
                // request Permissions (Foreground + Background)
                const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
                if (fgStatus !== 'granted') {
                    console.warn('[LocationTracking] Foreground permission denied');
                    return;
                }

                const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
                if (bgStatus !== 'granted') {
                    console.warn('[LocationTracking] Background permission denied');
                }

                if (isExpoGo) {
                    console.log('[LocationTracking] Background Task is not supported in Expo Go. Skipping registration.');
                    return;
                }

                try {
                    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_UPDATE_TASK);
                    if (!isRegistered) {
                        console.log('[LocationTracking] Registering Background Fetch...');
                        await BackgroundTask.registerTaskAsync(LOCATION_UPDATE_TASK, {
                            minimumInterval: 15 * 60, // 15 minutes
                            stopOnTerminate: false,
                            startOnBoot: true,
                        });
                        console.log('[LocationTracking] Background Fetch registered successfully.');
                    }
                } catch (err) {
                    console.error('[LocationTracking] Registration failed:', err);
                }
            } else {
                // unregister if not working
                if (isExpoGo) return;

                try {
                    const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_UPDATE_TASK);
                    if (isRegistered) {
                        console.log('[LocationTracking] Unregistering Background Fetch (not working)...');
                        await BackgroundTask.unregisterTaskAsync(LOCATION_UPDATE_TASK);
                    }
                } catch (err) {
                    console.error('[LocationTracking] Unregistration failed:', err);
                }
            }
        };

        toggleTracking();
    }, [sessionData]);
};
