// Archivo: src/components/restaurant/ProductCard.jsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useCart } from '../../context/CartContext';
import { COLORS } from '../../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // El backend ahora envía "disponible: true/false"
  // Si por alguna razón no llega, asumimos true para no romper nada.
  const isAvailable = product.disponible !== false; 

  return (
    <View style={[styles.card, !isAvailable && styles.cardDisabled]}>
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
            <Text style={[styles.name, !isAvailable && styles.textDisabled]}>
                {product.name}
            </Text>
            {!isAvailable && (
                <View style={styles.badgeAgotado}>
                    <Text style={styles.badgeText}>AGOTADO</Text>
                </View>
            )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
            {product.description}
        </Text>
        
        <Text style={[styles.price, !isAvailable && styles.textDisabled]}>
            ${Number(product.precio_venta || product.price).toFixed(2)}
        </Text>
      </View>
      
      {/* Botón: Si no hay stock, se deshabilita y cambia de color */}
      <TouchableOpacity 
        style={[styles.addButton, !isAvailable && styles.addButtonDisabled]}
        onPress={() => isAvailable && addToCart(product)}
        disabled={!isAvailable}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    borderLeftWidth: 5,
    borderLeftColor: COLORS.primary,
  },
  cardDisabled: {
    backgroundColor: '#f0f0f0', // Fondo grisáceo
    borderLeftColor: '#ccc',    // Borde gris
    opacity: 0.8,
  },
  infoContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  textDisabled: { color: '#999', textDecorationLine: 'line-through' },
  
  description: { fontSize: 12, color: COLORS.secondaryText, marginVertical: 4 },
  
  price: { fontSize: 16, fontWeight: 'bold', color: COLORS.accent },
  
  badgeAgotado: {
    backgroundColor: '#e74c3c',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  addButton: {
    backgroundColor: COLORS.success,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc', // Botón gris
  },
  addButtonText: { color: '#fff', fontSize: 24, fontWeight: 'bold' }
});

export default ProductCard;