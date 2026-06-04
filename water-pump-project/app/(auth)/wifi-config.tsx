import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
  PermissionsAndroid
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import WifiManager from 'react-native-wifi-reborn';

// Mock scanned Wi-Fi networks
const MOCK_NETWORKS = [
  { ssid: 'Home_WiFi_2.4G', rssi: -45, secure: true },
  { ssid: 'Smart_Water_Net', rssi: -55, secure: true },
  { ssid: 'TP-Link_Guest', rssi: -68, secure: false },
  { ssid: 'Office_Fast_Net', rssi: -72, secure: true },
  { ssid: 'Linksys_Setup', rssi: -85, secure: false },
];

export default function WifiConfig() {
  const router = useRouter();

  // Form states
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [gatewayIp, setGatewayIp] = useState('192.168.4.1');
  const [isSimulatedMode, setIsSimulatedMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // UI Flow states
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNetworks, setScannedNetworks] = useState<typeof MOCK_NETWORKS>([]);
  const [apStatus, setApStatus] = useState<'checking' | 'connected' | 'disconnected'>('disconnected');
  const [isApChecking, setIsApChecking] = useState(false);

  // Connection progress states
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [connectionStepsText, setConnectionStepsText] = useState<string[]>([]);
  const [connectionResult, setConnectionResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Check connection to Smart Pump Access Point (AP)
  const checkApConnection = async (silent = false) => {
    if (!silent) setIsApChecking(true);
    setApStatus('checking');

    if (isSimulatedMode) {
      // Simulate checking connection
      setTimeout(() => {
        setApStatus('connected');
        setIsApChecking(false);
        if (!silent) Alert.alert('Connection Status', 'Successfully connected to SmartPump Access Point (Simulated)');
      }, 1000);
      return;
    }

    // Real Mode: Ping gateway
    try {
      // Typically the ESP32 AP has a status endpoint or just root
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await axios.get(`http://${gatewayIp}/status`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 200) {
        setApStatus('connected');
      } else {
        setApStatus('disconnected');
      }
    } catch (error) {
      setApStatus('disconnected');
      if (!silent) {
        Alert.alert(
          'Connection Error',
          `Could not reach the Smart Pump at http://${gatewayIp}. Please ensure you are connected to the pump's Wi-Fi network (hotspot) in your phone's Wi-Fi settings.`
        );
      }
    } finally {
      setIsApChecking(false);
    }
  };

  // Run initial check on load
  useEffect(() => {
    checkApConnection(true);
  }, [isSimulatedMode, gatewayIp]);

  // Scan Wi-Fi networks
  const handleScan = async () => {
    setIsScanning(true);
    setScannedNetworks([]);
    console.log('scanning started', isSimulatedMode)
    // if (isSimulatedMode) {
    //   // Simulating scan delay
    //   setTimeout(() => {
    //     setScannedNetworks(MOCK_NETWORKS);
    //     setIsScanning(false);
    //   }, 1200);
    //   return;
    // }

    let foundNetworks: { ssid: string; rssi: number; secure: boolean }[] = [];

    // 1. Try Phone-side scanning (Android-only)
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your location to scan for nearby Wi-Fi networks.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          const list = await WifiManager.loadWifiList();
          if (list && list.length > 0) {
            const mapped = list.map((net: any) => ({
              ssid: net.SSID || 'Unknown Network',
              rssi: net.level || -100,
              secure: net.capabilities ? (
                net.capabilities.includes('WEP') ||
                net.capabilities.includes('WPA') ||
                net.capabilities.includes('WPS')
              ) : false
            }));
            foundNetworks = mapped.filter(n => n.ssid.trim() !== '');
          }
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.error('Phone-side scanning error:', err);
      }
    }

    // 2. Fallback to Device-side scanning (e.g., iOS or when phone-side returned no results)
    if (foundNetworks.length === 0) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await axios.get(`http://${gatewayIp}/scan`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.data && Array.isArray(response.data.networks)) {
          const mapped = response.data.networks.map((net: any) => ({
            ssid: net.ssid || net.SSID || 'Unknown Network',
            rssi: typeof net.rssi === 'number' ? net.rssi : (net.level || -75),
            secure: net.secure !== undefined ? net.secure : (net.capabilities ? !net.capabilities.includes('OPEN') : true)
          }));
          foundNetworks = mapped.filter((n: any) => n.ssid.trim() !== '');
        } else if (response.data && Array.isArray(response.data)) {
          const mapped = response.data.map((net: any) => ({
            ssid: net.ssid || net.SSID || 'Unknown Network',
            rssi: typeof net.rssi === 'number' ? net.rssi : (net.level || -75),
            secure: net.secure !== undefined ? net.secure : true
          }));
          foundNetworks = mapped.filter((n: any) => n.ssid.trim() !== '');
        }
      } catch (error) {
        console.error('Device-side scanning error:', error);
      }
    }
    console.log(foundNetworks, 'foundNetworks')
    // If both scanning methods failed to find anything, show warning and fallback to simulated data
    if (foundNetworks.length === 0) {
      Alert.alert(
        'No Networks Found',
        'Could not scan any networks. Please make sure location services are enabled on your phone, or that you are connected to the pump hotspot.'
      );
      setScannedNetworks(MOCK_NETWORKS);
    } else {
      // Sort by signal strength (strongest first)
      foundNetworks.sort((a, b) => b.rssi - a.rssi);
      setScannedNetworks(foundNetworks);
    }

    setIsScanning(false);
  };

  // Helper to determine Wi-Fi icon based on signal strength (RSSI)
  const getWifiIcon = (rssi: number, secure: boolean) => {
    let level = '1';
    if (rssi >= -50) level = '4';
    else if (rssi >= -65) level = '3';
    else if (rssi >= -80) level = '2';

    if (secure) {
      return `wifi-sharp` as any; // Or custom secure icon name
    }
    return `wifi-outline` as any;
  };

  // Auto-fill SSID
  const selectNetwork = (selectedSsid: string) => {
    setSsid(selectedSsid);
  };

  // Send WiFi config credentials to the pump
  const handleConfigure = async () => {
    if (!ssid) {
      Alert.alert('Validation Error', 'Please select or enter a Wi-Fi SSID.');
      return;
    }

    setIsConnecting(true);
    setConnectionResult('idle');
    setErrorMessage('');

    const steps = [
      'Sending Wi-Fi credentials to pump...',
      'Smart Pump connecting to local router...',
      'Testing internet access...',
      'Validating device registration...'
    ];
    setConnectionStepsText(steps);

    if (isSimulatedMode) {
      // Step-by-step simulated connection
      setConnectionStep(0);
      setTimeout(() => {
        setConnectionStep(1);
        setTimeout(() => {
          setConnectionStep(2);
          setTimeout(() => {
            setConnectionStep(3);
            setTimeout(() => {
              setConnectionResult('success');
              setIsConnecting(false);
            }, 1000);
          }, 1200);
        }, 1200);
      }, 1000);
      return;
    }

    // Real Mode: Send HTTP request to ESP32
    setConnectionStep(0);
    try {
      const formData = new FormData();
      formData.append('ssid', ssid);
      formData.append('password', password);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Send credentials
      const response = await axios.post(`http://${gatewayIp}/config`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.data && response.data.status === 'success') {
        setConnectionStep(1);
        // Wait and check if the device is successfully connected
        let checkCount = 0;
        const checkInterval = setInterval(async () => {
          checkCount++;
          setConnectionStep(Math.min(2 + Math.floor(checkCount / 2), 3));

          if (checkCount > 5) {
            clearInterval(checkInterval);
            setConnectionResult('success');
            setIsConnecting(false);
          }
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to apply configuration');
      }
    } catch (error: any) {
      console.error('Config submission error:', error);
      setConnectionResult('failed');
      setErrorMessage(error.message || 'Could not connect to device. Ensure you are connected to the smart pump hotspot.');
      setIsConnecting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          >

            {/* Custom Premium Header */}
            <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-800 bg-slate-950">
              <TouchableOpacity
                onPress={() => router.back()}
                className="flex-row items-center bg-slate-800 p-2 rounded-full"
              >
                <Ionicons name="arrow-back" size={22} color="#60a5fa" />
              </TouchableOpacity>
              <Text className="text-xl font-bold text-white tracking-wide">Wi-Fi Provisioning</Text>
              <TouchableOpacity
                onPress={() => setShowAdvanced(!showAdvanced)}
                className={`p-2 rounded-full ${showAdvanced ? 'bg-blue-900/40' : 'bg-slate-800'}`}
              >
                <Ionicons name="settings-sharp" size={22} color={showAdvanced ? '#60a5fa' : '#94a3b8'} />
              </TouchableOpacity>
            </View>

            {/* Mode & AP Status Card */}
            <View className="m-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <View className="flex-row justify-between items-center pb-3 border-b border-slate-800/60">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="cube-outline" size={20} color="#38bdf8" />
                  <Text className="text-gray-300 font-semibold text-sm">Mode Selection</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-gray-400">Simulation</Text>
                  <Switch
                    value={isSimulatedMode}
                    onValueChange={setIsSimulatedMode}
                    trackColor={{ false: '#475569', true: '#2563eb' }}
                    thumbColor={isSimulatedMode ? '#60a5fa' : '#cbd5e1'}
                  />
                </View>
              </View>

              <View className="flex-row justify-between items-center pt-3">
                <View>
                  <Text className="text-xs text-gray-500">Smart Pump Access Point</Text>
                  <Text className="text-white font-medium mt-0.5">
                    {isSimulatedMode ? 'SmartPump_Mock_AP' : `IP: ${gatewayIp}`}
                  </Text>
                </View>
                <View className="flex-row items-center gap-2">
                  {apStatus === 'checking' ? (
                    <ActivityIndicator size="small" color="#60a5fa" />
                  ) : apStatus === 'connected' ? (
                    <View className="flex-row items-center bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      <View className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                      <Text className="text-emerald-400 text-xs font-semibold">Connected</Text>
                    </View>
                  ) : (
                    <View className="flex-row items-center bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                      <View className="w-2 h-2 rounded-full bg-rose-400 mr-2" />
                      <Text className="text-rose-400 text-xs font-semibold">Offline</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => checkApConnection(false)}
                    disabled={isApChecking}
                    className="bg-slate-800 p-1.5 rounded-full"
                  >
                    <Ionicons name="refresh" size={16} color="#60a5fa" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Advanced Settings */}
            {showAdvanced && (
              <View className="mx-4 mb-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800">
                <Text className="text-white font-semibold text-sm mb-3">Advanced Parameters</Text>
                <View className="mb-2">
                  <Text className="text-slate-400 text-xs mb-1">Gateway IP Address</Text>
                  <TextInput
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-[15px]"
                    value={gatewayIp}
                    onChangeText={setGatewayIp}
                    placeholder="e.g. 192.168.4.1"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}

            {/* Wi-Fi Scanner Panel */}
            <View className="mx-4 mb-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="wifi" size={20} color="#60a5fa" />
                  <Text className="text-white font-semibold text-lg">Nearby Networks</Text>
                </View>
                <TouchableOpacity
                  onPress={handleScan}
                  disabled={isScanning}
                  className="bg-blue-600 disabled:bg-blue-800 px-4 py-2 rounded-full flex-row items-center gap-1 shadow"
                >
                  {isScanning ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="search" size={14} color="#fff" />
                      <Text className="text-white text-xs font-bold">Scan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              {isScanning && (
                <View className="py-8 items-center">
                  <ActivityIndicator size="large" color="#60a5fa" />
                  <Text className="text-slate-400 text-sm mt-3 animate-pulse">Scanning frequencies...</Text>
                </View>
              )}

              {!isScanning && scannedNetworks.length === 0 && (
                <View className="py-6 items-center">
                  <Ionicons name="wifi-outline" size={32} color="#475569" />
                  <Text className="text-slate-500 text-xs mt-2 text-center">No networks found yet. Press Scan.</Text>
                </View>
              )}

              {!isScanning && scannedNetworks.length > 0 && (
                <View className="space-y-2">
                  {scannedNetworks.map((net, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => selectNetwork(net.ssid)}
                      className={`flex-row justify-between items-center p-3 rounded-xl border border-slate-800/80 ${ssid === net.ssid ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-900/60'}`}
                    >
                      <View className="flex-row items-center gap-3">
                        <Ionicons name={getWifiIcon(net.rssi, net.secure)} size={18} color={ssid === net.ssid ? '#60a5fa' : '#94a3b8'} />
                        <View>
                          <Text className="text-white text-sm font-medium">{net.ssid}</Text>
                          <Text className="text-slate-500 text-[10px]">Signal: {net.rssi} dBm</Text>
                        </View>
                      </View>
                      <View className="flex-row items-center gap-2">
                        {net.secure && (
                          <Ionicons name="lock-closed" size={14} color="#475569" />
                        )}
                        <View className={`px-2.5 py-1 rounded-full ${ssid === net.ssid ? 'bg-blue-500' : 'bg-slate-800'}`}>
                          <Text className="text-white text-[10px] font-bold">
                            {ssid === net.ssid ? 'Selected' : 'Select'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Config Form */}
            <View className="mx-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
              <Text className="text-white font-semibold text-lg mb-4">Credentials Config</Text>

              {/* SSID Input */}
              <View className="mb-4">
                <Text className="text-slate-400 text-xs mb-1.5">Network Name (SSID)</Text>
                <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-xl px-3 relative focus:border-blue-500">
                  <Ionicons name="wifi" size={18} color="#475569" className="mr-2" />
                  <TextInput
                    className="flex-1 py-3.5 text-white text-[15px]"
                    placeholder="Enter network name"
                    placeholderTextColor="#475569"
                    value={ssid}
                    onChangeText={setSsid}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-slate-400 text-xs mb-1.5">Security Password</Text>
                <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-xl px-3 relative focus:border-blue-500">
                  <Ionicons name="key" size={18} color="#475569" className="mr-2" />
                  <TextInput
                    className="flex-1 py-3.5 text-white text-[15px]"
                    placeholder="Enter WiFi password"
                    placeholderTextColor="#475569"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={18}
                      color="#475569"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                onPress={handleConfigure}
                disabled={isConnecting}
                className="w-full bg-blue-600 disabled:bg-blue-800 rounded-full py-4 flex-row justify-center items-center shadow-lg"
              >
                <Ionicons name="cloud-upload" size={20} color="#fff" className="mr-2" />
                <Text className="text-white text-base font-bold">Save & Apply to Device</Text>
              </TouchableOpacity>
            </View>

            {/* Connection Progress Overlay */}
            {isConnecting && (
              <View className="absolute inset-0 bg-slate-950/95 justify-center items-center p-6 z-50">
                <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 w-full max-w-[320px] items-center">
                  <ActivityIndicator size="large" color="#60a5fa" className="mb-4" />
                  <Text className="text-white font-bold text-lg mb-2">Connecting Pump...</Text>

                  {/* Progress steps indicators */}
                  <View className="w-full space-y-3 mt-4">
                    {connectionStepsText.map((step, idx) => (
                      <View key={idx} className="flex-row items-center gap-2.5">
                        {connectionStep > idx ? (
                          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
                        ) : connectionStep === idx ? (
                          <ActivityIndicator size="small" color="#60a5fa" />
                        ) : (
                          <Ionicons name="ellipse-outline" size={18} color="#475569" />
                        )}
                        <Text className={`text-xs ${connectionStep === idx ? 'text-blue-400 font-semibold' : connectionStep > idx ? 'text-slate-400' : 'text-slate-600'}`}>
                          {step}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Success feedback screen */}
            {connectionResult === 'success' && (
              <View className="absolute inset-0 bg-slate-950/95 justify-center items-center p-6 z-50">
                <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 w-full max-w-[320px] items-center">
                  <View className="bg-emerald-500/10 p-4 rounded-full mb-4 border border-emerald-500/20">
                    <Ionicons name="checkmark-done-circle" size={54} color="#10b981" />
                  </View>
                  <Text className="text-white font-bold text-xl mb-2 text-center">Setup Completed!</Text>
                  <Text className="text-slate-400 text-xs text-center mb-6 px-2 leading-relaxed">
                    The Smart Pump controller has successfully registered the configuration parameters and is connecting to **{ssid}**.
                  </Text>

                  <View className="bg-slate-950 p-3.5 rounded-xl mb-6 w-full border border-slate-800">
                    <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1.5">Setup Details</Text>
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-slate-400 text-xs">SSID:</Text>
                      <Text className="text-white text-xs font-semibold">{ssid}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-slate-400 text-xs">Gateway IP:</Text>
                      <Text className="text-white text-xs font-semibold">{gatewayIp}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      setConnectionResult('idle');
                      router.push('/(auth)/sign-in');
                    }}
                    className="w-full bg-emerald-600 py-3.5 rounded-full items-center shadow"
                  >
                    <Text className="text-white font-bold text-sm">Return to Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Failure feedback screen */}
            {connectionResult === 'failed' && (
              <View className="absolute inset-0 bg-slate-950/95 justify-center items-center p-6 z-50">
                <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 w-full max-w-[320px] items-center">
                  <View className="bg-rose-500/10 p-4 rounded-full mb-4 border border-rose-500/20">
                    <Ionicons name="alert-circle" size={54} color="#f43f5e" />
                  </View>
                  <Text className="text-white font-bold text-xl mb-2 text-center">Setup Failed</Text>
                  <Text className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
                    {errorMessage || 'The controller failed to apply the network setup config.'}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setConnectionResult('idle')}
                    className="w-full bg-slate-800 py-3.5 rounded-full items-center mb-2.5"
                  >
                    <Text className="text-white font-bold text-sm">Try Again</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setConnectionResult('idle');
                      router.push('/(auth)/sign-in');
                    }}
                    className="w-full py-3.5 items-center"
                  >
                    <Text className="text-blue-500 font-bold text-sm">Back to Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
