import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Activity, Zap, Calendar, Filter } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const chartData = {
  daily: [
    { label: '6AM', waterLevel: 45, runtime: 2, power: 1.2 },
    { label: '9AM', waterLevel: 65, runtime: 3, power: 1.8 },
    { label: '12PM', waterLevel: 80, runtime: 1, power: 0.6 },
    { label: '3PM', waterLevel: 70, runtime: 2, power: 1.2 },
    { label: '6PM', waterLevel: 85, runtime: 2.5, power: 1.5 },
    { label: '9PM', waterLevel: 75, runtime: 1.5, power: 0.9 },
  ],
  weekly: [
    { label: 'Mon', waterLevel: 68, runtime: 8, power: 4.8 },
    { label: 'Tue', waterLevel: 72, runtime: 6, power: 3.6 },
    { label: 'Wed', waterLevel: 65, runtime: 10, power: 6.0 },
    { label: 'Thu', waterLevel: 78, runtime: 5, power: 3.0 },
    { label: 'Fri', waterLevel: 70, runtime: 7, power: 4.2 },
    { label: 'Sat', waterLevel: 75, runtime: 4, power: 2.4 },
    { label: 'Sun', waterLevel: 80, runtime: 3, power: 1.8 },
  ],
  monthly: [
    { label: 'Week 1', waterLevel: 70, runtime: 45, power: 27 },
    { label: 'Week 2', waterLevel: 68, runtime: 52, power: 31.2 },
    { label: 'Week 3', waterLevel: 75, runtime: 38, power: 22.8 },
    { label: 'Week 4', waterLevel: 72, runtime: 41, power: 24.6 },
  ],
};

export default function AnalyticsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedMetric, setSelectedMetric] = useState('waterLevel');

  const currentData = chartData[selectedPeriod];
  const maxValue = Math.max(...currentData.map(item => item[selectedMetric]));

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'waterLevel': return 'Water Level (%)';
      case 'runtime': return 'Runtime (hours)';
      case 'power': return 'Power Usage (kWh)';
      default: return '';
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case 'waterLevel': return '#0EA5E9';
      case 'runtime': return '#10B981';
      case 'power': return '#F59E0B';
      default: return '#0EA5E9';
    }
  };

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case 'waterLevel': return Activity;
      case 'runtime': return TrendingUp;
      case 'power': return Zap;
      default: return Activity;
    }
  };

  const MetricIcon = getMetricIcon();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>System performance insights</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['daily', 'weekly', 'monthly'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metric Selector */}
        <View style={styles.metricsContainer}>
          <View style={styles.sectionHeader}>
            <Filter size={20} color="#0EA5E9" />
            <Text style={styles.sectionTitle}>Select Metric</Text>
          </View>
          
          <View style={styles.metricButtons}>
            <TouchableOpacity
              style={[
                styles.metricButton,
                selectedMetric === 'waterLevel' && styles.metricButtonActive
              ]}
              onPress={() => setSelectedMetric('waterLevel')}
            >
              <Activity size={16} color={selectedMetric === 'waterLevel' ? '#FFFFFF' : '#0EA5E9'} />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'waterLevel' && styles.metricButtonTextActive
              ]}>
                Water Level
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.metricButton,
                selectedMetric === 'runtime' && styles.metricButtonActive
              ]}
              onPress={() => setSelectedMetric('runtime')}
            >
              <TrendingUp size={16} color={selectedMetric === 'runtime' ? '#FFFFFF' : '#10B981'} />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'runtime' && styles.metricButtonTextActive
              ]}>
                Runtime
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.metricButton,
                selectedMetric === 'power' && styles.metricButtonActive
              ]}
              onPress={() => setSelectedMetric('power')}
            >
              <Zap size={16} color={selectedMetric === 'power' ? '#FFFFFF' : '#F59E0B'} />
              <Text style={[
                styles.metricButtonText,
                selectedMetric === 'power' && styles.metricButtonTextActive
              ]}>
                Power Usage
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <MetricIcon size={20} color={getMetricColor()} />
            <Text style={styles.chartTitle}>{getMetricLabel()}</Text>
          </View>
          
          <View style={styles.chart}>
            <View style={styles.chartBars}>
              {currentData.map((item, index) => (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (item[selectedMetric] / maxValue) * 120,
                        backgroundColor: getMetricColor(),
                      }
                    ]}
                  />
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Performance Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Activity size={24} color="#0EA5E9" />
              <Text style={styles.statValue}>
                {Math.round(currentData.reduce((sum, item) => sum + item.waterLevel, 0) / currentData.length)}%
              </Text>
              <Text style={styles.statLabel}>Avg Water Level</Text>
            </View>
            
            <View style={styles.statCard}>
              <TrendingUp size={24} color="#10B981" />
              <Text style={styles.statValue}>
                {currentData.reduce((sum, item) => sum + item.runtime, 0).toFixed(1)}h
              </Text>
              <Text style={styles.statLabel}>Total Runtime</Text>
            </View>
            
            <View style={styles.statCard}>
              <Zap size={24} color="#F59E0B" />
              <Text style={styles.statValue}>
                {currentData.reduce((sum, item) => sum + item.power, 0).toFixed(1)} kWh
              </Text>
              <Text style={styles.statLabel}>Power Consumed</Text>
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
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#0EA5E9',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  metricsContainer: {
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
  metricButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  metricButtonActive: {
    backgroundColor: '#0EA5E9',
    borderColor: '#0EA5E9',
  },
  metricButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  metricButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
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
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  chart: {
    alignItems: 'center',
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    height: 140,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
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
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});