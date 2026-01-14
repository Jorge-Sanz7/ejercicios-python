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
        if (permission && !permission.granted && permission.canAskAgain) {
            requestPermission();
        }
    }, [permission]);

    const handleBarCodeScanned = ({ data }) => {
        if (scanned || lockRef.current) return;
        lockRef.current = true; 
        setScanned(true);
        
        try {
            const parsedData = JSON.parse(data);
            if (parsedData.id_restaurante) {
                const mesaId = parsedData.table_id || parsedData.mesa || "Mesa 1";
                
                // Guardamos en el cerebro de la app
                setTableInfo(parsedData.id_restaurante, mesaId);

                navigation.navigate('Menu', { 
                    restaurantId: parsedData.id_restaurante,
                    tableId: mesaId 
                });
            } else { throw new Error("QR inválido"); }
        } catch (error) {
            Alert.alert("¡Error!", "Este código no es un QR de YA!", 
                [{ text: "OK", onPress: () => { setScanned(false); lockRef.current = false; } }]);
        }
    };

    if (!permission || !permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{color: '#fff', marginBottom: 20}}>Necesitamos permiso de la cámara</Text>
                <TouchableOpacity style={styles.btn} onPress={requestPermission}>
                    <Text style={{color: '#fff'}}>Dar Permiso</Text>
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
            <View style={styles.overlay}><Text style={styles.overlayText}>Escanea el QR de tu mesa</Text></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    btn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 10 },
    overlay: { position: 'absolute', top: 100, backgroundColor: 'rgba(0,0,0,0.7)', padding: 15, borderRadius: 20 },
    overlayText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default QRScannerScreen;