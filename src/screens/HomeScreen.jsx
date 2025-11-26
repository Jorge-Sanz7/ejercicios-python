import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { COLORS } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';

// Datos simulados de "Restaurantes Guardados" (Historial)
const SAVED_RESTAURANTS = [
  { id: 1, name: "Angel's Restaurant", lastVisit: 'Hace 2 días', tableId: 10 },
  // Aquí se irán agregando dinámicamente en el futuro
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleRestaurantPress = (restaurantId, tableId) => {
    // Navegar directamente al menú con los datos guardados
    navigation.navigate('Menu', { restaurantId, tableId });
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyCard}
      onPress={() => handleRestaurantPress(item.id, item.tableId)}
    >
      <View style={styles.iconPlaceholder}>
        <Text style={styles.iconText}>🍽️</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text style={styles.visitInfo}>{item.lastVisit} - Mesa {item.tableId}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Angel 👋</Text>
        <Text style={styles.subGreeting}>¿Dónde comeremos hoy?</Text>
      </View>

      {/* Sección de Historial */}
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Tus Restaurantes Favoritos</Text>
        <FlatList
          data={SAVED_RESTAURANTS}
          renderItem={renderRestaurantItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Botón Flotante Gigante para Escanear */}
      <View style={styles.scanContainer}>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={styles.scanIcon}>📷</Text>
          <Text style={styles.scanText}>Escanear Nuevo QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: 25,
    paddingTop: 60,
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subGreeting: { fontSize: 16, color: '#ddd', marginTop: 5 },
  
  historyContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconPlaceholder: {
    width: 50, height: 50,
    backgroundColor: '#f0f4f8',
    borderRadius: 25,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  iconText: { fontSize: 24 },
  cardInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  visitInfo: { fontSize: 12, color: COLORS.secondaryText, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.secondaryText, fontWeight: 'bold' },

  scanContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  scanIcon: { fontSize: 24, marginRight: 10, color: '#fff' },
  scanText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default HomeScreen;