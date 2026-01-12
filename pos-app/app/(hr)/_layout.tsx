import { Stack } from 'expo-router';

export default function HRLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#2C3E50',
            }}
        >
            <Stack.Screen name="dashboard" options={{ title: 'Mi Portal' }} />
            <Stack.Screen name="payrolls" options={{ title: 'Liquidaciones' }} />
        </Stack>
    );
}
