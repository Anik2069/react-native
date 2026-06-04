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
          console.log(list)
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
          const res = await axios.get(`http://${gatewayIp}/status`, { timeout: 2000 });
          if (res.status === 200) {
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
    <SafeAreaProvider className="flex-1 bg-slate-900 mb-[100px]">
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-grow-1" contentContainerStyle={{ paddingBottom: 40 }}>

          {/* Custom Premium Header */}
          <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-800 bg-slate-950">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center bg-slate-800 p-2 rounded-full"
            >
              <Ionicons name="arrow-back" size={22} color="#60a5fa" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-white tracking-wide">Connect to Smart Pump</Text>
            <TouchableOpacity
              onPress={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-full ${showAdvanced ? 'bg-blue-900/40' : 'bg-slate-800'}`}
            >
              <Ionicons name="settings-sharp" size={22} color={showAdvanced ? '#60a5fa' : '#94a3b8'} />
            </TouchableOpacity>
          </View>

          {/* AP Status Card */}
          <View className="m-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xs text-gray-500">Phone Connected Wi-Fi</Text>
                <Text className="text-white font-medium mt-0.5">
                  {phoneWifiSSID || 'Detecting...'}
                </Text>
                <Text className="text-slate-500 text-[10px] mt-0.5">Gateway: {gatewayIp}</Text>
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

          {/* Step 1 Title */}
          <View className="mx-4 mt-2 mb-1">
            <Text className="text-white font-bold text-lg">Step 1: Connect to Pump Hotspot</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Select your Smart Pump's open network to connect your phone.</Text>
          </View>

          {/* Phone Scanned Open Wi-Fi List */}
          <View className="mx-4 mb-4 mt-2 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="wifi-sharp" size={20} color="#60a5fa" />
                <Text className="text-white font-semibold text-lg">Open Networks</Text>
              </View>
              <TouchableOpacity
                onPress={handlePhoneScan}
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
                <Text className="text-slate-400 text-sm mt-3 animate-pulse">Scanning open Wi-Fi networks...</Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length === 0 && (
              <View className="py-8 items-center">
                <Ionicons name="wifi-outline" size={32} color="#475569" />
                <Text className="text-slate-500 text-xs mt-2 text-center">No open networks found. Press Scan to retry.</Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length > 0 && (
              <View className="space-y-2">
                {scannedNetworks.map((net, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => connectToHotspot(net)}
                    disabled={isConnectingPhone}
                    className={`flex-row justify-between items-center p-3 rounded-xl border border-slate-800/80 ${selectedHotspot === net.ssid ? 'bg-blue-950/40 border-blue-500/50' : 'bg-slate-900/60'}`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name={getWifiIcon(net.rssi)} size={18} color={selectedHotspot === net.ssid ? '#60a5fa' : '#94a3b8'} />
                      <View>
                        <Text className="text-white text-sm font-medium">{net.ssid}</Text>
                        <Text className="text-slate-500 text-[10px]">Signal: {net.rssi} dBm</Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                      {isConnectingPhone && selectedHotspot === net.ssid ? (
                        <ActivityIndicator size="small" color="#60a5fa" />
                      ) : (
                        <View className={`px-2.5 py-1 rounded-full ${selectedHotspot === net.ssid ? 'bg-blue-500' : 'bg-slate-800'}`}>
                          <Text className="text-white text-[10px] font-bold">
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
            className="mx-4 mb-4 py-4 rounded-xl flex-row justify-center items-center shadow-lg bg-emerald-600"
          >
            <Ionicons name="wifi-sharp" size={20} color="#fff" className="mr-2" />
            <Text className="text-white text-base font-bold">Setup Device Wi-Fi</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
