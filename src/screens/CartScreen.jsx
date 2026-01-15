import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import { COLORS } from '../utils/constants';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, clearCart, restaurantData, setRestaurantData, activeOrder, setActiveOrder } = useCart();
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [tableInput, setTableInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Simular envío de orden
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return Alert.alert("Vacío", "Agrega algo al carrito primero.");
    setPinModalVisible(true);
  };

  const submitOrderSimulated = () => {
    if (!tableInput || pinInput.length < 3) {
      return Alert.alert("Error", "Pon el número de mesa y un PIN válido (3+ dígitos).");
    }

    setLoading(true);
    // Simulamos retraso de red
    setTimeout(() => {
      setLoading(false);
      setPinModalVisible(false);
      setRestaurantData({ ...restaurantData, tableId: tableInput });
      setActiveOrder({ items: [...cartItems], total: total, mesa: tableInput });
      clearCart();
      Alert.alert("¡Pedido Enviado! 🚀", "Tu comida ya se está preparando en cocina.");
    }, 1500);
  };

  // 2. Simular pedir cuenta
  const handlePedirCuenta = () => {
    Alert.alert(
      "¿Pedir la cuenta?",
      "¿Cómo vas a pagar, padrino?",
      [
        { text: "Efectivo 💵", onPress: () => finalizarSimulacion("Efectivo") },
        { text: "Tarjeta 💳", onPress: () => finalizarSimulacion("Tarjeta") },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const finalizarSimulacion = (metodo) => {
    Alert.alert(
      "¡Cuenta en camino!",
      `El mesero viene a la mesa ${activeOrder.mesa} para cobrarte en ${metodo}.`,
      [{ text: "OK", onPress: () => { setActiveOrder(null); navigation.navigate('Home'); } }]
    );
  };

  // Render de los productos (simulado)
  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemEmoji}>{item.imagen}</Text>
      <View style={{flex: 1}}>
        <Text style={styles.itemName}>{item.nombre}</Text>
        <Text>Cant: {item.quantity} x ${item.precio}</Text>
      </View>
      <Text style={styles.itemSubtotal}>${(item.precio * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activeOrder ? "Orden en Cocina 🍳" : "Tu Carrito 🛒"}</Text>
      
      <FlatList
        data={activeOrder ? activeOrder.items : cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={<Text style={styles.empty}>No hay nada aquí todavía.</Text>}
      />

      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${activeOrder ? activeOrder.total.toFixed(2) : total.toFixed(2)}</Text>
        
        {!activeOrder ? (
          <TouchableOpacity style={styles.btnConfirm} onPress={handleConfirmOrder}>
            <Text style={styles.btnText}>Confirmar Orden</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPay} onPress={handlePedirCuenta}>
            <Text style={styles.btnText}>¡YA terminé! (Pedir Cuenta) 🏁</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL DE PIN Y MESA */}
      <Modal visible={pinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Mesa</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Número de Mesa (ej: 5)" 
              keyboardType="numeric"
              value={tableInput}
              onChangeText={setTableInput}
            />
            <TextInput 
              style={styles.input} 
              placeholder="PIN de seguridad" 
              keyboardType="numeric"
              secureTextEntry
              value={pinInput}
              onChangeText={setPinInput}
            />
            
            {loading ? (
              <ActivityIndicator color={COLORS.primary} size="large" />
            ) : (
              <TouchableOpacity style={styles.btnConfirm} onPress={submitOrderSimulated}>
                <Text style={styles.btnText}>Enviar a Cocina</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setPinModalVisible(false)}>
              <Text style={{marginTop: 15, color: 'red'}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  itemCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 10 },
  itemEmoji: { fontSize: 30, marginRight: 15 },
  itemName: { fontWeight: 'bold', fontSize: 16 },
  itemSubtotal: { fontWeight: 'bold', color: COLORS.primary },
  footer: { paddingVertical: 20, borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  btnConfirm: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnPay: { backgroundColor: '#27AE60', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', borderBottomWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10, fontSize: 16, textAlign: 'center' },
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default CartScreen;