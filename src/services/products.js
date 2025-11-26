import api from './api';
import { API_URLS } from '../utils/constants';

export const getProducts = async (restaurantId, tableId) => {
  try {
    const response = await api.get(API_URLS.PRODUCTS, {
      params: { 
        restaurant_id: restaurantId,
        table_id: tableId 
      }
    });
    
    // === AQUÍ ESTÁ LA MAGIA DE LA TRADUCCIÓN ===
    // Convertimos lo que llega del Backend al formato que usa la App
    const rawData = response.data;

    const adaptedData = rawData.map(item => ({
      id: item.id_producto,           // id_producto -> id
      name: item.nombre,              // nombre -> name
      description: item.descripcion,  // descripcion -> description
      price: parseFloat(item.precio_venta), // Aseguramos que sea número
      // Si tuvieras imagen en BD: imageUrl: item.imagen || 'placeholder.png'
    }));

    return adaptedData; 
    
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error; 
  }
};