import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { useState } from 'react';

export default function ProfileScreen() {
    const [biometricEnabled, setBiometricEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>MA</Text>
                </View>
                <Text style={styles.name}>Maria Gonzalez</Text>
                <Text style={styles.email}>maria.gonzalez@email.com</Text>
            </View>

            {/* Health Profile */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil de Salud</Text>

                <TouchableOpacity style={styles.menuItem}>
                    <View>
                        <Text style={styles.menuItemTitle}>Alergias</Text>
                        <Text style={styles.menuItemSubtitle}>Penicilina, Mariscos</Text>
                    </View>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <View>
                        <Text style={styles.menuItemTitle}>Condiciones Cronicas</Text>
                        <Text style={styles.menuItemSubtitle}>Hipertension</Text>
                    </View>
                    <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
            </View>

            {/* Settings */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Configuracion</Text>

                <View style={styles.toggleItem}>
                    <View>
                        <Text style={styles.menuItemTitle}>Acceso con Biometria</Text>
                        <Text style={styles.menuItemSubtitle}>Face ID / Touch ID</Text>
                    </View>
                    <Switch
                        value={biometricEnabled}
                        onValueChange={setBiometricEnabled}
                        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                    />
                </View>

                <View style={styles.toggleItem}>
                    <View>
                        <Text style={styles.menuItemTitle}>Notificaciones</Text>
                        <Text style={styles.menuItemSubtitle}>Recordatorios de medicamentos</Text>
                    </View>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                    />
                </View>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Cerrar Sesion</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    header: { alignItems: 'center', padding: 24, backgroundColor: '#FFFFFF' },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2C3E50', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
    name: { fontSize: 22, fontWeight: '700', color: '#2C3E50' },
    email: { fontSize: 14, color: '#6B7280', marginTop: 4 },
    section: { backgroundColor: '#FFFFFF', marginTop: 16, padding: 16 },
    sectionTitle: { fontSize: 12, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 12 },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    menuItemTitle: { fontSize: 16, fontWeight: '500', color: '#2C3E50' },
    menuItemSubtitle: { fontSize: 14, color: '#6B7280', marginTop: 2 },
    menuArrow: { fontSize: 24, color: '#9CA3AF' },
    toggleItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    logoutButton: { margin: 16, borderWidth: 1, borderColor: '#EF4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    logoutText: { color: '#EF4444', fontWeight: '600' },
});
