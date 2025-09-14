import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Plus, Building2, Users, MapPin, Phone, Settings, Crown } from 'lucide-react-native';
import { useState } from 'react';

const CompanyCard = ({ name, industry, location, employees, status, isActive, revenue }: any) => (
  <TouchableOpacity style={[styles.companyCard, isActive && styles.activeCompanyCard]}>
    {isActive && (
      <View style={styles.activeBadge}>
        <Crown size={12} color="#F59E0B" />
        <Text style={styles.activeBadgeText}>Active</Text>
      </View>
    )}
    <View style={styles.companyHeader}>
      <View style={styles.companyAvatar}>
        <Building2 size={24} color="#3B82F6" />
      </View>
      <View style={styles.companyInfo}>
        <Text style={styles.companyName}>{name}</Text>
        <Text style={styles.industry}>{industry}</Text>
        <View style={styles.locationContainer}>
          <MapPin size={12} color="#64748B" />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: status === 'active' ? '#10B981' : '#EF4444' }]} />
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
    <View style={styles.companyStats}>
      <View style={styles.statItem}>
        <Users size={16} color="#64748B" />
        <Text style={styles.statValue}>{employees}</Text>
        <Text style={styles.statLabel}>Employees</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.revenueValue}>₹{revenue}</Text>
        <Text style={styles.statLabel}>Monthly Revenue</Text>
      </View>
    </View>
    <View style={styles.companyFooter}>
      <TouchableOpacity style={styles.switchButton}>
        <Text style={styles.switchText}>{isActive ? 'Current' : 'Switch To'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingsButton}>
        <Settings size={16} color="#64748B" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

export default function CompaniesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('companies');

  const companies = [
    { 
      id: 1, 
      name: 'TechCorp Solutions', 
      industry: 'Technology',
      location: 'Mumbai, MH',
      employees: '150+',
      status: 'active',
      isActive: true,
      revenue: '25L'
    },
    { 
      id: 2, 
      name: 'Global Retail Ltd', 
      industry: 'Retail',
      location: 'Delhi, DL',
      employees: '80+',
      status: 'active',
      isActive: false,
      revenue: '18L'
    },
    { 
      id: 3, 
      name: 'Manufacturing Co', 
      industry: 'Manufacturing',
      location: 'Bangalore, KA',
      employees: '200+',
      status: 'inactive',
      isActive: false,
      revenue: '32L'
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1E3A8A', '#3B82F6']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Multi-Company</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'companies' && styles.activeTab]}
            onPress={() => setActiveTab('companies')}
          >
            <Text style={[styles.tabText, activeTab === 'companies' && styles.activeTabText]}>Companies</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {activeTab === 'companies' ? (
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <Search size={20} color="#64748B" />
              <TextInput
                placeholder="Search companies..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{companies.length}</Text>
              <Text style={styles.summaryLabel}>Total Companies</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>
                {companies.filter(c => c.status === 'active').length}
              </Text>
              <Text style={styles.summaryLabel}>Active</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>₹75L</Text>
              <Text style={styles.summaryLabel}>Combined Revenue</Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.companiesList}>
            <Text style={styles.sectionTitle}>Your Companies</Text>
            {companies.map((company) => (
              <CompanyCard key={company.id} {...company} />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Company Management Settings</Text>
            
            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Data Synchronization</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Auto-sync between companies</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Real-time updates</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Access Control</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Cross-company data access</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleInactive} />
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Unified reporting</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
            </View>

            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Company switch alerts</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
              <View style={styles.settingItem}>
                <Text style={styles.settingLabel}>Cross-company reports</Text>
                <View style={styles.toggle}>
                  <View style={styles.toggleActive} />
                </View>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.recentTitle}>Recent Activity</Text>
              {[
                { action: 'Switched to TechCorp Solutions', time: '2 hours ago' },
                { action: 'Created new company profile', time: '1 day ago' },
                { action: 'Updated Global Retail settings', time: '3 days ago' },
                { action: 'Synced data across companies', time: '1 week ago' },
              ].map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityDot} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
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
    marginBottom: 20,
  },
  searchInput: {
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
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
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
  companiesList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  companyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  activeCompanyCard: {
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  activeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '600',
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  companyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  industry: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: '#64748B',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 4,
  },
  revenueValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  companyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  switchText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
  },
  settingsContainer: {
    flex: 1,
  },
  settingSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: '#374151',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-end',
  },
  toggleInactive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#9CA3AF',
    alignSelf: 'flex-start',
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#64748B',
  },
});