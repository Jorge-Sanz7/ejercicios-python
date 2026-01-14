import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { useCart } from '../context/CartContext';
import CartItem from '../components/restaurant/CartItem';
import { COLORS } from '../utils/constants';
import { sendOrder, updateOrderStatus } from '../services/orders';

const CartScreen = ({ navigation }) => {
  const { cartItems, total, clearCart, restaurantData, activeOrder, setActiveOrder } = useCart();
  const [isPinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleConfirmOrder = () => {
    if (!restaurantData.restaurantId || !restaurantData.tableId) {
      Alert.alert("Error", "Escanea el QR de nuevo, no detectamos tu mesa.", 
        [{ text: "Ir a Escanear", onPress: () => navigation.navigate('QRScanner') }]);
      return;
    }
    setPinModalVisible(true);
  };

  const submitOrder = async () => {
    if (pin.length < 3) return Alert.alert("Error", "Ingresa el PIN de la mesa.");
    setIsSubmitting(true);
    try {
      const response = await sendOrder(restaurantData.restaurantId, restaurantData.tableId, pin, cartItems, 'Pendiente');
      setActiveOrder({ id: response.id_pedido || response.insertId, items: [...cartItems], total: total });
      setPinModalVisible(false);
      Alert.alert("¡Pedido Enviado! 🚀", "Tu orden ya está en cocina.");
    } catch (e) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally { setIsSubmitting(false); }
  };

  const handleYaTermine = () => {
    Alert.alert(
      "¿Pedir la cuenta?",
      "Selecciona tu método de pago:",
      [
        { text: "Efectivo 💵", onPress: () => finalizarEnBD('Efectivo') },
        { text: "Tarjeta 💳", onPress: () => finalizarEnBD('Tarjeta') },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const finalizarEnBD = async (metodo) => {
    setIsFinishing(true);
    try {
      // Actualizamos la base de datos real
      await updateOrderStatus(activeOrder.id, 'Esperando Pago', metodo);
      
      Alert.alert("¡Todo listo!", `El mesero viene con la cuenta. Pago: ${metodo}`, [
        { text: "OK", onPress: () => { clearCart(); navigation.navigate('Home'); } }
      ]);
    } catch (e) {
      Alert.alert("Error", "No pudimos actualizar tu estado de pago.");
    } finally { setIsFinishing(false); }
  };

  if (cartItems.length === 0 && !activeOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Carrito vacío 🍽️</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{activeOrder ? "Orden en Proceso" : "Tu Pedido"}</Text>
      <FlatList data={activeOrder ? activeOrder.items : cartItems} renderItem={({item}) => <CartItem item={item}/>} />
      
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        {!activeOrder ? (
          <TouchableOpacity style={styles.mainBtn} onPress={handleConfirmOrder}>
            <Text style={styles.btnText}>Confirmar Orden ✅</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.mainBtn, {backgroundColor: '#27AE60'}]} onPress={handleYaTermine} disabled={isFinishing}>
            {isFinishing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>¡YA terminé! (Pedir Cuenta) 🏁</Text>}
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={isPinModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>PIN de Mesa {restaurantData.tableId}</Text>
            <TextInput style={styles.input} placeholder="PIN" keyboardType="numeric" secureTextEntry value={pin} onChangeText={setPin} />
            <TouchableOpacity style={styles.mainBtn} onPress={submitOrder}>
              {isSubmitting ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>Confirmar</Text>}
            </TouchableOpacity>
            <Text style={{marginTop: 15}} onPress={() => setPinModalVisible(false)}>Cancelar</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  mainBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, marginBottom: 20 },
  backBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 10 },
  backBtnText: { color: '#fff' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { width: '80%', backgroundColor: '#fff', padding: 25, borderRadius: 20, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, width: '100%', marginVertical: 20, fontSize: 20, textAlign: 'center' }
});

export default CartScreen;