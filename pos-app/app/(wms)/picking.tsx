import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';

interface PickingItem {
    sequence: number;
    zoneName: string;
    binCode: string;
    productName: string;
    quantity: number;
    picked: boolean;
}

const mockRoute: PickingItem[] = [
    { sequence: 1, zoneName: 'ZONA-A', binCode: 'A-01-02', productName: 'Paracetamol 500mg', quantity: 5, picked: false },
    { sequence: 2, zoneName: 'ZONA-A', binCode: 'A-02-01', productName: 'Ibuprofeno 400mg', quantity: 3, picked: false },
    { sequence: 3, zoneName: 'ZONA-B', binCode: 'B-03-04', productName: 'Omeprazol 20mg', quantity: 2, picked: false },
];

export default function PickingScreen() {
    const [items, setItems] = useState<PickingItem[]>(mockRoute);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScan = () => {
        // Simulate successful scan
        Alert.alert('Escaneado', `Producto verificado: ${items[currentIndex].productName}`, [
            { text: 'Confirmar', onPress: confirmPick }
        ]);
    };

    const confirmPick = () => {
        setItems(prev => prev.map((item, index) =>
            index === currentIndex ? { ...item, picked: true } : item
        ));

        if (currentIndex < items.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            Alert.alert('Completado', 'Picking finalizado correctamente');
        }
    };

    const currentItem = items[currentIndex];
    const pickedCount = items.filter(i => i.picked).length;

    return (
        <SafeAreaView style={styles.container}>
            {/* Progress */}
            <View style={styles.progress}>
                <View style={[styles.progressBar, { width: `${(pickedCount / items.length) * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{pickedCount} de {items.length} items</Text>

            {/* Current Item */}
            <View style={styles.currentCard}>
                <View style={styles.locationBadge}>
                    <Text style={styles.locationZone}>{currentItem.zoneName}</Text>
                    <Text style={styles.locationBin}>{currentItem.binCode}</Text>
                </View>

                <Text style={styles.productName}>{currentItem.productName}</Text>
                <Text style={styles.quantity}>Cantidad: <Text style={styles.quantityValue}>{currentItem.quantity}</Text></Text>

                <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
                    <Text style={styles.scanButtonText}>ESCANEAR CODIGO</Text>
                </TouchableOpacity>
            </View>

            {/* Route List */}
            <Text style={styles.routeTitle}>Ruta Optimizada</Text>
            <FlatList
                data={items}
                keyExtractor={(_, index) => index.toString()}
                style={styles.routeList}
                renderItem={({ item, index }) => (
                    <View style={[styles.routeItem, item.picked && styles.routeItemPicked, index === currentIndex && styles.routeItemCurrent]}>
                        <View style={styles.sequenceBadge}>
                            <Text style={styles.sequenceText}>{item.sequence}</Text>
                        </View>
                        <View style={styles.routeItemInfo}>
                            <Text style={[styles.routeItemBin, item.picked && styles.textPicked]}>{item.binCode}</Text>
                            <Text style={[styles.routeItemProduct, item.picked && styles.textPicked]}>{item.productName}</Text>
                        </View>
                        {item.picked && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827' },
    progress: { height: 4, backgroundColor: '#374151', margin: 16, borderRadius: 2 },
    progressBar: { height: '100%', backgroundColor: '#10B981', borderRadius: 2 },
    progressText: { color: '#9CA3AF', textAlign: 'center', marginBottom: 16 },
    currentCard: { backgroundColor: '#1F2937', margin: 16, padding: 24, borderRadius: 16, borderWidth: 2, borderColor: '#3B82F6' },
    locationBadge: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    locationZone: { backgroundColor: '#3B82F6', color: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, fontWeight: '700' },
    locationBin: { backgroundColor: '#374151', color: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, fontWeight: '700', fontSize: 18 },
    productName: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', marginBottom: 8 },
    quantity: { fontSize: 16, color: '#9CA3AF' },
    quantityValue: { fontSize: 24, fontWeight: '700', color: '#10B981' },
    scanButton: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 12, marginTop: 20, alignItems: 'center' },
    scanButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    routeTitle: { color: '#9CA3AF', fontSize: 14, fontWeight: '600', marginHorizontal: 16, marginTop: 8 },
    routeList: { flex: 1, paddingHorizontal: 16 },
    routeItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', padding: 12, borderRadius: 10, marginTop: 8 },
    routeItemPicked: { opacity: 0.5 },
    routeItemCurrent: { borderWidth: 1, borderColor: '#3B82F6' },
    sequenceBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    sequenceText: { color: '#FFFFFF', fontWeight: '700' },
    routeItemInfo: { flex: 1 },
    routeItemBin: { color: '#FFFFFF', fontWeight: '600' },
    routeItemProduct: { color: '#9CA3AF', fontSize: 12 },
    textPicked: { textDecorationLine: 'line-through' },
    checkmark: { color: '#10B981', fontSize: 20 },
});
