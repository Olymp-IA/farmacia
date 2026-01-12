import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useBiometricAuth } from '../../src/hooks/useBiometricAuth';

interface Payroll {
    id: string;
    period: string;
    totalLiquid: number;
    baseSalary: number;
    commission: number;
    date: string;
}

const mockPayrolls: Payroll[] = [
    { id: '1', period: 'Enero 2026', totalLiquid: 923500, baseSalary: 850000, commission: 73500, date: '2026-01-31' },
    { id: '2', period: 'Diciembre 2025', totalLiquid: 915000, baseSalary: 850000, commission: 65000, date: '2025-12-31' },
    { id: '3', period: 'Noviembre 2025', totalLiquid: 902000, baseSalary: 850000, commission: 52000, date: '2025-11-30' },
];

export default function PayrollsScreen() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [payrolls, setPayrolls] = useState<Payroll[]>([]);
    const { authenticate, checkBiometricAvailability } = useBiometricAuth();

    useEffect(() => {
        requestBiometricAuth();
    }, []);

    const requestBiometricAuth = async () => {
        const available = await checkBiometricAvailability();

        if (!available) {
            // Fallback: just show the data (or require password)
            setIsAuthenticated(true);
            setPayrolls(mockPayrolls);
            return;
        }

        const result = await authenticate('Confirma tu identidad para ver liquidaciones');

        if (result.success) {
            setIsAuthenticated(true);
            setPayrolls(mockPayrolls);
        } else {
            Alert.alert('Acceso Denegado', result.error || 'No se pudo verificar tu identidad');
        }
    };

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.lockScreen}>
                    <Text style={styles.lockIcon}>🔒</Text>
                    <Text style={styles.lockTitle}>Contenido Protegido</Text>
                    <Text style={styles.lockSubtitle}>Usa Face ID o Touch ID para acceder</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={requestBiometricAuth}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={payrolls}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.payrollCard}>
                        <View style={styles.payrollHeader}>
                            <Text style={styles.payrollPeriod}>{item.period}</Text>
                            <Text style={styles.payrollDate}>{new Date(item.date).toLocaleDateString('es-CL')}</Text>
                        </View>

                        <View style={styles.payrollDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Sueldo Base</Text>
                                <Text style={styles.detailValue}>${item.baseSalary.toLocaleString('es-CL')}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Comision</Text>
                                <Text style={[styles.detailValue, styles.commissionValue]}>+${item.commission.toLocaleString('es-CL')}</Text>
                            </View>
                            <View style={[styles.detailRow, styles.totalRow]}>
                                <Text style={styles.totalLabel}>Liquido</Text>
                                <Text style={styles.totalValue}>${item.totalLiquid.toLocaleString('es-CL')}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.downloadButton}>
                            <Text style={styles.downloadButtonText}>Descargar PDF</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    lockScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    lockIcon: { fontSize: 64, marginBottom: 20 },
    lockTitle: { fontSize: 24, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
    lockSubtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
    retryButton: { marginTop: 24, backgroundColor: '#2C3E50', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 10 },
    retryButtonText: { color: '#FFFFFF', fontWeight: '600' },
    list: { padding: 16 },
    payrollCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    payrollHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    payrollPeriod: { fontSize: 18, fontWeight: '700', color: '#2C3E50' },
    payrollDate: { fontSize: 14, color: '#9CA3AF' },
    payrollDetails: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 16 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    detailLabel: { fontSize: 14, color: '#6B7280' },
    detailValue: { fontSize: 14, fontWeight: '500', color: '#374151' },
    commissionValue: { color: '#10B981' },
    totalRow: { borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 12, marginTop: 8 },
    totalLabel: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
    totalValue: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
    downloadButton: { marginTop: 16, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    downloadButtonText: { color: '#2C3E50', fontWeight: '600' },
});
