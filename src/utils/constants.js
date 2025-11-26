// Archivo: src/utils/constants.js

export const COLORS = {
  primary: '#2c3e50', 
  accent: '#e74c3c', 
  background: '#f8f8f8', 
  text: '#333333', 
  secondaryText: '#666666', 
  border: '#dddddd',
  success: '#2ecc71',
};

export const API_URLS = {
  // Tu backend en Render
  BASE: 'https://proyectoyaweb.onrender.com/', 
  
  // CORRECCIÓN AQUÍ:
  // Antes decia 'productos', ahora apuntamos a la ruta pública del móvil
  PRODUCTS: 'api/movil/menu', 
  
  // Endpoint para enviar la orden (asegúrate que coincida con tu backend luego)
  ORDERS: 'api/movil/pedido', 
};

export const FONT_SIZES = {
  large: 24,
  medium: 16,
  small: 12,
};