import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Droplets,
  Power,
  Zap,
  TrendingUp,
  Activity,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

function DashboardScreen() {
  const [waterLevel, setWaterLevel] = useState(75);
  const [pumpStatus, setPumpStatus] = useState(false);
  const [voltage, setVoltage] = useState(220);

  const waterFillHeight = useSharedValue(0);
  const pumpScale = useSharedValue(1);

  useEffect(() => {
    waterFillHeight.value = withTiming(waterLevel, { duration: 1500 });
  }, [waterLevel]);

  const animatedWaterStyle = useAnimatedStyle(() => ({
    height: `${waterFillHeight.value}%`,
  }));

  const animatedPumpStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pumpScale.value }],
  }));

  const togglePump = () => {
    pumpScale.value = withSpring(0.95, { duration: 100 }, () => {
      pumpScale.value = withSpring(1);
    });
    setPumpStatus(!pumpStatus);
  };

  const voltageStatus = voltage >= 200 ? 'Safe' : 'Unsafe';
  const voltageColor = voltage >= 200 ? '#10B981' : '#EF4444';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Water Pump Monitor</Text>
          <Text style={styles.subtitle}>Main Tank System</Text>
        </View>

        {/* Water Tank Level Indicator */}
        <View style={styles.tankContainer}>
          <View style={styles.tankWrapper}>
            <View style={styles.tank}>
              <Animated.View style={[styles.waterFill, animatedWaterStyle]} />
              <View style={styles.tankOverlay}>
                <Droplets size={40} color="#FFFFFF" />
                <Text style={styles.tankPercentage}>{waterLevel}%</Text>
                <Text style={styles.tankLabel}>Water Level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Status Cards Row */}
        <View style={styles.statusRow}>
          <Animated.View style={[styles.statusCard, animatedPumpStyle]}>
            <TouchableOpacity onPress={togglePump} style={styles.statusCardContent}>
              <Power
                size={24}
                color={pumpStatus ? '#10B981' : '#667eea'}
              />
              <Text style={styles.statusLabel}>Pump</Text>
              <Text style={[
                styles.statusValue,
                { color: pumpStatus ? '#10B981' : '#667eea' }
              ]}>
                {pumpStatus ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.statusCard}>
            <View style={styles.statusCardContent}>
              <Zap size={24} color={voltageColor} />
              <Text style={styles.statusLabel}>Voltage</Text>
              <Text style={[styles.statusValue, { color: voltageColor }]}>
                {voltageStatus}
              </Text>
              <Text style={styles.statusSubtext}>{voltage}V</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => setPumpStatus(true)}
            >
              <Power size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Turn ON</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => setPumpStatus(false)}
            >
              <Power size={20} color="#667eea" />
              <Text style={styles.secondaryButtonText}>Turn OFF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart Preview */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <TrendingUp size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Water Level Trend</Text>
          </View>
          <View style={styles.chartPreview}>
            <View style={styles.chartBars}>
              {[65, 70, 68, 75, 80, 75, 72].map((height, index) => (
                <View
                  key={index}
                  style={[
                    styles.chartBar,
                    { height: (height / 100) * 60 }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.chartNote}>Last 7 days</Text>
          </View>
        </View>

        {/* System Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.activityHeader}>
            <Activity size={20} color="#667eea" />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.activityText}>Pump started automatically</Text>
              <Text style={styles.activityTime}>2 min ago</Text>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: '#667eea' }]} />
              <Text style={styles.activityText}>Water level reached 70%</Text>
              <Text style={styles.activityTime}>15 min ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen;

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
  tankContainer: {
    padding: 20,
    alignItems: 'center',
  },
  tankWrapper: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 8,
  },
  tank: {
    width: '100%',
    height: '100%',
    borderRadius: 92,
    backgroundColor: '#f1f5f9',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#667eea',
    borderRadius: 92,
  },
  tankOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tankPercentage: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  tankLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardContent: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  actionsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  chartPreview: {
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 80,
    marginBottom: 12,
  },
  chartBar: {
    width: 20,
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  chartNote: {
    fontSize: 12,
    color: '#666',
  },
  activityContainer: {
    margin: 20,
    marginTop: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
});