import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { FlashList } from '@shopify/flash-list';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    isControlled: boolean;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    activePrinciple: string;
    price: number;
    stock: number;
    isControlled: boolean;
}

// Mock products
const mockProducts: Product[] = [
    { id: '1', name: 'Paracetamol 500mg', sku: 'PAR500', activePrinciple: 'Paracetamol', price: 2990, stock: 45, isControlled: false },
    { id: '2', name: 'Ibuprofeno 400mg', sku: 'IBU400', activePrinciple: 'Ibuprofeno', price: 3490, stock: 32, isControlled: false },
    { id: '3', name: 'Clonazepam 2mg', sku: 'CLO2', activePrinciple: 'Clonazepam', price: 8990, stock: 10, isControlled: true },
];

export default function POSScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [pendingControlledItem, setPendingControlledItem] = useState<Product | null>(null);
    const [prescriptionData, setPrescriptionData] = useState({ patientRut: '', doctorName: '' });

    const filteredProducts = mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.activePrinciple.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = (product: Product) => {
        if (product.isControlled) {
            setPendingControlledItem(product);
            setShowPrescriptionModal(true);
            return;
        }

        addItemToCart(product);
    };

    const addItemToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, isControlled: product.isControlled }];
        });
    };

    const handlePrescriptionSubmit = () => {
        if (!prescriptionData.patientRut || !prescriptionData.doctorName) {
            Alert.alert('Error', 'Complete los datos de la receta');
            return;
        }

        if (pendingControlledItem) {
            addItemToCart(pendingControlledItem);
        }

        setShowPrescriptionModal(false);
        setPendingControlledItem(null);
        setPrescriptionData({ patientRut: '', doctorName: '' });
    };

    const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        Alert.alert('Venta Procesada', `Total: $${getTotal().toLocaleString('es-CL')}`);
        setCart([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
                {/* Products Panel (2/3) */}
                <View style={styles.productsPanel}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar producto o principio activo..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <FlashList
                        data={filteredProducts}
                        estimatedItemSize={80}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.productCard}
                                onPress={() => addToCart(item)}
                            >
                                <View style={styles.productInfo}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrinciple}>{item.activePrinciple}</Text>
                                    {item.isControlled && (
                                        <View style={styles.controlledBadge}>
                                            <Text style={styles.controlledText}>Receta</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.productMeta}>
                                    <Text style={styles.productPrice}>${item.price.toLocaleString('es-CL')}</Text>
                                    <Text style={styles.productStock}>Stock: {item.stock}</Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Cart Panel (1/3) */}
                <View style={styles.cartPanel}>
                    <Text style={styles.cartTitle}>Carrito</Text>

                    <FlatList
                        data={cart}
                        keyExtractor={item => item.id}
                        style={styles.cartList}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <View>
                                    <Text style={styles.cartItemName}>{item.name}</Text>
                                    <Text style={styles.cartItemQty}>x{item.quantity}</Text>
                                </View>
                                <Text style={styles.cartItemPrice}>
                                    ${(item.price * item.quantity).toLocaleString('es-CL')}
                                </Text>
                            </View>
                        )}
                    />

                    <View style={styles.cartFooter}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>TOTAL</Text>
                            <Text style={styles.totalValue}>${getTotal().toLocaleString('es-CL')}</Text>
                        </View>

                        <TouchableOpacity
                            style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]}
                            onPress={handleCheckout}
                            disabled={cart.length === 0}
                        >
                            <Text style={styles.checkoutText}>COBRAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Prescription Modal */}
            <Modal visible={showPrescriptionModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Datos de Receta</Text>
                        <Text style={styles.modalSubtitle}>
                            {pendingControlledItem?.name} requiere receta medica
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="RUT Paciente"
                            value={prescriptionData.patientRut}
                            onChangeText={v => setPrescriptionData(p => ({ ...p, patientRut: v }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Nombre Medico"
                            value={prescriptionData.doctorName}
                            onChangeText={v => setPrescriptionData(p => ({ ...p, doctorName: v }))}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setShowPrescriptionModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalConfirmBtn}
                                onPress={handlePrescriptionSubmit}
                            >
                                <Text style={styles.modalConfirmText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    mainContent: { flex: 1, flexDirection: 'row' },
    productsPanel: { flex: 2, padding: 16 },
    searchInput: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, fontSize: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    productCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productInfo: { flex: 1 },
    productName: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
    productPrinciple: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    controlledBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
    controlledText: { fontSize: 12, color: '#DC2626', fontWeight: '600' },
    productMeta: { alignItems: 'flex-end' },
    productPrice: { fontSize: 18, fontWeight: '700', color: '#2C3E50' },
    productStock: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
    cartPanel: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderLeftWidth: 1, borderLeftColor: '#E5E7EB' },
    cartTitle: { fontSize: 20, fontWeight: '700', color: '#2C3E50', marginBottom: 16 },
    cartList: { flex: 1 },
    cartItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    cartItemName: { fontSize: 14, fontWeight: '500', color: '#374151' },
    cartItemQty: { fontSize: 12, color: '#9CA3AF' },
    cartItemPrice: { fontSize: 14, fontWeight: '600', color: '#2C3E50' },
    cartFooter: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 16 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    totalLabel: { fontSize: 16, fontWeight: '600', color: '#6B7280' },
    totalValue: { fontSize: 24, fontWeight: '700', color: '#2C3E50' },
    checkoutButton: { backgroundColor: '#2C3E50', paddingVertical: 18, borderRadius: 12, alignItems: 'center' },
    disabledButton: { backgroundColor: '#D1D5DB' },
    checkoutText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, width: '80%', maxWidth: 400 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#2C3E50', marginBottom: 8 },
    modalSubtitle: { fontSize: 14, color: '#6B7280', marginBottom: 20 },
    modalInput: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 12, fontSize: 16 },
    modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
    modalCancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
    modalCancelText: { color: '#6B7280', fontWeight: '600' },
    modalConfirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: '#2C3E50', alignItems: 'center' },
    modalConfirmText: { color: '#FFFFFF', fontWeight: '600' },
});
