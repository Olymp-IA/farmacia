import { Stack } from 'expo-router';

export default function WMSLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#1F2937' },
                headerTintColor: '#FFFFFF',
                contentStyle: { backgroundColor: '#111827' },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Tareas de Picking' }} />
            <Stack.Screen name="picking" options={{ title: 'Ruta de Picking' }} />
        </Stack>
    );
}
