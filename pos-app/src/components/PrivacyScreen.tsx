import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus, View, StyleSheet, Image } from 'react-native';

interface PrivacyScreenProps {
    children: React.ReactNode;
}

/**
 * Privacy Screen Component
 * Shows a blur/logo overlay when app goes to background
 * Prevents sensitive data from appearing in app switcher
 */
export function PrivacyScreen({ children }: PrivacyScreenProps) {
    const appState = useRef(AppState.currentState);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (
                appState.current === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                // App going to background - show privacy screen
                setIsHidden(true);
            }

            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // App coming to foreground - hide privacy screen
                setIsHidden(false);
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            {children}
            {isHidden && (
                <View style={styles.privacyOverlay}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logo}>
                            <View style={styles.logoText}>
                                {/* Logo placeholder - in production use actual logo */}
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    privacyOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#2C3E50',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        backgroundColor: '#F0F4F8',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        width: 80,
        height: 80,
        backgroundColor: '#E07A5F',
        borderRadius: 16,
    },
});
