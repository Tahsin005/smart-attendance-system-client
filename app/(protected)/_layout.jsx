import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { useLocationTracking } from '../../hooks/useLocationTracking';

export default function ProtectedLayout() {
    const { isAdmin } = useSelector((state) => state.auth);

    // global location tracking for authenticated users
    useLocationTracking();

    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#EAECEF',
                height: 65,
                paddingBottom: 15,
                paddingTop: 10,
            },
            tabBarActiveTintColor: '#F0B90B',
            tabBarInactiveTintColor: '#707A8A',
            tabBarLabelStyle: {
                fontFamily: 'sans-serif', // Fallback, managed by system
                fontSize: 10,
                fontWeight: '600',
            },
            headerStyle: {
                backgroundColor: '#ffffff',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#1E2329',
            headerTitleStyle: {
                fontWeight: 'bold',
                fontFamily: 'sans-serif',
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" size={22} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="admin"
                options={{
                    title: 'Admin',
                    headerShown: false,
                    href: isAdmin ? '/admin' : null,
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="shield-checkmark" size={22} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
