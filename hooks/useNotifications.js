import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useRegisterDeviceMutation } from '../redux/api/notificationApi';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [registerDevice] = useRegisterDeviceMutation();

    useEffect(() => {
        console.log('[useNotifications] Effect triggered. isAuthenticated:', isAuthenticated);
        registerForPushNotificationsAsync().then((token) => {
            console.log('[useNotifications] Token retrieved:', token);
            setExpoPushToken(token);
            if (token && isAuthenticated && user) {
                console.log('[useNotifications] Registering device with backend...');
                registerDevice({ expoPushToken: token })
                    .unwrap()
                    .then(() => console.log('[useNotifications] Backend registration success'))
                    .catch((err) => console.error('[useNotifications] Backend registration failed:', err));
            } else {
                console.log('[useNotifications] Registration skipped. Token:', !!token, 'Auth:', isAuthenticated, 'User:', !!user);
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log('Notification response:', response);
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, [isAuthenticated, user]);

    const registerPushToken = async () => {
        if (expoPushToken && isAuthenticated && user) {
            console.log('[useNotifications] Manually registering device...');
            try {
                await registerDevice({ expoPushToken }).unwrap();
                console.log('[useNotifications] Manual registration success');
                return true;
            } catch (err) {
                console.error('[useNotifications] Manual registration failed:', err);
                return false;
            }
        }
        return false;
    };

    return {
        expoPushToken,
        notification,
        registerPushToken,
    };
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: '408df134-8185-49b3-91fb-372160910ee0', // From app.json
        })).data;
        console.log('Expo Push Token:', token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}
