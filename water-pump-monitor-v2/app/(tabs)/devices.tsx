import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Smartphone, Wifi, Bluetooth, Plus, CreditCard as Edit3, Trash2, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X } from 'lucide-react-native';

const devicesData = [
  {
    id: 1,
    name: 'Main Pump Controller',
    type: 'Primary',
    connection: 'wifi',
    status: 'connected',
    signal: 85,
    lastSeen: 'Now',
  },
  {
    id: 2,
    name: 'Tank Level Sensor',
    type: 'Sensor',
    connection: 'wifi',
    status: 'connected',
    signal: 92,
    lastSeen: '2 min ago',
  },
  {
    id: 3,
    name: 'Backup Pump Unit',
    type: 'Secondary',
    connection: 'bluetooth',
    status: 'disconnected',
    signal: 0,
    lastSeen: '2 hours ago',
  },
];

export default function DevicesScreen() {
  const [devices, setDevices] = useState(devicesData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceName, setDeviceName] = useState('');

  const handleAddDevice = () => {
    if (deviceName.trim()) {
      const newDevice = {
        id: Date.now(),
        name: deviceName,
        type: 'Secondary',
        connection: 'wifi',
        status: 'disconnected',
        signal: 0,
        lastSeen: 'Never',
      };
      setDevices([...devices, newDevice]);
      setDeviceName('');
      setShowAddModal(false);
    }
  };

  const handleEditDevice = () => {
    if (deviceName.trim() && selectedDevice) {
      setDevices(devices.map(device => 
        device.id === selectedDevice.id 
          ? { ...device, name: deviceName }
          : device
      ));
      setDeviceName('');
      setSelectedDevice(null);
      setShowEditModal(false);
    }
  };

  const handleRemoveDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
  };

  const openEditModal = (device) => {
    setSelectedDevice(device);
    setDeviceName(device.name);
    setShowEditModal(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Device Management</Text>
          <Text style={styles.subtitle}>Connected pump systems</Text>
        </View>

        {/* Add Device Button */}
        <View style={styles.addContainer}>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Device</Text>
          </TouchableOpacity>
        </View>

        {/* Devices List */}
        <View style={styles.devicesContainer}>
          {devices.map((device) => (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceHeader}>
                <View style={styles.deviceInfo}>
                  <View style={styles.deviceNameRow}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: device.status === 'connected' ? '#10B98120' : '#EF444420' }
                    ]}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: device.status === 'connected' ? '#10B981' : '#EF4444' }
                      ]} />
                      <Text style={[
                        styles.statusText,
                        { color: device.status === 'connected' ? '#10B981' : '#EF4444' }
                      ]}>
                        {device.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.deviceType}>{device.type}</Text>
                </View>
                
                <View style={styles.deviceActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => openEditModal(device)}
                  >
                    <Edit3 size={16} color="#64748B" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleRemoveDevice(device.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.deviceDetails}>
                <View style={styles.connectionInfo}>
                  {device.connection === 'wifi' ? (
                    <Wifi size={16} color="#0EA5E9" />
                  ) : (
                    <Bluetooth size={16} color="#6366F1" />
                  )}
                  <Text style={styles.connectionText}>
                    {device.connection.toUpperCase()}
                  </Text>
                  {device.status === 'connected' && (
                    <Text style={styles.signalText}>
                      {device.signal}% signal
                    </Text>
                  )}
                </View>
                <Text style={styles.lastSeen}>Last seen: {device.lastSeen}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Connection Status Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Connection Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <CheckCircle size={24} color="#10B981" />
              <Text style={styles.summaryNumber}>
                {devices.filter(d => d.status === 'connected').length}
              </Text>
              <Text style={styles.summaryLabel}>Connected</Text>
            </View>
            <View style={styles.summaryCard}>
              <AlertCircle size={24} color="#EF4444" />
              <Text style={styles.summaryNumber}>
                {devices.filter(d => d.status === 'disconnected').length}
              </Text>
              <Text style={styles.summaryLabel}>Offline</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Device Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Device</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleAddDevice}
              >
                <Text style={styles.confirmButtonText}>Add Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Device Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Device</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Device name"
              value={deviceName}
              onChangeText={setDeviceName}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton}
                onPress={handleEditDevice}
              >
                <Text style={styles.confirmButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0EA5E9',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  devicesContainer: {
    paddingHorizontal: 20,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  deviceType: {
    fontSize: 14,
    color: '#64748B',
  },
  deviceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  deviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  signalText: {
    fontSize: 12,
    color: '#64748B',
  },
  lastSeen: {
    fontSize: 12,
    color: '#94A3B8',
  },
  summaryContainer: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});