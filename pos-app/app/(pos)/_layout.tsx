import { Stack } from 'expo-router';

export default function POSLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#2C3E50' },
                headerTintColor: '#FFFFFF',
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: 'Punto de Venta',
                    headerLargeTitle: true,
                }}
            />
        </Stack>
    );
}
