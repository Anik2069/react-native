import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Power, Gauge, Battery, FileSliders as Sliders } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

export default function ControlScreen() {
  const [manualMode, setManualMode] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [powerSaving, setPowerSaving] = useState(false);
  const [lowThreshold, setLowThreshold] = useState(30);
  const [highThreshold, setHighThreshold] = useState(80);
  const [pumpOn, setPumpOn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pump Control</Text>
          <Text style={styles.subtitle}>Manual & Automatic Settings</Text>
        </View>

        {/* Manual Control Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Power size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Manual Control</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.controlRow}>
              <View style={styles.controlInfo}>
                <Text style={styles.controlLabel}>Manual Mode</Text>
                <Text style={styles.controlDescription}>
                  Override automatic controls
                </Text>
              </View>
              <Switch
                value={manualMode}
                onValueChange={setManualMode}
                trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
                thumbColor={manualMode ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            {manualMode && (
              <View style={styles.manualControls}>
                <TouchableOpacity
                  style={[
                    styles.pumpButton,
                    pumpOn ? styles.pumpButtonOn : styles.pumpButtonOff
                  ]}
                  onPress={() => setPumpOn(!pumpOn)}
                >
                  <Power 
                    size={24} 
                    color={pumpOn ? '#FFFFFF' : '#0EA5E9'} 
                  />
                  <Text style={[
                    styles.pumpButtonText,
                    { color: pumpOn ? '#FFFFFF' : '#0EA5E9' }
                  ]}>
                    {pumpOn ? 'TURN OFF' : 'TURN ON'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Automatic Mode Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Gauge size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Automatic Mode</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.controlRow}>
              <View style={styles.controlInfo}>
                <Text style={styles.controlLabel}>Auto Mode</Text>
                <Text style={styles.controlDescription}>
                  Control based on water levels
                </Text>
              </View>
              <Switch
                value={autoMode}
                onValueChange={setAutoMode}
                trackColor={{ false: '#E2E8F0', true: '#0EA5E9' }}
                thumbColor={autoMode ? '#FFFFFF' : '#94A3B8'}
              />
            </View>

            {autoMode && (
              <View style={styles.thresholdControls}>
                <View style={styles.thresholdItem}>
                  <Text style={styles.thresholdLabel}>
                    Low Threshold: {lowThreshold}%
                  </Text>
                  <Text style={styles.thresholdDescription}>
                    Pump starts when water drops below this level
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={50}
                    value={lowThreshold}
                    onValueChange={setLowThreshold}
                    minimumTrackTintColor="#0EA5E9"
                    maximumTrackTintColor="#E2E8F0"
                    thumbStyle={styles.sliderThumb}
                  />
                </View>

                <View style={styles.thresholdItem}>
                  <Text style={styles.thresholdLabel}>
                    High Threshold: {highThreshold}%
                  </Text>
                  <Text style={styles.thresholdDescription}>
                    Pump stops when water reaches this level
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={60}
                    maximumValue={95}
                    value={highThreshold}
                    onValueChange={setHighThreshold}
                    minimumTrackTintColor="#0EA5E9"
                    maximumTrackTintColor="#E2E8F0"
                    thumbStyle={styles.sliderThumb}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Power Saving */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Battery size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Power Management</Text>
          </View>
          
          <View style={styles.card}>
            <View style={styles.controlRow}>
              <View style={styles.controlInfo}>
                <Text style={styles.controlLabel}>Power Saving Mode</Text>
                <Text style={styles.controlDescription}>
                  Reduce pump power during peak hours
                </Text>
              </View>
              <Switch
                value={powerSaving}
                onValueChange={setPowerSaving}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={powerSaving ? '#FFFFFF' : '#94A3B8'}
              />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
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
    color: '#333',
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
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlInfo: {
    flex: 1,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  controlDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  manualControls: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  pumpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  pumpButtonOn: {
    backgroundColor: '#10B981',
  },
  pumpButtonOff: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0EA5E9',
  },
  pumpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  thresholdControls: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  thresholdItem: {
    marginBottom: 24,
  },
  thresholdLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  thresholdDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#0EA5E9',
    width: 20,
    height: 20,
  },
});