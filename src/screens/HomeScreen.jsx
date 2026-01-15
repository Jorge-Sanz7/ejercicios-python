import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Alert, 
  Animated, 
  StatusBar 
} from 'react-native';
import { COLORS } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons'; 

const INITIAL_RESTAURANTS = [
  { id: 1, name: "Angel's Restaurant", lastVisit: 'Visitado recientemente', icon: 'restaurant' },
  { id: 2, name: "Tacos El Padrino", lastVisit: 'Visitado hace 2 días', icon: 'flame' },
  { id: 3, name: "Sushi de Pocahontas", lastVisit: 'Visitado ayer', icon: 'leaf' },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [savedRestaurants, setSavedRestaurants] = useState(INITIAL_RESTAURANTS);

  const handleRestaurantPress = (restaurantId) => {
    navigation.navigate('Menu', { restaurantId, tableId: '' });
  };

  const confirmDelete = (restaurant) => {
    Alert.alert(
      "Eliminar Guardado",
      `¿Quieres quitar "${restaurant.name}" de tu lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => {
            setSavedRestaurants(prev => prev.filter(item => item.id !== restaurant.id));
          }
        }
      ]
    );
  };

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [0, 80],
    });

    return (
      <TouchableOpacity 
        onPress={() => confirmDelete(item)} 
        style={styles.deleteContainer}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.deleteButton, { transform: [{ translateX: trans }] }]}>
          <Ionicons name="trash-outline" size={24} color="#fff" />
          <Text style={styles.deleteButtonText}>Borrar</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderRestaurantItem = ({ item }) => (
    <Swipeable 
      renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
      overshootRight={false}
    >
      <TouchableOpacity 
        activeOpacity={0.7}
        style={styles.historyCard}
        onPress={() => handleRestaurantPress(item.id)}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon || 'restaurant-outline'} size={24} color={COLORS.primary} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.visitInfo}>{item.lastVisit}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CCC" />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {/* Header estilo Moderno */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSubtitle}>¡Qué onda, Padrino!</Text>
            <Text style={styles.headerTitle}>Restaurantes</Text>
          </View>
          <TouchableOpacity style={styles.profileCircle}>
            <Ionicons name="person" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus Favoritos</Text>
            <Text style={styles.badge}>{savedRestaurants.length}</Text>
          </View>

          <FlatList
            data={savedRestaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="bookmark-outline" size={50} color="#DDD" />
                <Text style={styles.emptyText}>No tienes lugares guardados aún.</Text>
              </View>
            }
          />
        </View>

        {/* Floating Action Button para Escanear */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            style={styles.scanButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code-outline" size={26} color="#fff" />
            <Text style={styles.scanText}>Escanear QR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 35,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  headerSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  headerTitle: { fontSize: 32, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  profileCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 25 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginRight: 10 },
  badge: { backgroundColor: '#E8E8E8', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10, fontSize: 12, fontWeight: 'bold', color: '#666' },
  
  historyCard: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 15,
    // Sombras más sutiles y pro
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconContainer: {
    width: 50, height: 50, backgroundColor: '#F0F4F8', borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  cardInfo: { flex: 1 },
  restaurantName: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  visitInfo: { fontSize: 13, color: '#999', marginTop: 3 },

  deleteContainer: { width: 80, marginBottom: 15, borderRadius: 20, overflow: 'hidden' },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: { color: '#fff', fontWeight: '800', fontSize: 11, marginTop: 4 },

  floatingButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanButton: {
    flexDirection: 'row', 
    backgroundColor: COLORS.accent || '#FF4B3A',
    paddingVertical: 18, 
    paddingHorizontal: 35, 
    borderRadius: 25,
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  scanText: { color: '#fff', fontSize: 18, fontWeight: '800', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 15, color: '#AAA', fontSize: 16, textAlign: 'center' }
});

export default HomeScreen;