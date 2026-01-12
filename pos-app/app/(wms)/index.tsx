import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

interface PickingTask {
    id: string;
    orderId: string;
    itemCount: number;
    priority: 'high' | 'normal';
    estimatedTime: number;
}

const mockTasks: PickingTask[] = [
    { id: '1', orderId: 'ORD-2026-001', itemCount: 5, priority: 'high', estimatedTime: 8 },
    { id: '2', orderId: 'ORD-2026-002', itemCount: 3, priority: 'normal', estimatedTime: 5 },
    { id: '3', orderId: 'ORD-2026-003', itemCount: 8, priority: 'normal', estimatedTime: 12 },
];

export default function WMSIndexScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tareas Pendientes</Text>
                <Text style={styles.headerSubtitle}>{mockTasks.length} ordenes por procesar</Text>
            </View>

            <FlatList
                data={mockTasks}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.taskCard}
                        onPress={() => router.push({ pathname: '/(wms)/picking', params: { taskId: item.id } })}
                    >
                        <View style={styles.taskHeader}>
                            <Text style={styles.taskOrderId}>{item.orderId}</Text>
                            {item.priority === 'high' && (
                                <View style={styles.priorityBadge}>
                                    <Text style={styles.priorityText}>URGENTE</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.taskMeta}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Items</Text>
                                <Text style={styles.metaValue}>{item.itemCount}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Tiempo est.</Text>
                                <Text style={styles.metaValue}>{item.estimatedTime} min</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.startButtonText}>INICIAR PICKING</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827' },
    header: { padding: 20 },
    headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
    headerSubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
    list: { padding: 16 },
    taskCard: { backgroundColor: '#1F2937', borderRadius: 16, padding: 20, marginBottom: 12 },
    taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    taskOrderId: { fontSize: 18, fontWeight: '600', color: '#FFFFFF' },
    priorityBadge: { backgroundColor: '#DC2626', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    priorityText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    taskMeta: { flexDirection: 'row', gap: 24, marginBottom: 16 },
    metaItem: {},
    metaLabel: { fontSize: 12, color: '#6B7280' },
    metaValue: { fontSize: 20, fontWeight: '700', color: '#FFFFFF' },
    startButton: { backgroundColor: '#3B82F6', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    startButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
