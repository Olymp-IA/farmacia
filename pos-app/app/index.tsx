import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { authStorage, UserData } from '../src/hooks/useAuthStorage';

export default function HomeScreen() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await authStorage.getUser();
        setUser(userData);
    };

    const navigateByRole = (role: string) => {
        switch (role) {
            case 'SELLER':
            case 'PHARMACIST':
                router.push('/(pos)');
                break;
            case 'WAREHOUSE_OP':
                router.push('/(wms)');
                break;
            case 'HR_MANAGER':
                router.push('/(hr)');
                break;
            default:
                router.push('/(pos)');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo}>Farmacia<Text style={styles.logoAccent}>Nordic</Text></Text>
                <Text style={styles.subtitle}>Sistema de Gestion</Text>
            </View>

            <View style={styles.modulesGrid}>
                <TouchableOpacity
                    style={[styles.moduleCard, styles.posCard]}
                    onPress={() => router.push('/(pos)')}
                >
                    <Text style={styles.moduleIcon}>🛒</Text>
                    <Text style={styles.moduleTitle}>Punto de Venta</Text>
                    <Text style={styles.moduleDesc}>Ventas y cobros</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moduleCard, styles.wmsCard]}
                    onPress={() => router.push('/(wms)')}
                >
                    <Text style={styles.moduleIcon}>📦</Text>
                    <Text style={styles.moduleTitle}>Bodega</Text>
                    <Text style={styles.moduleDesc}>Picking y stock</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.moduleCard, styles.hrCard]}
                    onPress={() => router.push('/(hr)')}
                >
                    <Text style={styles.moduleIcon}>👤</Text>
                    <Text style={styles.moduleTitle}>Mi Portal</Text>
                    <Text style={styles.moduleDesc}>Liquidaciones</Text>
                </TouchableOpacity>
            </View>

            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.fullName}</Text>
                    <Text style={styles.userRole}>{user.role}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F4F8',
    },
    header: {
        padding: 24,
        alignItems: 'center',
    },
    logo: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2C3E50',
    },
    logoAccent: {
        color: '#E07A5F',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginTop: 4,
    },
    modulesGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moduleCard: {
        width: 180,
        height: 180,
        borderRadius: 24,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    posCard: {
        backgroundColor: '#2C3E50',
    },
    wmsCard: {
        backgroundColor: '#1F2937',
    },
    hrCard: {
        backgroundColor: '#FFFFFF',
    },
    moduleIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    moduleDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
    },
    userInfo: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2C3E50',
    },
    userRole: {
        fontSize: 14,
        color: '#6B7280',
    },
});
