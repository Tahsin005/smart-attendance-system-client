import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="employees" />
            <Stack.Screen name="work-sessions" />
        </Stack>
    );
}
