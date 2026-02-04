import * as Location from 'expo-location';
import { useEffect, useRef } from 'react';
import { useGetTodaySessionQuery, useUpdateLocationMutation } from '../redux/api/workSessionApi';

export const useLocationTracking = () => {
    const { data: sessionData } = useGetTodaySessionQuery();
    const [updateLocation] = useUpdateLocationMutation();
    const intervalRef = useRef(null);

    useEffect(() => {
        const startTracking = async () => {
            const isWorking = sessionData?.success && sessionData?.data?.status === 'WORKING';

            if (isWorking) {
                // initial check for permissions
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('[LocationTracking] Permission denied');
                    return;
                }

                // set up interval for every 10 seconds
                if (!intervalRef.current) {
                    console.log('[LocationTracking] Starting timer...');
                    intervalRef.current = setInterval(async () => {
                        console.log('- [LocationTracking] TICK -');
                        try {
                            const location = await Location.getCurrentPositionAsync({
                                accuracy: Location.Accuracy.Highest,
                            });

                            const { latitude, longitude } = location.coords;

                            await updateLocation({
                                lat: latitude,
                                lng: longitude,
                            }).unwrap();

                            console.log(`[LocationTracking] Success (${new Date().toLocaleTimeString()}): ${latitude}, ${longitude}`);
                        } catch (error) {
                            console.error('[LocationTracking] Error:', error);
                        }
                    }, 10000);
                }
            } else {
                // if not working, clear existing tracker
                if (intervalRef.current) {
                    console.log('[LocationTracking] Stopping tracker (not working)...');
                    clearInterval(intervalRef.current);
                    intervalRef.current = null;
                }
            }
        };

        startTracking();

        return () => {
            if (intervalRef.current) {
                console.log('[LocationTracking] Cleanup: stopping timer');
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [sessionData, updateLocation]);
};
