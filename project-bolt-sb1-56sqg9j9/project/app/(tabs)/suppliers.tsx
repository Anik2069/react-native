import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Truck, Phone, Mail, MapPin, Filter } from 'lucide-react-native';
import { useState } from 'react';

const SupplierCard = ({ name, company, phone, address, balance, lastOrder }: any) => (
  <TouchableOpacity style={styles.supplierCard}>
    <View style={styles.supplierHeader}>
      <View style={styles.supplierAvatar}>
        <Truck size={20} color="#3B82F6" />
      </View>
      <View style={styles.supplierInfo}>
        <Text style={styles.supplierName}>{name}</Text>
        <Text style={styles.companyName}>{company}</Text>
        <View style={styles.contactInfo}>
          <Phone size={12} color="#64748B" />
          <Text style={styles.supplierPhone}>{phone}</Text>
        </View>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, { color: balance >= 0 ? '#EF4444' : '#10B981' }]}>
          ₹{Math.abs(balance).toLocaleString()}
        </Text>
        <Text style={styles.balanceLabel}>{balance >= 0 ? 'Payable' : 'Advance'}</Text>
      </View>
    </View>
    <View style={styles.supplierFooter}>
      <View style={styles.addressContainer}>
        <MapPin size={12} color="#64748B" />
        <Text style={styles.address}>{address}</Text>
      </View>
      <TouchableOpacity style={styles.ledgerButton}>
        <Text style={styles.ledgerText}>View Ledger</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.lastOrderContainer}>
      <Text style={styles.lastOrder}>Last Order: {lastOrder}</Text>
    </View>
  </TouchableOpacity>
);

export default function SuppliersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const suppliers = [
    { 
      id: 1, 
      name: 'Ravi Industries', 
      company: 'Ravi Pvt Ltd', 
      phone: '+91 98765 43210', 
      address: 'Mumbai, MH',
      balance: 45000, 
      lastOrder: '1 week ago' 
    },
    { 
      id: 2, 
      name: 'Global Supplies', 
      company: 'Global Corp', 
      phone: '+91 87654 32109', 
      address: 'Delhi, DL',
      balance: -15000, 
      lastOrder: '3 days ago' 
    },
    { 
      id: 3, 
      name: 'Tech Materials', 
      company: 'Tech Mat Ltd', 
      phone: '+91 76543 21098', 
      address: 'Bangalore, KA',
      balance: 85000, 
      lastOrder: '2 weeks ago' 
    },
    { 
      id: 4, 
      name: 'Quality Goods', 
      company: 'QG Industries', 
      phone: '+91 65432 10987', 
      address: 'Pune, MH',
      balance: 25000, 
      lastOrder: '5 days ago' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Suppliers</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]}
            onPress={() => setActiveTab('list')}
          >
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Supplier List</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ledger' && styles.activeTab]}
            onPress={() => setActiveTab('ledger')}
          >
            <Text style={[styles.tabText, activeTab === 'ledger' && styles.activeTabText]}>Purchase Ledger</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {activeTab === 'list' ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Search size={20} color="#64748B" />
              <TextInput
                placeholder="Search suppliers..."
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
              <Text style={styles.summaryValue}>32</Text>
              <Text style={styles.summaryLabel}>Total Suppliers</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#EF4444' }]}>₹1,55,000</Text>
              <Text style={styles.summaryLabel}>Total Payables</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.supplierList}>
            {suppliers.map((supplier) => (
              <SupplierCard key={supplier.id} {...supplier} />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.ledgerContainer}>
            <Text style={styles.sectionTitle}>Purchase Ledger Summary</Text>
            
            <View style={styles.ledgerStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>₹5,85,000</Text>
                <Text style={styles.statLabel}>Total Purchases</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>₹4,30,000</Text>
                <Text style={styles.statLabel}>Paid</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>₹1,55,000</Text>
                <Text style={styles.statLabel}>Outstanding</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.recentTitle}>Recent Purchase Orders</Text>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionSupplier}>Ravi Industries</Text>
                    <Text style={styles.transactionDate}>March 12, 2024</Text>
                    <Text style={styles.orderNumber}>PO #12345</Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={styles.amountValue}>₹85,000</Text>
                    <Text style={styles.amountType}>Purchase</Text>
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
    gap: 16,
    marginBottom: 24,
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
  supplierList: {
    flex: 1,
  },
  supplierCard: {
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
  supplierHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  supplierAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  supplierInfo: {
    flex: 1,
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  supplierPhone: {
    fontSize: 14,
    color: '#64748B',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balance: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  supplierFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  address: {
    fontSize: 12,
    color: '#64748B',
  },
  ledgerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  ledgerText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  lastOrderContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastOrder: {
    fontSize: 12,
    color: '#64748B',
  },
  ledgerContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  ledgerStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
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
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  transactionItem: {
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
  transactionInfo: {
    flex: 1,
  },
  transactionSupplier: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  orderNumber: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginBottom: 2,
  },
  amountType: {
    fontSize: 12,
    color: '#64748B',
  },
});