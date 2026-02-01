import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

/**
 * Hook to manage camera and location permissions
 * Provides unified interface for requesting and tracking permissions
 */
export function usePermissions() {
    const [cameraPermission, setCameraPermission] = useState(null);
    const [locationPermission, setLocationPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // check current permissions on mount
    useEffect(() => {
        checkPermissions();
    }, []);

    const checkPermissions = async () => {
        try {
            const [cameraStatus, locationStatus] = await Promise.all([
                Camera.getCameraPermissionsAsync(),
                Location.getForegroundPermissionsAsync(),
            ]);
            setCameraPermission(cameraStatus.status);
            setLocationPermission(locationStatus.status);
        } catch (error) {
            console.error('Error checking permissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const requestCameraPermission = useCallback(async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(status);

            if (status !== 'granted') {
                Alert.alert(
                    'Camera Permission Required',
                    'Please enable camera access in your device settings to take attendance selfies.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting camera permission:', error);
            return false;
        }
    }, []);

    const requestLocationPermission = useCallback(async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status);

            if (status !== 'granted') {
                Alert.alert(
                    'Location Permission Required',
                    'Please enable location access to verify your attendance location.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() },
                    ]
                );
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error requesting location permission:', error);
            return false;
        }
    }, []);

    const requestAllPermissions = useCallback(async () => {
        const cameraGranted = await requestCameraPermission();
        if (!cameraGranted) return false;

        const locationGranted = await requestLocationPermission();
        return locationGranted;
    }, [requestCameraPermission, requestLocationPermission]);

    return {
        cameraPermission,
        locationPermission,
        hasCameraPermission: cameraPermission === 'granted',
        hasLocationPermission: locationPermission === 'granted',
        hasAllPermissions: cameraPermission === 'granted' && locationPermission === 'granted',
        isLoading,
        requestCameraPermission,
        requestLocationPermission,
        requestAllPermissions,
        checkPermissions,
    };
}
