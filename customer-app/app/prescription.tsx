import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Alert } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function PrescriptionScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitamos acceso a la camara para fotografiar tu receta');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const uploadPrescription = async () => {
        if (!image) return;

        setIsUploading(true);

        // Simulate upload
        setTimeout(() => {
            setIsUploading(false);
            setUploadSuccess(true);
        }, 2000);
    };

    if (uploadSuccess) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.successContainer}>
                    <Text style={styles.successIcon}>✅</Text>
                    <Text style={styles.successTitle}>Receta Enviada</Text>
                    <Text style={styles.successText}>
                        Tu receta fue recibida correctamente. Te notificaremos cuando tus medicamentos esten listos para retiro.
                    </Text>
                    <TouchableOpacity
                        style={styles.newButton}
                        onPress={() => { setImage(null); setUploadSuccess(false); }}
                    >
                        <Text style={styles.newButtonText}>Subir otra receta</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Subir Receta</Text>
                <Text style={styles.subtitle}>
                    Fotografía tu receta médica y la procesaremos para preparar tu pedido
                </Text>
            </View>

            {!image ? (
                <View style={styles.uploadArea}>
                    <TouchableOpacity style={styles.cameraButton} onPress={takePhoto}>
                        <Text style={styles.cameraIcon}>📷</Text>
                        <Text style={styles.cameraButtonText}>Tomar Foto</Text>
                    </TouchableOpacity>

                    <Text style={styles.orText}>o</Text>

                    <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
                        <Text style={styles.galleryButtonText}>Elegir de la Galería</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.previewArea}>
                    <Image source={{ uri: image }} style={styles.previewImage} />

                    <View style={styles.previewActions}>
                        <TouchableOpacity style={styles.retakeButton} onPress={() => setImage(null)}>
                            <Text style={styles.retakeButtonText}>Volver a tomar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.uploadButton, isUploading && styles.uploadingButton]}
                            onPress={uploadPrescription}
                            disabled={isUploading}
                        >
                            <Text style={styles.uploadButtonText}>
                                {isUploading ? 'Subiendo...' : 'Enviar Receta'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Información importante</Text>
                <Text style={styles.infoText}>
                    • Asegúrate de que la receta sea legible{'\n'}
                    • Incluye el sello del médico{'\n'}
                    • La receta debe estar vigente
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F4F8' },
    header: { padding: 20 },
    title: { fontSize: 24, fontWeight: '700', color: '#2C3E50' },
    subtitle: { fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 20 },
    uploadArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    cameraButton: { backgroundColor: '#E07A5F', width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center' },
    cameraIcon: { fontSize: 48, marginBottom: 8 },
    cameraButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 18 },
    orText: { color: '#9CA3AF', fontSize: 16, marginVertical: 20 },
    galleryButton: { borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
    galleryButtonText: { color: '#2C3E50', fontWeight: '600' },
    previewArea: { flex: 1, padding: 20 },
    previewImage: { flex: 1, borderRadius: 16, backgroundColor: '#E5E7EB' },
    previewActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
    retakeButton: { flex: 1, borderWidth: 2, borderColor: '#E5E7EB', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    retakeButtonText: { color: '#6B7280', fontWeight: '600' },
    uploadButton: { flex: 1, backgroundColor: '#2C3E50', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    uploadingButton: { backgroundColor: '#9CA3AF' },
    uploadButtonText: { color: '#FFFFFF', fontWeight: '700' },
    successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    successIcon: { fontSize: 80, marginBottom: 24 },
    successTitle: { fontSize: 28, fontWeight: '700', color: '#2C3E50', marginBottom: 12 },
    successText: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
    newButton: { marginTop: 32, backgroundColor: '#2C3E50', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
    newButtonText: { color: '#FFFFFF', fontWeight: '600' },
    infoCard: { backgroundColor: '#FFFFFF', margin: 16, padding: 16, borderRadius: 12 },
    infoTitle: { fontSize: 14, fontWeight: '600', color: '#2C3E50', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
});
