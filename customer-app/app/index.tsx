import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

interface ReorderItem {
    id: string;
    name: string;
    lastPurchase: string;
    price: number;
}

const mockReorders: ReorderItem[] = [
    { id: '1', name: 'Losartan 50mg', lastPurchase: '2025-12-15', price: 8990 },
    { id: '2', name: 'Metformina 850mg', lastPurchase: '2025-12-20', price: 5990 },
];

export default function HomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.greeting}>Buenos dias, Maria</Text>
                <Text style={styles.subtitle}>Tu farmacia de confianza</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity
                    style={styles.primaryAction}
                    onPress={() => router.push('/prescription')}
                >
                    <Text style={styles.actionIcon}>📷</Text>
                    <Text style={styles.primaryActionText}>Subir Receta</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.secondaryAction}
                    onPress={() => router.push('/search')}
                >
                    <Text style={styles.actionIcon}>🔍</Text>
                    <Text style={styles.secondaryActionText}>Buscar Generico</Text>
                </TouchableOpacity>
            </View>

            {/* Reorder Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Volver a Pedir</Text>
                <Text style={styles.sectionSubtitle}>Tus medicamentos cronicos</Text>

                <FlatList
                    data={mockReorders}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.reorderList}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.reorderCard}>
                            <Text style={styles.reorderIcon}>💊</Text>
                            <Text style={styles.reorderName}>{item.name}</Text>
                            <Text style={styles.reorderPrice}>${item.price.toLocaleString('es-CL')}</Text>
                            <TouchableOpacity style={styles.reorderButton}>
                                <Text style={styles.reorderButtonText}>Pedir</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Health Tip */}
            <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>Consejo de Salud</Text>
                <Text style={styles.tipText}>
                    Recuerda tomar tus medicamentos a la misma hora todos los dias para mejores resultados.
                </Text>
            </View>

            {/* Notifications preview */}
            <View style={styles.notificationCard}>
                <Text style={styles.notificationIcon}>🔔</Text>
                <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>Recordatorio</Text>
                    <Text style={styles.notificationText}>Te quedan 5 pastillas de Losartan</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    header: { padding: 24, paddingTop: 16 },
    greeting: { fontSize: 28, fontWeight: '700', color: '#2C3E50' },
    subtitle: { fontSize: 16, color: '#6B7280', marginTop: 4 },
    quickActions: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
    primaryAction: { flex: 1, backgroundColor: '#E07A5F', padding: 20, borderRadius: 16, alignItems: 'center' },
    actionIcon: { fontSize: 32, marginBottom: 8 },
    primaryActionText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
    secondaryAction: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    secondaryActionText: { color: '#2C3E50', fontWeight: '600', fontSize: 16 },
    section: { padding: 16, marginTop: 8 },
    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
    sectionSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
    reorderList: { gap: 12 },
    reorderCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, width: 160, alignItems: 'center' },
    reorderIcon: { fontSize: 40, marginBottom: 8 },
    reorderName: { fontSize: 14, fontWeight: '600', color: '#2C3E50', textAlign: 'center' },
    reorderPrice: { fontSize: 16, fontWeight: '700', color: '#E07A5F', marginTop: 4 },
    reorderButton: { backgroundColor: '#2C3E50', paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8, marginTop: 12 },
    reorderButtonText: { color: '#FFFFFF', fontWeight: '600' },
    tipCard: { backgroundColor: '#E8EEF4', margin: 16, padding: 16, borderRadius: 12 },
    tipTitle: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 4 },
    tipText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    notificationCard: { backgroundColor: '#FFFFFF', margin: 16, marginTop: 0, padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    notificationIcon: { fontSize: 24 },
    notificationContent: { flex: 1 },
    notificationTitle: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
    notificationText: { fontSize: 14, color: '#6B7280' },
});
