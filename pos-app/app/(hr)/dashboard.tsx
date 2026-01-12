import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HRDashboard() {
    const router = useRouter();

    // Mock data
    const salesThisMonth = 2450000;
    const estimatedCommission = 73500;
    const salesTarget = 3000000;
    const salesProgress = Math.min((salesThisMonth / salesTarget) * 100, 100);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hola, Juan</Text>
                <Text style={styles.date}>Enero 2026</Text>
            </View>

            {/* Sales Card */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Ventas del Mes</Text>
                <Text style={styles.salesAmount}>${salesThisMonth.toLocaleString('es-CL')}</Text>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${salesProgress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{salesProgress.toFixed(0)}% de meta</Text>
                </View>
            </View>

            {/* Commission Card */}
            <View style={[styles.card, styles.commissionCard]}>
                <Text style={styles.cardTitle}>Comision Estimada</Text>
                <Text style={styles.commissionAmount}>${estimatedCommission.toLocaleString('es-CL')}</Text>
                <Text style={styles.commissionNote}>Basado en tasa del 3%</Text>
            </View>

            {/* Simple Chart Placeholder */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Tendencia Semanal</Text>
                <View style={styles.chartPlaceholder}>
                    {[30, 45, 38, 60, 55, 70, 65].map((height, index) => (
                        <View
                            key={index}
                            style={[styles.barChart, { height: height * 1.5 }]}
                        />
                    ))}
                </View>
                <View style={styles.chartLabels}>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                        <Text key={index} style={styles.chartLabel}>{day}</Text>
                    ))}
                </View>
            </View>

            {/* Actions */}
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/(hr)/payrolls')}
            >
                <Text style={styles.actionButtonText}>Ver Liquidaciones</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    header: { padding: 20 },
    greeting: { fontSize: 28, fontWeight: '700', color: '#2C3E50' },
    date: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    card: { backgroundColor: '#FFFFFF', marginHorizontal: 16, marginBottom: 16, padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    cardTitle: { fontSize: 14, color: '#6B7280', fontWeight: '600', marginBottom: 8 },
    salesAmount: { fontSize: 36, fontWeight: '700', color: '#2C3E50' },
    progressContainer: { marginTop: 16 },
    progressBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 4 },
    progressText: { fontSize: 12, color: '#6B7280', marginTop: 6 },
    commissionCard: { backgroundColor: '#2C3E50' },
    commissionAmount: { fontSize: 36, fontWeight: '700', color: '#FFFFFF' },
    commissionNote: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
    chartPlaceholder: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 16 },
    barChart: { width: 24, backgroundColor: '#E07A5F', borderRadius: 4 },
    chartLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    chartLabel: { width: 24, textAlign: 'center', color: '#9CA3AF', fontSize: 12 },
    actionButton: { marginHorizontal: 16, backgroundColor: '#2C3E50', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
