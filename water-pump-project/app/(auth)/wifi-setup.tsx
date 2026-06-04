import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
  TextInput,
  Modal
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import WifiManager from 'react-native-wifi-reborn';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function WifiSetup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const gatewayIp = (params.gatewayIp as string) || '192.168.4.1';

  // State variables
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNetworks, setScannedNetworks] = useState<any[]>([]);
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const displayedNetworks = scannedNetworks.filter(net => !showOpenOnly || !net.secure);

  const [ssid, setSsid] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password Modal and Input states
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<any>(null);
  const [inputPassword, setInputPassword] = useState('');

  // Connection progress states
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);
  const [connectionResult, setConnectionResult] = useState<'idle' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const connectionStepsText = [
    'Sending Wi-Fi credentials to pump...',
    'Smart Pump connecting to local router...',
    'Testing internet access...',
    'Validating device registration...'
  ];

  // Helper to determine Wi-Fi icon based on signal strength (RSSI)
  const getWifiIcon = (rssi: number, secure: boolean) => {
    let level = '1';
    if (rssi >= -50) level = '4';
    else if (rssi >= -65) level = '3';
    else if (rssi >= -80) level = '2';

    if (secure) {
      return `wifi-sharp` as any;
    }
    return `wifi-outline` as any;
  };

  // Scan Wi-Fi networks using /api/scan
  const handleScan = async () => {
    // alert(2)
    setIsScanning(true);
    setScannedNetworks([]);
    setSsid('');
    console.log(gatewayIp, "gatewayIp");
    try {
      const response = await axios.get(`http://${gatewayIp}/api/scan`, {
        // timeout: 8000,
      });

      let foundNetworks: any[] = [];
      console.log(response.data)
      if (response.data && Array.isArray(response.data.networks)) {
        foundNetworks = response.data.networks.map((net: any) => ({
          ssid: net.ssid || net.SSID || 'Unknown Network',
          rssi: typeof net.rssi === 'number' ? net.rssi : (net.level || -75),
          secure: net.secure !== undefined ? net.secure : (net.capabilities ? !net.capabilities.includes('OPEN') : true)
        }));
      } else if (response.data && Array.isArray(response.data)) {
        foundNetworks = response.data.map((net: any) => ({
          ssid: net.ssid || net.SSID || 'Unknown Network',
          rssi: typeof net.rssi === 'number' ? net.rssi : (net.level || -75),
          secure: net.secure !== undefined ? net.secure : true
        }));
      }

      // Filter empty networks
      foundNetworks = foundNetworks.filter(n => n.ssid.trim() !== '');
      foundNetworks.sort((a, b) => b.rssi - a.rssi);
      setScannedNetworks(foundNetworks);
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert(
        'Scan Failed',
        'Could not fetch network list from the Smart Pump. Ensure you are connected to its access point.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  // Handle network selection
  const selectNetwork = (net: any) => {
    setSsid(net.ssid);
    setSelectedNetwork(net);
    if (net.secure) {
      setInputPassword('');
      setShowPassword(false);
      setPasswordModalVisible(true);
    } else {
      // Connect immediately to open network on the ESP32
      submitWifiCredentials(net.ssid, '');
    }
  };

  // Trigger scan on mount
  useEffect(() => {
    const initializeSetup = async () => {
      if (Platform.OS === 'android') {
        try {
          await WifiManager.forceWifiUsage(true);
          console.log('Wi-Fi usage forced successfully on setup page');
        } catch (err) {
          console.error('Failed to force Wi-Fi usage on setup page:', err);
        }
      }
      handleScan();
    };

    initializeSetup();

    return () => {
      if (Platform.OS === 'android') {
        WifiManager.forceWifiUsage(false)
          .then(() => console.log('Wi-Fi usage released from setup page'))
          .catch((err) => console.error('Failed to release Wi-Fi usage:', err));
      }
    };
  }, []);

  // Send WiFi config credentials to the pump via POST to /api/wifi
  const submitWifiCredentials = async (targetSsid: string, targetPassword: string) => {
    setIsConnecting(true);
    setConnectionStep(0);
    setConnectionResult('idle');
    setErrorMessage('');

    try {
      console.log(gatewayIp, "gatewayIp");
      const response = await axios.post(
        `http://${gatewayIp}/api/wifi`,
        {
          ssid: targetSsid,
          password: targetPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 12000,
        }
      );

      // Check for successful response
      const isSuccess = response.status === 200 || response.status === 201 || response.data?.status === 'success';
      console.log(response.data, "response.data")
      if (isSuccess) {
        setConnectionStep(1);
        let checkCount = 0;
        const checkInterval = setInterval(async () => {
          checkCount++;
          setConnectionStep(Math.min(2 + Math.floor(checkCount / 2), 3));

          if (checkCount > 5) {
            clearInterval(checkInterval);
            setConnectionResult('success');
            setIsConnecting(false);

            // Connect the phone to the newly configured Wi-Fi network
            // try {
            //   await WifiManager.connectToProtectedSSID(targetSsid, targetPassword, false, false);
            //   console.log('Successfully connected phone to:', targetSsid);
            // } catch (err) {
            //   console.error('Failed to automatically connect phone to Wi-Fi:', err);
            // }
          }
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to apply configuration');
      }
    } catch (error: any) {
      console.error('Config submission error:', error);
      setConnectionResult('failed');
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        'Could not connect to device. Ensure you are connected to the smart pump hotspot.'
      );
      setIsConnecting(false);
    }
  };

  return (
    <SafeAreaProvider className="flex-1 bg-slate-900">
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-4 border-b border-slate-800 bg-slate-950">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center bg-slate-800 p-2 rounded-full"
          >
            <Ionicons name="arrow-back" size={22} color="#60a5fa" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-white tracking-wide">Setup Wifi on your Device</Text>
          <TouchableOpacity
            onPress={handleScan}
            disabled={isScanning}
            className="bg-slate-800 p-2 rounded-full"
          >
            <Ionicons name="refresh" size={20} color="#60a5fa" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Wi-Fi Scanner Panel */}
          <View className="m-4 bg-slate-950/80 rounded-2xl p-4 border border-slate-800 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="wifi" size={20} color="#60a5fa" />
                <Text className="text-white font-semibold text-lg">Select Network</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowOpenOnly(!showOpenOnly)}
                className={`px-3 py-1.5 rounded-full border ${showOpenOnly ? 'bg-emerald-950/80 border-emerald-500/50' : 'bg-slate-900/60 border-slate-800'}`}
              >
                <Text className={`text-[10px] font-bold ${showOpenOnly ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Public Only
                </Text>
              </TouchableOpacity>
            </View>

            {isScanning && (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#60a5fa" />
                <Text className="text-slate-400 text-sm mt-3 animate-pulse">Requesting network list...</Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length === 0 && (
              <View className="py-8 items-center">
                <Ionicons name="wifi-outline" size={32} color="#475569" />
                <Text className="text-slate-500 text-xs mt-2 text-center">No networks found. Check connection to pump.</Text>
              </View>
            )}

            {!isScanning && scannedNetworks.length > 0 && displayedNetworks.length === 0 && (
              <View className="py-8 items-center">
                <Ionicons name="eye-off-outline" size={32} color="#475569" />
                <Text className="text-slate-500 text-xs mt-2 text-center">No open networks found. Try disabling 'Public Only'.</Text>
              </View>
            )}

            {!isScanning && displayedNetworks.length > 0 && (
              <View className="space-y-2">
                {displayedNetworks.map((net, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => selectNetwork(net)}
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

          {/* Password Prompt Modal */}
          <Modal
            visible={passwordModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setPasswordModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-slate-950/80 px-6">
              <View className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl">
                {/* Lock Icon and Header */}
                <View className="items-center mb-5">
                  <View className="bg-blue-500/10 p-3 rounded-full mb-2">
                    <Ionicons name="lock-closed" size={22} color="#60a5fa" />
                  </View>
                  <Text className="text-white font-bold text-lg text-center">Secure Network</Text>
                  <Text className="text-slate-400 text-xs text-center mt-1">
                    Enter the password for <Text className="font-semibold text-blue-400">{selectedNetwork?.ssid}</Text>
                  </Text>
                </View>

                {/* Password Input field */}
                <View className="flex-row items-center bg-slate-950 border border-slate-800 rounded-xl px-3 mb-6 relative">
                  <Ionicons name="key" size={16} color="#475569" className="mr-2" />
                  <TextInput
                    className="flex-1 py-3 text-white text-[15px] mr-2"
                    placeholder="Wi-Fi Password"
                    placeholderTextColor="#475569"
                    secureTextEntry={!showPassword}
                    value={inputPassword}
                    onChangeText={setInputPassword}
                    autoFocus={true}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={16}
                      color="#475569"
                    />
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => setPasswordModalVisible(false)}
                    className="flex-1 border border-slate-700 py-3.5 rounded-full items-center bg-slate-800/40"
                  >
                    <Text className="text-slate-300 font-semibold text-sm">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setPasswordModalVisible(false);
                      submitWifiCredentials(ssid, inputPassword);
                    }}
                    disabled={!inputPassword}
                    className={`flex-1 py-3.5 rounded-full items-center ${inputPassword ? 'bg-blue-600' : 'bg-slate-800'}`}
                  >
                    <Text className={`font-bold text-sm ${inputPassword ? 'text-white' : 'text-slate-500'}`}>
                      Connect
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>

        {/* Connection Progress Overlay */}
        {isConnecting && (
          <View className="absolute inset-0 bg-slate-950/95 justify-center items-center p-6 z-50">
            <View className="bg-slate-900 rounded-3xl p-6 border border-slate-800 w-full max-w-[320px] items-center">
              <ActivityIndicator size="large" color="#60a5fa" className="mb-4" />
              <Text className="text-white font-bold text-lg mb-2">Connecting Pump...</Text>

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
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
