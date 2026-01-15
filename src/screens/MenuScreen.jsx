import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  ActivityIndicator, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  Modal, 
  Platform,       
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import ProductCard from '../components/restaurant/ProductCard';
import { COLORS } from '../utils/constants';
import { useCart } from '../context/CartContext'; 

// --- DATOS SIMULADOS (MOCKS) ---
const MOCK_PRODUCTS = [
  { id: 1, nombre: 'Hamburguesa Especial', precio: 150.00, categoria: 'Platillos', descripcion: 'Carne de res, queso, tocino y papas.', imagen: '🍔' },
  { id: 2, nombre: 'Tacos de Pastor (5)', precio: 95.00, categoria: 'Platillos', descripcion: 'Con piña, cebolla y cilantro.', imagen: '🌮' },
  { id: 3, nombre: 'Pizza Pepperoni', precio: 180.00, categoria: 'Platillos', descripcion: 'Masa artesanal y mucho queso.', imagen: '🍕' },
  { id: 4, nombre: 'Coca-Cola 600ml', precio: 35.00, categoria: 'Bebidas', descripcion: 'Bien fría.', imagen: '🥤' },
  { id: 5, nombre: 'Cerveza Nacional', precio: 55.00, categoria: 'Bebidas', descripcion: 'Corona o Victoria.', imagen: '🍺' },
  { id: 6, nombre: 'Agua de Horchata', precio: 30.00, categoria: 'Bebidas', descripcion: 'Receta de la casa.', imagen: '🥛' },
  { id: 7, nombre: 'Rebanada de Pastel', precio: 75.00, categoria: 'Postres', descripcion: 'Chocolate amargo.', imagen: '🍰' },
  { id: 8, nombre: 'Helado de Vainilla', precio: 45.00, categoria: 'Postres', descripcion: '2 bolas con topping.', imagen: '🍦' },
];

