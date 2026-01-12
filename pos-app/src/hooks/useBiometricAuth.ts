import * as LocalAuthentication from 'expo-local-authentication';
import { useState, useCallback } from 'react';

interface BiometricResult {
    success: boolean;
    error?: string;
}

export function useBiometricAuth() {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const checkBiometricAvailability = useCallback(async (): Promise<boolean> => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if (!compatible) return false;

        const enrolled = await LocalAuthentication.isEnrolledAsync();
        return enrolled;
    }, []);

    const authenticate = useCallback(async (
        promptMessage = 'Confirma tu identidad'
    ): Promise<BiometricResult> => {
        setIsAuthenticating(true);

        try {
            const isAvailable = await checkBiometricAvailability();
            if (!isAvailable) {
                return { success: false, error: 'Biometria no disponible' };
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage,
                fallbackLabel: 'Usar contraseña',
                disableDeviceFallback: false,
            });

            if (result.success) {
                return { success: true };
            }

            return {
                success: false,
                error: result.error || 'Autenticacion cancelada'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error de autenticacion'
            };
        } finally {
            setIsAuthenticating(false);
        }
    }, [checkBiometricAvailability]);

    const getSupportedTypes = useCallback(async (): Promise<string[]> => {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        return types.map(type => {
            switch (type) {
                case LocalAuthentication.AuthenticationType.FINGERPRINT:
                    return 'fingerprint';
                case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
                    return 'face';
                case LocalAuthentication.AuthenticationType.IRIS:
                    return 'iris';
                default:
                    return 'unknown';
            }
        });
    }, []);

    return {
        authenticate,
        checkBiometricAvailability,
        getSupportedTypes,
        isAuthenticating,
    };
}
