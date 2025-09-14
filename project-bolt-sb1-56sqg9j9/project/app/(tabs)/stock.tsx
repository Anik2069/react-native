import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Package, TrendingUp, TrendingDown, TriangleAlert as AlertTriangle, Filter, ChartBar as BarChart3 } from 'lucide-react-native';
import { useState } from 'react';

const StockItem = ({ name, category, sku, currentStock, minStock, price, value, trend }: any) => (
  <TouchableOpacity style={styles.stockCard}>
    <View style={styles.stockHeader}>
      <View style={styles.stockInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.sku}>SKU: {sku}</Text>
      </View>
      <View style={styles.stockStatus}>
        <Text style={[
          styles.stockQuantity, 
          { color: currentStock <= minStock ? '#EF4444' : '#10B981' }
        ]}>
          {currentStock} units
        </Text>
        {currentStock <= minStock && (
          <View style={styles.lowStockBadge}>
            <AlertTriangle size={12} color="#EF4444" />
            <Text style={styles.lowStockText}>Low Stock</Text>
          </View>
        )}
      </View>
    </View>
    <View style={styles.stockDetails}>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{price.toLocaleString()}</Text>
        <Text style={styles.priceLabel}>Per Unit</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.totalValue}>₹{value.toLocaleString()}</Text>
        <Text style={styles.valueLabel}>Total Value</Text>
      </View>
      <View style={styles.trendContainer}>
        {trend > 0 ? (
          <TrendingUp size={16} color="#10B981" />
        ) : (
          <TrendingDown size={16} color="#EF4444" />
        )}
        <Text style={[styles.trendText, { color: trend > 0 ? '#10B981' : '#EF4444' }]}>
          {Math.abs(trend)}%
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function StockScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');

  const stockItems = [
    { 
      id: 1, 
      name: 'Premium Laptop', 
      category: 'Electronics', 
      sku: 'ELE-001',
      currentStock: 15,
      minStock: 10,
      price: 55000,
      value: 825000,
      trend: 12
    },
    { 
      id: 2, 
      name: 'Office Chair', 
      category: 'Furniture', 
      sku: 'FUR-002',
      currentStock: 5,
      minStock: 8,
      price: 8500,
      value: 42500,
      trend: -5
    },
    { 
      id: 3, 
      name: 'Wireless Mouse', 
      category: 'Accessories', 
      sku: 'ACC-003',
      currentStock: 45,
      minStock: 20,
      price: 1200,
      value: 54000,
      trend: 8
    },
    { 
      id: 4, 
      name: 'LED Monitor', 
      category: 'Electronics', 
      sku: 'ELE-004',
      currentStock: 8,
      minStock: 12,
      price: 18000,
      value: 144000,
      trend: -3
    },
  ];

  const lowStockItems = stockItems.filter(item => item.currentStock <= item.minStock);
  const totalValue = stockItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Stock Management</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'inventory' && styles.activeTab]}
            onPress={() => setActiveTab('inventory')}
          >
            <Text style={[styles.tabText, activeTab === 'inventory' && styles.activeTabText]}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>Analytics</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {activeTab === 'inventory' ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Search size={20} color="#64748B" />
              <TextInput
                placeholder="Search products..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{stockItems.length}</Text>
              <Text style={styles.summaryLabel}>Total Items</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>{lowStockItems.length}</Text>
              <Text style={styles.summaryLabel}>Low Stock</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>₹{(totalValue/100000).toFixed(1)}L</Text>
              <Text style={styles.summaryLabel}>Total Value</Text>
            </View>
          </View>

          {lowStockItems.length > 0 && (
            <View style={styles.alertSection}>
              <View style={styles.alertHeader}>
                <AlertTriangle size={20} color="#EF4444" />
                <Text style={styles.alertTitle}>Low Stock Alert</Text>
              </View>
              <Text style={styles.alertMessage}>
                {lowStockItems.length} items are running low on stock. Reorder soon to avoid stockouts.
              </Text>
            </View>
          )}

          <ScrollView showsVerticalScrollIndicator={false} style={styles.stockList}>
            {stockItems.map((item) => (
              <StockItem key={item.id} {...item} />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Stock Analytics</Text>
            
            <View style={styles.analyticsCards}>
              <View style={styles.analyticsCard}>
                <View style={styles.cardIcon}>
                  <BarChart3 size={24} color="#3B82F6" />
                </View>
                <Text style={styles.cardTitle}>Inventory Turnover</Text>
                <Text style={styles.cardValue}>4.2x</Text>
                <Text style={styles.cardChange}>+0.3 from last month</Text>
              </View>
              <View style={styles.analyticsCard}>
                <View style={styles.cardIcon}>
                  <TrendingUp size={24} color="#10B981" />
                </View>
                <Text style={styles.cardTitle}>Fast Moving</Text>
                <Text style={styles.cardValue}>65%</Text>
                <Text style={styles.cardChange}>Electronics category</Text>
              </View>
            </View>

            <View style={styles.categoryBreakdown}>
              <Text style={styles.breakdownTitle}>Category Breakdown</Text>
              {['Electronics', 'Furniture', 'Accessories'].map((category, index) => {
                const values = [60, 25, 15];
                const colors = ['#3B82F6', '#10B981', '#F59E0B'];
                return (
                  <View key={category} style={styles.categoryItem}>
                    <View style={styles.categoryInfo}>
                      <View style={[styles.colorDot, { backgroundColor: colors[index] }]} />
                      <Text style={styles.categoryName}>{category}</Text>
                    </View>
                    <Text style={styles.categoryPercentage}>{values[index]}%</Text>
                  </View>
                );
              })}
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.recentTitle}>Recent Stock Movements</Text>
              {[
                { product: 'Premium Laptop', type: 'IN', quantity: 10, date: '2 hours ago' },
                { product: 'Office Chair', type: 'OUT', quantity: 3, date: '5 hours ago' },
                { product: 'Wireless Mouse', type: 'IN', quantity: 25, date: '1 day ago' },
                { product: 'LED Monitor', type: 'OUT', quantity: 4, date: '2 days ago' },
              ].map((movement, index) => (
                <View key={index} style={styles.movementItem}>
                  <View style={styles.movementInfo}>
                    <Text style={styles.movementProduct}>{movement.product}</Text>
                    <Text style={styles.movementDate}>{movement.date}</Text>
                  </View>
                  <View style={styles.movementDetails}>
                    <Text style={[
                      styles.movementType, 
                      { color: movement.type === 'IN' ? '#10B981' : '#EF4444' }
                    ]}>
                      {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                    </Text>
                    <Text style={styles.movementLabel}>{movement.type === 'IN' ? 'Added' : 'Sold'}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E2E8F0',
  },
  activeTabText: {
    color: '#1E3A8A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  alertSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
  },
  alertMessage: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
  stockList: {
    flex: 1,
  },
  stockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stockInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  sku: {
    fontSize: 12,
    color: '#94A3B8',
  },
  stockStatus: {
    alignItems: 'flex-end',
  },
  stockQuantity: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lowStockText: {
    fontSize: 10,
    color: '#EF4444',
    fontWeight: '500',
  },
  stockDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceContainer: {
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  priceLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  valueContainer: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 2,
  },
  valueLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  analyticsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  analyticsCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  analyticsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardChange: {
    fontSize: 12,
    color: '#64748B',
  },
  categoryBreakdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
  categoryPercentage: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  movementItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  movementInfo: {
    flex: 1,
  },
  movementProduct: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  movementDate: {
    fontSize: 12,
    color: '#64748B',
  },
  movementDetails: {
    alignItems: 'flex-end',
  },
  movementType: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  movementLabel: {
    fontSize: 12,
    color: '#64748B',
  },
});