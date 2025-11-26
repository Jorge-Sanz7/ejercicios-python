import api from './api';
import { API_URLS } from '../utils/constants';

export const sendOrder = async (restaurantId, tableId, pin, cartItems) => {
  try {
    // Formateamos los items como lo espera tu backend (id_producto, cantidad)
    const itemsFormatted = cartItems.map(item => ({
      id_producto: item.productId,
      cantidad: item.quantity
    }));

    // El backend espera: { id_mesa, pin, items }
    // Nota: Tu backend asume restaurante ID 1 por defecto en este MVP, 
    // pero enviamos mesa y pin que es lo crítico para la seguridad.
    const payload = {
      id_mesa: tableId, 
      pin: pin,
      items: itemsFormatted
    };

    const response = await api.post('api/movil/pedido', payload);
    return response.data;

  } catch (error) {
    // Si el servidor responde con error (ej. PIN incorrecto), lanzamos el mensaje
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }
    throw new Error("No se pudo enviar el pedido. Revisa tu conexión.");
  }
};