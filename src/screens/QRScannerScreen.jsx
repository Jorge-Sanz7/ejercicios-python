import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { COLORS } from '../utils/constants';
import { useCart } from '../context/CartContext';

const QRScannerScreen = ({ navigation }) => {
    const { setTableInfo } = useCart();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const lockRef = useRef(false); 

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setScanned(false);
            lockRef.current = false;
        });
        return unsubscribe;
    }, [navigation]);

    const handleBarCodeScanned = ({ data }) => {
        if (scanned || lockRef.current) return;
        lockRef.current = true; 
        setScanned(true);
        
        try {
            const parsedData = JSON.parse(data);
            // Verificamos que el QR tenga los datos necesarios
            if (parsedData.id_restaurante) {
                const resId = parsedData.id_restaurante;
                const mesaId = parsedData.table_id || parsedData.mesa || "Mesa 1";
                
                // Guardamos en el contexto
                setTableInfo(resId, mesaId);

                // Navegamos pasando el ID para que MenuScreen sepa qué cargar
                navigation.navigate('Menu', { 
                    restaurantId: resId,
                    tableId: mesaId 
                });
            } else {
                throw new Error("QR sin ID de restaurante");
            }
        } catch (error) {
            Alert.alert("¡Error!", "Código QR no válido para YA!", 
                [{ text: "Reintentar", onPress: () => { setScanned(false); lockRef.current = false; } }]);
        }
    };

    if (!permission || !permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.infoText}>Padrino, activa la cámara para pedir.</Text>
                <TouchableOpacity style={styles.btn} onPress={requestPermission}>
                    <Text style={styles.btnText}>Permitir Cámara</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            />
            <View style={styles.overlay}>
                <View style={styles.frame}>
                  <View style={styles.cornerTL} /><View style={styles.cornerTR} />
                  <View style={styles.cornerBL} /><View style={styles.cornerBR} />
                </View>
                <Text style={styles.overlayText}>Escanea tu mesa</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    infoText: { color: '#fff', marginBottom: 20, textAlign: 'center' },
    btn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10 },
    btnText: { color: '#fff', fontWeight: 'bold' },
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
    frame: { width: 250, height: 250, position: 'relative' },
    cornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 5, borderLeftWidth: 5, borderColor: COLORS.primary },
    cornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 5, borderRightWidth: 5, borderColor: COLORS.primary },
    cornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 5, borderLeftWidth: 5, borderColor: COLORS.primary },
    cornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 5, borderRightWidth: 5, borderColor: COLORS.primary },
    overlayText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 30, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 }
});

export default QRScannerScreen;