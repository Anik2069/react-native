import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, User, Phone, Mail, IndianRupee, Filter } from 'lucide-react-native';
import { useState } from 'react';

const CustomerCard = ({ name, phone, email, balance, lastTransaction }: any) => (
  <TouchableOpacity style={styles.customerCard}>
    <View style={styles.customerHeader}>
      <View style={styles.customerAvatar}>
        <User size={20} color="#3B82F6" />
      </View>
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{name}</Text>
        <View style={styles.contactInfo}>
          <Phone size={12} color="#64748B" />
          <Text style={styles.customerPhone}>{phone}</Text>
        </View>
      </View>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, { color: balance >= 0 ? '#10B981' : '#EF4444' }]}>
          ₹{Math.abs(balance).toLocaleString()}
        </Text>
        <Text style={styles.balanceLabel}>{balance >= 0 ? 'Credit' : 'Debit'}</Text>
      </View>
    </View>
    <View style={styles.customerFooter}>
      <Text style={styles.lastTransaction}>Last: {lastTransaction}</Text>
      <TouchableOpacity style={styles.ledgerButton}>
        <Text style={styles.ledgerText}>View Ledger</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CustomersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const customers = [
    { id: 1, name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@example.com', balance: 15000, lastTransaction: '2 days ago' },
    { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@example.com', balance: -5000, lastTransaction: '1 week ago' },
    { id: 3, name: 'Amit Singh', phone: '+91 76543 21098', email: 'amit@example.com', balance: 25000, lastTransaction: '3 days ago' },
    { id: 4, name: 'Sneha Patel', phone: '+91 65432 10987', email: 'sneha@example.com', balance: 8000, lastTransaction: '5 days ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Customers</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'list' && styles.activeTab]}
            onPress={() => setActiveTab('list')}
          >
            <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>Customer List</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'ledger' && styles.activeTab]}
            onPress={() => setActiveTab('ledger')}
          >
            <Text style={[styles.tabText, activeTab === 'ledger' && styles.activeTabText]}>Ledger Summary</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {activeTab === 'list' ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Search size={20} color="#64748B" />
              <TextInput
                placeholder="Search customers..."
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
              <Text style={styles.summaryValue}>145</Text>
              <Text style={styles.summaryLabel}>Total Customers</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>₹2,45,000</Text>
              <Text style={styles.summaryLabel}>Total Receivables</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.customerList}>
            {customers.map((customer) => (
              <CustomerCard key={customer.id} {...customer} />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.ledgerContainer}>
            <Text style={styles.sectionTitle}>Customer Ledger Summary</Text>
            
            <View style={styles.ledgerStats}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>₹3,45,000</Text>
                <Text style={styles.statLabel}>Total Sales</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#10B981' }]}>₹2,45,000</Text>
                <Text style={styles.statLabel}>Received</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>₹1,00,000</Text>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.recentTitle}>Recent Transactions</Text>
              {[1, 2, 3, 4, 5].map((item) => (
                <View key={item} style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionCustomer}>Rajesh Kumar</Text>
                    <Text style={styles.transactionDate}>March 15, 2024</Text>
                  </View>
                  <View style={styles.transactionAmount}>
                    <Text style={styles.amountValue}>₹15,000</Text>
                    <Text style={styles.amountType}>Sale</Text>
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
  customerList: {
    flex: 1,
  },
  customerCard: {
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
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  customerPhone: {
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
  customerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastTransaction: {
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
  transactionCustomer: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 2,
  },
  amountType: {
    fontSize: 12,
    color: '#64748B',
  },
});