import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import WifiManager from 'react-native-wifi-reborn';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function WifiConfig() {
  const router = useRouter();

  // Config/Form states
  const [gatewayIp, setGatewayIp] = useState('192.168.4.1');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Phone Scanning & Connecting states
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNetworks, setScannedNetworks] = useState<any[]>([]);
  const [selectedHotspot, setSelectedHotspot] = useState('');
  const [isConnectingPhone, setIsConnectingPhone] = useState(false);

  // AP Verification states
  const [apStatus, setApStatus] = useState<'checking' | 'connected' | 'disconnected'>('disconnected');
  const [isApChecking, setIsApChecking] = useState(false);
  const [phoneWifiSSID, setPhoneWifiSSID] = useState('');

  // Check connection to Smart Pump Access Point (AP)
  const checkApConnection = async (silent = false) => {
    if (!silent) setIsApChecking(true);
    setApStatus('checking');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await axios.get(`http://${gatewayIp}/`, {
        signal: controller.signal,
        validateStatus: () => true, // Accept any HTTP status code to confirm reachability
      });
      clearTimeout(timeoutId);

      if (response.status) {
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
      loadCurrentWifiSSID();
    }
  };

  // Fetch currently connected Wi-Fi name
  const loadCurrentWifiSSID = async () => {
    let detectedSsid = '';

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );

        let hasPermission = granted;
        if (!hasPermission) {
          const requestResult = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          hasPermission = requestResult === PermissionsAndroid.RESULTS.GRANTED;
        }

        if (hasPermission) {
          let currentSsid = '';
          try {
            currentSsid = await WifiManager.getCurrentWifiSSID();
          } catch (err) {
            console.log('getCurrentWifiSSID failed:', err);
          }

          if (currentSsid && currentSsid !== '<unknown ssid>') {
            detectedSsid = currentSsid.replace(/^"|"$/g, '');
          }
        }
      } catch (err) {
        console.error('Error fetching current Wi-Fi SSID on Android:', err);
      }
    } else {
      try {
        let currentSsid = '';
        try {
          currentSsid = await WifiManager.getCurrentWifiSSID();
        } catch (err) {
          console.log('getCurrentWifiSSID failed on iOS:', err);
        }
        if (currentSsid && currentSsid !== '<unknown ssid>') {
          detectedSsid = currentSsid.replace(/^"|"$/g, '');
        }
      } catch (err) {
        console.error('Error fetching current Wi-Fi SSID on iOS:', err);
      }
    }

    if (detectedSsid) {
      setPhoneWifiSSID(detectedSsid);
    } else {
      if (apStatus === 'connected') {
        setPhoneWifiSSID('Smart Pump Hotspot (Connected)');
      } else {
        setPhoneWifiSSID('Disconnected / Unknown');
      }
    }
  };

  // Scan for nearby open Wi-Fi networks (Phone-side)
  const handlePhoneScan = async () => {
    setIsScanning(true);
    setScannedNetworks([]);

    if (Platform.OS === 'ios') {
      Alert.alert(
        'iOS Device',
        'On iOS, please connect to the Smart Pump hotspot (e.g. SmartPump_AP) directly in your iPhone Wi-Fi Settings, then return to this app.'
      );
      setIsScanning(false);
      return;
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your location to scan for nearby open Wi-Fi networks.',
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
            // Only show open networks
            const openNetworks = mapped.filter(n => n.ssid.trim() !== '' && !n.secure);
            openNetworks.sort((a, b) => b.rssi - a.rssi);
            setScannedNetworks(openNetworks);
          }
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to scan for open Wi-Fi.');
        }
      } catch (err) {
        console.error('Phone-side scanning error:', err);
      } finally {
        setIsScanning(false);
      }
    }
  };

  // Connect phone to the chosen open hotspot
  const connectToHotspot = async (net: any) => {
    setSelectedHotspot(net.ssid);
    setIsConnectingPhone(true);

    try {
      if (Platform.OS === 'android') {
        await WifiManager.connectToProtectedSSID(net.ssid, '', false, false);
        // Force routing over this new Wi-Fi connection
        await WifiManager.forceWifiUsage(true);
      } else {
        await WifiManager.connectToProtectedSSID(net.ssid, '', false, false);
      }

      // Successfully connected phone, now ping the gateway to verify.
      // We give the OS extra time (up to 10-12 seconds) to assign IP address and route.
      let isReachable = false;
      for (let i = 0; i < 8; i++) {
        await new Promise(resolve => setTimeout(resolve, 1200));
        try {
          if (Platform.OS === 'android') {
            await WifiManager.forceWifiUsage(true);
          }
          const res = await axios.get(`http://${gatewayIp}/`, { 
            timeout: 2000,
            validateStatus: () => true 
          });
          if (res.status) {
            isReachable = true;
            break;
          }
        } catch (e) {
          // Retry
        }
      }

      if (isReachable) {
        setApStatus('connected');
        setPhoneWifiSSID(net.ssid);
        setIsConnectingPhone(false);
        setSelectedHotspot('');
        router.push({ pathname: '/(auth)/wifi-setup', params: { gatewayIp } });
      } else {
        setIsConnectingPhone(false);
        setSelectedHotspot('');
        Alert.alert(
          'Hotspot Connection Failed',
          `Connected to Wi-Fi ${net.ssid}, but the Smart Pump is not reachable at http://${gatewayIp}.`
        );
      }
    } catch (err) {
      console.error('Failed to connect phone to hotspot:', err);
      setSelectedHotspot('');
      Alert.alert('Connection Failed', `Could not connect your phone to ${net.ssid}.`);
    } finally {
      setIsConnectingPhone(false);
    }
  };

  // Manage Wi-Fi usage binding on focus
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        WifiManager.forceWifiUsage(true)
          .then(() => console.log('Wi-Fi usage forced successfully (wifi-config focus)'))
          .catch((err) => console.error('Failed to force Wi-Fi usage on focus:', err));
      }
    }, [])
  );

  // Run initial check on load and release Wi-Fi routing on unmount
  useEffect(() => {
    checkApConnection(true);
    loadCurrentWifiSSID();
    handlePhoneScan();

    return () => {
      if (Platform.OS === 'android') {
        WifiManager.forceWifiUsage(false)
          .then(() => console.log('Wi-Fi usage released on unmount (wifi-config)'))
          .catch((err) => console.error('Failed to release Wi-Fi usage on unmount:', err));
      }
    };
  }, [gatewayIp]);



  // Helper to determine Wi-Fi icon based on signal strength (RSSI)
  const getWifiIcon = (rssi: number) => {
    if (rssi >= -50) return 'wifi-sharp';
    return 'wifi-outline';
  };

  return (
    <SafeAreaProvider className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-grow-1" contentContainerStyle={{ paddingBottom: 60 }}>

          {/* Custom Premium Header */}
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-100 bg-white">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center bg-slate-100 p-2 rounded-full active:bg-slate-200"
            >
              <Ionicons name="arrow-back" size={20} color="#2563eb" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-slate-800 tracking-wide">Connect to Smart Pump</Text>
            <TouchableOpacity
              onPress={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-full active:bg-slate-200 ${showAdvanced ? 'bg-blue-50' : 'bg-slate-100'}`}
            >
              <Ionicons name="settings-sharp" size={20} color={showAdvanced ? '#2563eb' : '#64748b'} />
            </TouchableOpacity>
          </View>

          {/* Step Progress Tracker */}
          <View className="flex-row justify-center items-center px-4 py-4 bg-white border-b border-slate-100 shadow-sm">
            <View className="flex-row items-center">
              <View className="w-7 h-7 rounded-full bg-blue-600 items-center justify-center shadow-sm shadow-blue-200">
                <Text className="text-white font-bold text-xs">1</Text>
              </View>
              <Text className="ml-2 font-bold text-blue-600 text-xs">Connect to Pump</Text>
            </View>
            <View className="w-8 h-[2px] bg-slate-200 mx-3" />
            <View className="flex-row items-center opacity-40">
              <View className="w-7 h-7 rounded-full bg-slate-200 items-center justify-center">
                <Text className="text-slate-600 font-bold text-xs">2</Text>
              </View>
              <Text className="ml-2 font-bold text-slate-600 text-xs">Setup Device Wi-Fi</Text>
            </View>
          </View>

          {/* AP Status Card */}
          <View className="m-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Connection</Text>
                <Text className="text-slate-800 font-bold mt-1 text-[15px]">
                  {phoneWifiSSID || 'Detecting...'}
                </Text>
                <Text className="text-slate-400 text-[11px] mt-0.5 font-mono">Gateway: {gatewayIp}</Text>
              </View>
              <View className="flex-row items-center gap-2">
                {apStatus === 'checking' ? (
                  <ActivityIndicator size="small" color="#2563eb" />
                ) : apStatus === 'connected' ? (
                  <View className="flex-row items-center bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    <Text className="text-emerald-700 text-xs font-bold">Connected</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
                    <View className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                    <Text className="text-rose-700 text-xs font-bold">Offline</Text>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => checkApConnection(false)}
                  disabled={isApChecking}
                  className="bg-slate-50 p-2 rounded-full border border-slate-100 active:bg-slate-200"
                >
                  <Ionicons name="refresh" size={14} color="#2563eb" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Advanced Settings */}
          {showAdvanced && (
            <View className="mx-4 mb-4 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <Text className="text-slate-800 font-bold text-xs mb-3">Advanced Parameters</Text>
              <View className="mb-2">
                <Text className="text-slate-500 text-[11px] mb-1 font-semibold">Gateway IP Address</Text>
                <TextInput
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-[14px] font-semibold"
                  value={gatewayIp}
                  onChangeText={setGatewayIp}
                  placeholder="e.g. 192.168.4.1"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>
          )}

          {/* Step 1 Title */}
          <View className="mx-4 mt-2 mb-2">
            <Text className="text-slate-800 font-bold text-[17px]">Step 1: Connect to Pump Hotspot</Text>
            <Text className="text-slate-500 text-xs mt-1 leading-relaxed">
              Connect your phone to the Smart Pump's open Wi-Fi network (e.g. SmartPump_AP) to verify connection.
            </Text>
          </View>

          {/* Phone Scanned Open Wi-Fi List */}
          <View className="mx-4 mb-4 mt-2 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="wifi-sharp" size={18} color="#2563eb" />
                <Text className="text-slate-800 font-bold text-[15px]">Open Networks</Text>
              </View>
              <TouchableOpacity
                onPress={handlePhoneScan}
                disabled={isScanning}
                className="bg-blue-600 disabled:bg-blue-400 px-4 py-1.5 rounded-full flex-row items-center gap-1 shadow-sm shadow-blue-200 active:bg-blue-700"
              >
                {isScanning ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="search" size={12} color="#fff" />
                    <Text className="text-white text-xs font-bold">Scan</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {isScanning && (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-slate-400 text-xs mt-3 font-medium">Scanning open Wi-Fi networks...</Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length === 0 && (
              <View className="py-8 items-center">
                <Ionicons name="wifi-outline" size={28} color="#94a3b8" />
                <Text className="text-slate-400 text-xs mt-2 text-center leading-relaxed max-w-[200px]">
                  No open networks found. Turn on Wi-Fi/Location and Scan again.
                </Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length > 0 && (
              <View className="space-y-2">
                {scannedNetworks.map((net, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => connectToHotspot(net)}
                    disabled={isConnectingPhone}
                    className={`flex-row justify-between items-center p-3 rounded-xl border ${selectedHotspot === net.ssid ? 'bg-blue-50/40 border-blue-300' : 'bg-slate-50 border-slate-100'} active:bg-blue-50/20`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name={getWifiIcon(net.rssi)} size={18} color={selectedHotspot === net.ssid ? '#2563eb' : '#64748b'} />
                      <View>
                        <Text className="text-slate-800 text-sm font-semibold">{net.ssid}</Text>
                        <Text className="text-slate-400 text-[10px] mt-0.5">Signal: {net.rssi} dBm</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {isConnectingPhone && selectedHotspot === net.ssid ? (
                        <ActivityIndicator size="small" color="#2563eb" />
                      ) : (
                        <View className={`px-2.5 py-1 rounded-full ${selectedHotspot === net.ssid ? 'bg-blue-600' : 'bg-slate-200'}`}>
                          <Text className={`text-[10px] font-bold ${selectedHotspot === net.ssid ? 'text-white' : 'text-slate-600'}`}>
                            {selectedHotspot === net.ssid ? 'Connecting' : 'Connect'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Setup Device Wi-Fi Button */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(auth)/wifi-setup', params: { gatewayIp } })}
            className="mx-4 mb-4 py-4 rounded-xl flex-row justify-center items-center shadow-md shadow-blue-200 bg-blue-600 active:bg-blue-700"
          >
            <Ionicons name="wifi-sharp" size={18} color="#fff" className="mr-2" />
            <Text className="text-white text-[15px] font-bold">Setup Device Wi-Fi</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