const MenuScreen = ({ route, navigation }) => {
  const { restaurantId, tableId } = route.params || {}; 
  const { totalItems, total } = useCart();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [billModalVisible, setBillModalVisible] = useState(false);

  useEffect(() => {
    // Simulamos carga de API
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const priorityOrder = ['Platillos', 'Bebidas', 'Postres'];
  const uniqueCategories = ['Todos', ...priorityOrder];

  const getSectionedProducts = () => {
    let filtered = products.filter(p => 
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(p => p.categoria === selectedCategory);
    }

    const grouped = filtered.reduce((acc, product) => {
      const category = product.categoria || 'Varios'; 
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {});

    return Object.keys(grouped).map(key => ({
      title: key,
      data: grouped[key]
    })).sort((a, b) => priorityOrder.indexOf(a.title) - priorityOrder.indexOf(b.title));
  };

  const handleRequestBill = (method) => {
    setBillModalVisible(false);
    // Simulación de aviso al mesero
    Alert.alert("¡Listo! 🧾", `Hemos avisado al mesero que pagarás con ${method}. Está de pocahontas.`);
  };

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* HEADER PRINCIPAL */}
      <View style={styles.searchHeader}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={32} color={COLORS.primary} />
        </TouchableOpacity>

        <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#999" style={{marginRight: 8}} />
            <TextInput
              style={styles.searchInput}
              placeholder="¿Qué se te antoja?"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
        </View>
      </View>

      {/* FILTRO ACTIVO */}
      {selectedCategory !== 'Todos' && (
        <View style={styles.activeFilterContainer}>
            <Text style={styles.activeFilterText}>Filtro: {selectedCategory}</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('Todos')}>
                <Text style={styles.clearFilterText}>Borrar</Text>
            </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <SectionList
          sections={getSectionedProducts()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <ProductCard product={item} />}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[
              styles.listContainer, 
              totalItems > 0 && { paddingBottom: 100 } 
          ]}
          stickySectionHeadersEnabled={false} 
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    {searchQuery ? `Sin resultados para "${searchQuery}"` : "No hay productos disponibles"} 😢
                </Text>
            </View>
          }
        />
      )}

      {/* BOTÓN PEDIR CUENTA */}
      {tableId && (
          <TouchableOpacity 
            style={[styles.billButton, totalItems > 0 ? { bottom: 95 } : { bottom: 30 }]} 
            onPress={() => setBillModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.billButtonIcon}>📄</Text>
            <Text style={styles.billButtonText}>Pedir Cuenta</Text>
          </TouchableOpacity>
      )}

      {/* BARRA DEL CARRITO */}
      {totalItems > 0 && (
        <TouchableOpacity 
          style={styles.cartBar} 
          onPress={() => navigation.navigate('Cart')}
          activeOpacity={0.9}
        >
          <View style={styles.cartQuantityBadge}>
            <Text style={styles.cartQuantityText}>{totalItems}</Text>
          </View>
          <Text style={styles.cartBarText}>Ver Pedido</Text>
          <Text style={styles.cartBarTotal}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
      )}

      {/* SIDE BAR (MENÚ LATERAL) */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" statusBarTranslucent={true} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.sidebarOverlay}>
            <View style={styles.sidebarContent}>
                <View style={styles.sidebarHeader}>
                    <Text style={styles.sidebarTitle}>Menú</Text>
                    <TouchableOpacity onPress={() => setMenuVisible(false)} style={styles.closeMenuButton}>
                        <Ionicons name="close" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.menuItemsContainer}>
                    <Text style={styles.menuLabel}>CATEGORÍAS</Text>
                    {uniqueCategories.map((category) => (
                        <TouchableOpacity 
                            key={category} 
                            style={[styles.menuItem, selectedCategory === category && styles.menuItemSelected]}
                            onPress={() => { setSelectedCategory(category); setMenuVisible(false); }}
                        >
                            <Text style={styles.menuItemIcon}>
                                {category === 'Bebidas' ? '🥤' : category === 'Postres' ? '🍰' : category === 'Platillos' ? '🌮' : '🍽️'}
                            </Text>
                            <Text style={[styles.menuItemText, selectedCategory === category && styles.menuItemTextSelected]}>
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}><View style={styles.sidebarBackdrop} /></TouchableWithoutFeedback>
        </View>
      </Modal>

      {/* MODAL CUENTA */}
      <Modal transparent={true} visible={billModalVisible} animationType="fade" onRequestClose={() => setBillModalVisible(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Solicitar la Cuenta</Text>
                <Text style={styles.modalSubtitle}>Mesa: {tableId || 'No asignada'}</Text>
                <View style={styles.paymentOptions}>
                    <TouchableOpacity style={styles.paymentBtn} onPress={() => handleRequestBill('Tarjeta')}>
                        <Text style={styles.paymentEmoji}>💳</Text>
                        <Text style={styles.paymentLabel}>Tarjeta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.paymentBtn} onPress={() => handleRequestBill('Efectivo')}>
                        <Text style={styles.paymentEmoji}>💵</Text>
                        <Text style={styles.paymentLabel}>Efectivo</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.cancelLink} onPress={() => setBillModalVisible(false)}>
                    <Text style={styles.cancelLinkText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  loader: { marginTop: 50 },
  listContainer: { paddingBottom: 50, paddingHorizontal: 15 },
  searchHeader: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 15 : 60,
    paddingBottom: 15, paddingHorizontal: 15, elevation: 4, zIndex: 1,
  },
  menuButton: { padding: 5, marginRight: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 12, paddingHorizontal: 12, height: 45 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  activeFilterContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#e8f4fd', borderBottomWidth: 1, borderColor: '#d0e9fc' },
  activeFilterText: { color: COLORS.primary, fontWeight: 'bold' },
  clearFilterText: { color: COLORS.primary, textDecorationLine: 'underline' },
  sectionHeader: { backgroundColor: '#f8f8f8', paddingVertical: 15, marginTop: 10, marginBottom: 5 },
  sectionHeaderText: { fontSize: 22, fontWeight: '800', color: COLORS.primary, letterSpacing: 0.5 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { fontSize: 18, color: '#888', textAlign: 'center' },
  billButton: { position: 'absolute', right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 30, elevation: 5, zIndex: 10 },
  billButtonIcon: { fontSize: 18, marginRight: 6, color: '#fff' },
  billButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  cartBar: { position: 'absolute', bottom: 20, left: 15, right: 15, backgroundColor: COLORS.primary, borderRadius: 15, paddingVertical: 15, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 10, zIndex: 20 },
  cartQuantityBadge: { backgroundColor: '#fff', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cartQuantityText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
  cartBarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cartBarTotal: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sidebarOverlay: { flex: 1, flexDirection: 'row' },
  sidebarBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, 
  sidebarContent: { width: '75%', backgroundColor: '#fff', height: '100%', paddingTop: Platform.OS === 'android' ? 40 : 60, elevation: 5 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  sidebarTitle: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  closeMenuButton: { backgroundColor: '#ddd', borderRadius: 20, padding: 5 },
  menuItemsContainer: { padding: 20 },
  menuLabel: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 15, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderRadius: 12, paddingHorizontal: 10, marginBottom: 8 },
  menuItemSelected: { backgroundColor: '#e8f4fd' },
  menuItemIcon: { fontSize: 22, marginRight: 15 },
  menuItemText: { fontSize: 18, color: '#444', fontWeight: '500' },
  menuItemTextSelected: { color: COLORS.primary, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#fff', borderRadius: 20, padding: 25, alignItems: 'center', elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: COLORS.primary },
  modalSubtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 25 },
  paymentOptions: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  paymentBtn: { flex: 0.48, alignItems: 'center', padding: 15, backgroundColor: '#f5f5f5', borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  paymentEmoji: { fontSize: 32, marginBottom: 8 },
  paymentLabel: { fontWeight: '600', color: '#333', fontSize: 16 },
  cancelLink: { padding: 10 },
  cancelLinkText: { color: COLORS.secondaryText, fontSize: 16 }
});

export default MenuScreen;