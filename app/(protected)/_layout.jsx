import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function ProtectedLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#f2f5f7',
                height: 60,
                paddingBottom: 10,
            },
            tabBarActiveTintColor: '#10b981',
            tabBarInactiveTintColor: '#253342',
            headerStyle: {
                backgroundColor: '#ffffff',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#253342',
            headerTitleStyle: {
                fontWeight: 'bold',
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="card"
                options={{
                    title: 'Card',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="card" size={24} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        alert('Card feature coming soon');
                    },
                }}
            />
            <Tabs.Screen
                name="recipients"
                options={{
                    title: 'Recipients',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={24} color={color} />
                    ),
                }}
                listeners={{
                    tabPress: (e) => {
                        e.preventDefault();
                        alert('Recipients feature coming soon');
                    },
                }}
            />
        </Tabs>
    );
}
