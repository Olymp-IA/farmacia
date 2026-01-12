import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivacyScreen } from '../src/components/PrivacyScreen';

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <PrivacyScreen>
                <Stack
                    screenOptions={{
                        headerStyle: { backgroundColor: '#2C3E50' },
                        headerTintColor: '#FFFFFF',
                        headerTitleStyle: { fontWeight: '600' },
                    }}
                >
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="(pos)" options={{ headerShown: false }} />
                    <Stack.Screen name="(wms)" options={{ headerShown: false }} />
                    <Stack.Screen name="(hr)" options={{ headerShown: false }} />
                </Stack>
            </PrivacyScreen>
        </QueryClientProvider>
    );
}
