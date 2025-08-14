import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Zap, Droplets, Settings, Smartphone, Phone } from 'lucide-react-native';

const alertsData = [
  {
    id: 1,
    type: 'pump_start',
    message: 'Pump started automatically',
    time: '2 minutes ago',
    icon: CheckCircle,
    color: '#10B981',
  },
  {
    id: 2,
    type: 'level_change',
    message: 'Water level reached 70%',
    time: '15 minutes ago',
    icon: Droplets,
    color: '#0EA5E9',
  },
  {
    id: 3,
    type: 'pump_stop',
    message: 'Pump stopped - High level reached',
    time: '1 hour ago',
    icon: CheckCircle,
    color: '#10B981',
  },
  {
    id: 4,
    type: 'voltage_warning',
    message: 'Low voltage detected (190V)',
    time: '2 hours ago',
    icon: AlertTriangle,
    color: '#F59E0B',
  },
  {
    id: 5,
    type: 'overflow_warning',
    message: 'Overflow warning - Check tank',
    time: '1 day ago',
    icon: AlertTriangle,
    color: '#EF4444',
  },
];

export default function AlertsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [callAlerts, setCallAlerts] = useState(false);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Alerts & Notifications</Text>
          <Text style={styles.subtitle}>Recent system activity</Text>
        </View>

        {/* Alert Settings */}
        <View style={styles.settingsContainer}>
          <View style={styles.sectionHeader}>
            <Settings size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Notification Settings</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Smartphone size={20} color="#64748B" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive alerts on your device
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
                thumbColor={pushNotifications ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Phone size={20} color="#64748B" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Call Alerts</Text>
                  <Text style={styles.settingDescription}>
                    Receive phone calls for critical issues
                  </Text>
                </View>
              </View>
              <Switch
                value={callAlerts}
                onValueChange={setCallAlerts}
                trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
                thumbColor={callAlerts ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <AlertTriangle size={20} color="#64748B" />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Emergency Alerts</Text>
                  <Text style={styles.settingDescription}>
                    Critical system failures only
                  </Text>
                </View>
              </View>
              <Switch
                value={emergencyAlerts}
                onValueChange={setEmergencyAlerts}
                trackColor={{ false: '#E2E8F0', true: '#EF4444' }}
                thumbColor={emergencyAlerts ? '#FFFFFF' : '#94A3B8'}
              />
            </View>
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={styles.alertsContainer}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
          </View>
          
          <View style={styles.alertsList}>
            {alertsData.map((alert) => {
              const IconComponent = alert.icon;
              return (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={[styles.alertIcon, { backgroundColor: `${alert.color}20` }]}>
                    <IconComponent size={20} color={alert.color} />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <Text style={styles.alertTime}>{alert.time}</Text>
                  </View>
                  <View style={[styles.alertDot, { backgroundColor: alert.color }]} />
                </View>
              );
            })}
          </View>
        </View>

        {/* Alert Types */}
        <View style={styles.typesContainer}>
          <Text style={styles.typesTitle}>Alert Types</Text>
          <View style={styles.typesList}>
            <View style={styles.typeItem}>
              <CheckCircle size={16} color="#10B981" />
              <Text style={styles.typeText}>System Status</Text>
            </View>
            <View style={styles.typeItem}>
              <Droplets size={16} color="#0EA5E9" />
              <Text style={styles.typeText}>Water Level</Text>
            </View>
            <View style={styles.typeItem}>
              <Zap size={16} color="#F59E0B" />
              <Text style={styles.typeText}>Power Issues</Text>
            </View>
            <View style={styles.typeItem}>
              <AlertTriangle size={16} color="#EF4444" />
              <Text style={styles.typeText}>Emergency</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  settingsContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  alertsContainer: {
    marginBottom: 24,
  },
  alertsList: {
    marginHorizontal: 20,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 13,
    color: '#64748B',
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  typesContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
  },
  typesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  typesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    color: '#475569',
  },
});