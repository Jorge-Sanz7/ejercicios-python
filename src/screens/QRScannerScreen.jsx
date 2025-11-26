// Archivo: src/screens/QRScannerScreen.jsx

import React, { useState, useEffect, useRef } from 'react'; // 1. Importamos useRef
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../utils/constants';

const QRScannerScreen = ({ navigation }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    
    // 2. Creamos un "candado" que funciona a la velocidad de la luz
    const lockRef = useRef(false); 

    // Reiniciamos el candado cuando entramos a la pantalla
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
            lockRef.current = false; // Abrimos el candado al volver
        });
        return unsubscribe;
    }, [navigation]);

    if (!permission) return <View style={styles.container} />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>Necesitamos acceso a tu cámara.</Text>
                <Button onPress={requestPermission} title="Conceder Permiso" color={COLORS.primary} />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }) => {
        // 3. Si el candado está cerrado o ya escaneamos, NO HACEMOS NADA.
        // Esto detiene la "ametralladora" de logs inmediatamente.
        if (scanned || lockRef.current) return;

        // 4. Cerramos el candado inmediatamente
        lockRef.current = true; 
        setScanned(true);
        
        try {
            console.log("QR Detectado (Único):", data); // Ahora solo verás uno
            
            const parsedData = JSON.parse(data);

            if (parsedData.id_restaurante) {
                navigation.navigate('Menu', { 
                    restaurantId: parsedData.id_restaurante,
                    tableId: parsedData.table_id || 0 
                });
            } else {
                throw new Error("Formato inválido");
            }

        } catch (error) {
            Alert.alert(
                "Error", 
                "QR no válido.",
                [{ 
                    text: "OK", 
                    onPress: () => {
                        // Si falló, permitimos escanear de nuevo
                        setScanned(false);
                        lockRef.current = false; 
                    } 
                }]
            );
        }
    };

    // Función para el botón manual de "Escanear de nuevo"
    const handleResetScan = () => {
        setScanned(false);
        setTimeout(() => { lockRef.current = false; }, 500); // Pequeño delay para evitar rebotes
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                // Pasamos undefined si ya escaneamos para apagar el procesador
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />

            <View style={styles.overlay}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Escanea el QR</Text>
                </View>
                
                <View style={styles.scannerFrame}>
                    <View style={styles.cornerTL} /><View style={styles.cornerTR} />
                    <View style={styles.cornerBL} /><View style={styles.cornerBR} />
                </View>

                <View style={styles.footer}>
                    {scanned && (
                        <TouchableOpacity 
                            style={styles.rescanButton} 
                            onPress={handleResetScan} // Usamos la nueva función
                        >
                            <Text style={styles.rescanText}>Escanear de nuevo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

// ... (Los estilos se mantienen igual, no hace falta copiarlos de nuevo) ...
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    permissionText: { color: COLORS.text, textAlign: 'center', marginBottom: 20, fontSize: 16 },
    overlay: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 50 },
    headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8, overflow: 'hidden' },
    scannerFrame: { width: 250, height: 250, justifyContent: 'space-between' },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: COLORS.accent },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: COLORS.accent },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: COLORS.accent },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: COLORS.accent },
    footer: { alignItems: 'center', height: 50 }, // Altura fija para que no salte el layout
    rescanButton: { backgroundColor: COLORS.primary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
    rescanText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});

export default QRScannerScreen;