import { Tabs } from 'expo-router';
import { View, StyleSheet, AppState, AppStateStatus } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Search, Upload, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const queryClient = new QueryClient();

// Colores Nordic Pharma
const COLORS = {
    active: '#2C3E50',      // Navy Blue - Corporativo
    inactive: '#94A3B8',    // Slate Gray
    accent: '#E07A5F',      // Coral - Acento
    background: '#FFFFFF',
    border: '#E2E8F0',
};

/**
 * Componente de Pantalla de Privacidad.
 * Oculta el contenido cuando la app está en segundo plano.
 */
function PrivacyScreen({ children }: { children: React.ReactNode }) {
    const appState = useRef(AppState.currentState);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            // App pasando a segundo plano
            if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                setIsHidden(true);
            }
            // App volviendo a primer plano
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                setIsHidden(false);
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    return (
        <View style={styles.container}>
            {children}
            {isHidden && (
                <BlurView intensity={100} tint="light" style={styles.privacyOverlay}>
                    <View style={styles.privacyContent}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logo} />
                        </View>
                    </View>
                </BlurView>
            )}
        </View>
    );
}

/**
 * Componente de Icono de Tab con indicador de acción especial.
 */
function TabIcon({
    Icon,
    color,
    focused,
    isSpecial = false
}: {
    Icon: typeof Home;
    color: string;
    focused: boolean;
    isSpecial?: boolean;
}) {
    if (isSpecial) {
        return (
            <View style={styles.specialIconContainer}>
                <View style={[styles.specialIconBg, focused && styles.specialIconBgActive]}>
                    <Icon size={22} color={focused ? COLORS.background : COLORS.accent} strokeWidth={2.5} />
                </View>
            </View>
        );
    }

    return <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <PrivacyScreen>
                    <Tabs
                        screenOptions={{
                            headerShown: false,
                            tabBarStyle: {
                                backgroundColor: COLORS.background,
                                borderTopWidth: 1,
                                borderTopColor: COLORS.border,
                                height: 80,
                                paddingBottom: 20,
                                paddingTop: 10,
                            },
                            tabBarActiveTintColor: COLORS.active,
                            tabBarInactiveTintColor: COLORS.inactive,
                            tabBarLabelStyle: {
                                fontSize: 11,
                                fontWeight: '500',
                            },
                        }}
                    >
                        <Tabs.Screen
                            name="index"
                            options={{
                                title: 'Inicio',
                                tabBarIcon: ({ color, focused }) => (
                                    <TabIcon Icon={Home} color={color} focused={focused} />
                                ),
                            }}
                        />
                        <Tabs.Screen
                            name="search"
                            options={{
                                title: 'Buscar',
                                tabBarIcon: ({ color, focused }) => (
                                    <TabIcon Icon={Search} color={color} focused={focused} />
                                ),
                            }}
                        />
                        <Tabs.Screen
                            name="prescription"
                            options={{
                                title: 'Receta',
                                tabBarIcon: ({ color, focused }) => (
                                    <TabIcon Icon={Upload} color={color} focused={focused} isSpecial />
                                ),
                            }}
                        />
                        <Tabs.Screen
                            name="profile"
                            options={{
                                title: 'Perfil',
                                tabBarIcon: ({ color, focused }) => (
                                    <TabIcon Icon={User} color={color} focused={focused} />
                                ),
                            }}
                        />
                    </Tabs>
                </PrivacyScreen>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    privacyOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 9999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    privacyContent: {
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        backgroundColor: COLORS.active,
        borderRadius: 24,
    },
    specialIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    specialIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.background,
        borderWidth: 2,
        borderColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -4,
    },
    specialIconBgActive: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
});
