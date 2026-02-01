import * as Location from 'expo-location';
import { useCallback } from 'react';
import { Alert } from 'react-native';

/**
 * Hook to capture current GPS location
 * Provides getCurrentLocation function with error handling
 */
export function useLocation() {
    const getCurrentLocation = useCallback(async () => {
        try {
            // check permission first
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Location Access Required',
                    'Please grant location permission to record your attendance location.'
                );
                return null;
            }

            // get current position with high accuracy
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 5000,
                distanceInterval: 0,
            });

            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
        } catch (error) {
            console.error('Error getting location:', error);

            // handle specific error cases
            if (error.code === 'E_LOCATION_SERVICES_DISABLED') {
                Alert.alert(
                    'Location Services Disabled',
                    'Please enable location services on your device to record attendance.'
                );
            } else if (error.code === 'E_LOCATION_TIMEOUT') {
                Alert.alert(
                    'Location Timeout',
                    'Unable to get your location. Please try again in an open area.'
                );
            } else {
                Alert.alert(
                    'Location Error',
                    'Failed to get your current location. Please try again.'
                );
            }

            return null;
        }
    }, []);

    return {
        getCurrentLocation,
    };
}
