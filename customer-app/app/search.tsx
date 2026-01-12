import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useState } from 'react';

interface SearchResult {
    id: string;
    name: string;
    activePrinciple: string;
    price: number;
    isCheaper: boolean;
}

const mockResults: SearchResult[] = [
    { id: '1', name: 'Paracetamol Generico 500mg', activePrinciple: 'Paracetamol', price: 1990, isCheaper: true },
    { id: '2', name: 'Tapsin 500mg', activePrinciple: 'Paracetamol', price: 4990, isCheaper: false },
    { id: '3', name: 'Kitadol 500mg', activePrinciple: 'Paracetamol', price: 3990, isCheaper: false },
];

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = () => {
        if (query.trim()) {
            // In production: call AI search
            setResults(mockResults);
            setHasSearched(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Header */}
            <View style={styles.searchHeader}>
                <Text style={styles.title}>Buscar Bioequivalente</Text>
                <Text style={styles.subtitle}>
                    Escribe el nombre del medicamento caro y te mostramos la alternativa mas economica
                </Text>

                <View style={styles.searchBox}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ej: Tapsin, Kitadol..."
                        placeholderTextColor="#9CA3AF"
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Text style={styles.searchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Results */}
            {hasSearched && (
                <View style={styles.resultsSection}>
                    <Text style={styles.resultsTitle}>
                        Alternativas encontradas
                    </Text>

                    <FlatList
                        data={results}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => (
                            <View style={[styles.resultCard, index === 0 && styles.bestOption]}>
                                {index === 0 && (
                                    <View style={styles.bestBadge}>
                                        <Text style={styles.bestBadgeText}>MEJOR PRECIO</Text>
                                    </View>
                                )}

                                <View style={styles.resultContent}>
                                    <View>
                                        <Text style={styles.resultName}>{item.name}</Text>
                                        <Text style={styles.resultPrinciple}>{item.activePrinciple}</Text>
                                    </View>
                                    <View style={styles.priceContainer}>
                                        <Text style={[styles.resultPrice, index === 0 && styles.bestPrice]}>
                                            ${item.price.toLocaleString('es-CL')}
                                        </Text>
                                        {index === 0 && (
                                            <Text style={styles.savingsText}>
                                                Ahorras ${(mockResults[1].price - item.price).toLocaleString('es-CL')}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                <TouchableOpacity style={[styles.addButton, index === 0 && styles.addButtonPrimary]}>
                                    <Text style={[styles.addButtonText, index === 0 && styles.addButtonTextPrimary]}>
                                        Agregar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}

            {!hasSearched && (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>🔍</Text>
                    <Text style={styles.emptyText}>
                        Busca un medicamento de marca para encontrar su bioequivalente generico
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    searchHeader: { padding: 20 },
    title: { fontSize: 24, fontWeight: '700', color: '#2C3E50' },
    subtitle: { fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 20 },
    searchBox: { flexDirection: 'row', marginTop: 16, gap: 8 },
    searchInput: { flex: 1, backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, fontSize: 16 },
    searchButton: { backgroundColor: '#E07A5F', paddingHorizontal: 24, borderRadius: 12, justifyContent: 'center' },
    searchButtonText: { color: '#FFFFFF', fontWeight: '600' },
    resultsSection: { flex: 1, paddingHorizontal: 20 },
    resultsTitle: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 12 },
    resultCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12 },
    bestOption: { borderWidth: 2, borderColor: '#10B981' },
    bestBadge: { backgroundColor: '#10B981', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 12 },
    bestBadgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    resultContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    resultName: { fontSize: 16, fontWeight: '600', color: '#2C3E50' },
    resultPrinciple: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    priceContainer: { alignItems: 'flex-end' },
    resultPrice: { fontSize: 20, fontWeight: '700', color: '#2C3E50' },
    bestPrice: { color: '#10B981' },
    savingsText: { fontSize: 12, color: '#10B981', fontWeight: '500' },
    addButton: { backgroundColor: '#F3F4F6', paddingVertical: 12, borderRadius: 10, marginTop: 12, alignItems: 'center' },
    addButtonPrimary: { backgroundColor: '#2C3E50' },
    addButtonText: { color: '#374151', fontWeight: '600' },
    addButtonTextPrimary: { color: '#FFFFFF' },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyIcon: { fontSize: 64, marginBottom: 16 },
    emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
});
