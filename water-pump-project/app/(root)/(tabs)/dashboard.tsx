import MeterSensor from '@/components/MeterSensor'
import React, { useEffect, useRef, useState } from 'react'
import { 
    Alert, 
    Image, 
    Platform,
    RefreshControl, 
    SafeAreaView, 
    ScrollView, 
    StatusBar,
    StyleSheet, 
    Switch, 
    Text, 
    TouchableOpacity, 
    View 
} from 'react-native'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import axiosInstance from '@/lib/axios';
import Badge from '@/components/Badge';
import WaterTank from '@/components/WaterTank';
import { findDeviceId, findUserName } from '@/lib/deviceHelper';
import { Ionicons } from '@expo/vector-icons';

function dashboard() {
    const router = useRouter();
    const [responseData, setResponseData] = useState<any>({});
    const [userName, setUserName] = useState<string>('');
    const [deviceId, setDeviceId] = useState<string>('');
    const [isEnabled, setIsEnabled] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const intervalRef = useRef<any>(null);

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out of your session?",
            [
                { text: "Cancel", style: "cancel" },
                { 
                    text: "Log Out", 
                    style: "destructive", 
                    onPress: async () => {
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                        }
                        await SecureStore.setItemAsync("token", "");
                        await SecureStore.setItemAsync("userName", "");
                        await SecureStore.setItemAsync("deviceId", "");
                        router.push("/(auth)/sign-in");
                    }
                }
            ]
        );
    };

    useEffect(() => {
        // Load username and device ID from SecureStore
        const loadUserData = async () => {
            const storedName = await SecureStore.getItemAsync("userName");
            if (storedName) setUserName(storedName);
            const storedDeviceId = await SecureStore.getItemAsync("deviceId");
            if (storedDeviceId) setDeviceId(storedDeviceId);
        };
        loadUserData();

        // Fetch immediately on mount
        fetchData();

        intervalRef.current = setInterval(() => {
            fetchData();
        }, 2000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const fetchData = async () => {
        console.log("Fetching data...");
        try {
            const token = await SecureStore.getItemAsync("token");

            if (token) {
                const tempFormData = new FormData();
                tempFormData.append("token", token);

                axiosInstance.post("/mqtt/fetch_api_mqtt.php", tempFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((response) => {
                    if (response.data && response.data.status != "error") {
                        const rawData = response.data.data || response.data;
                        setResponseData(rawData);
                        console.log("Fetch API response keys:", Object.keys(response.data));

                        // Sync pump switch state with motor status
                        if (rawData?.MotorStatus?.Value !== undefined) {
                            const val = rawData.MotorStatus.Value;
                            setIsEnabled(val == 1 || val === 'ON' || val === '1');
                        }

                        // Find device ID from anywhere in response
                        const foundDeviceId = findDeviceId(response.data);
                        if (foundDeviceId) {
                            setDeviceId(foundDeviceId);
                            SecureStore.setItemAsync("deviceId", foundDeviceId);
                        }

                        // Find user name from response if available
                        const foundUser = findUserName(response.data);
                        if (foundUser) {
                            setUserName(foundUser);
                            SecureStore.setItemAsync("userName", foundUser);
                        }
                    } else {
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                        }
                        router.push("/(auth)/sign-in")
                    }
                })
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
        }
    };

    const toggleSwitch = async () => {
        const previousState = isEnabled;
        const newState = !previousState;
        setIsEnabled(newState); // Optimistic update

        try {
            const token = await SecureStore.getItemAsync("token");

            if (token) {
                const tempFormData = new FormData();
                tempFormData.append("token", token);
                tempFormData.append("status", newState ? "ON" : "OFF");
                console.log(`Sending Pump Control: ${newState ? "ON" : "OFF"}`);

                const response = await axiosInstance.post("pump_control_api.php", tempFormData);
                console.log("Pump Control Response:", response.data);

                if (response.data.status === "error") {
                    alert("Failed: " + (response.data.message || "Unknown error"));
                    setIsEnabled(previousState); // Revert
                }
            } else {
                console.error("No token found");
                setIsEnabled(previousState);
            }
        } catch (error) {
            console.error("Pump Control Error:", error);
            alert("Failed to connect to pump controller.");
            setIsEnabled(previousState); // Revert
        }
    };

    const isPumpRunning = isEnabled || responseData?.MotorStatus?.Value == 1 || responseData?.MotorStatus?.Value === 'ON';
    const effectiveUserName = userName || findUserName(responseData) || 'User';
    const effectiveDeviceId = deviceId || findDeviceId(responseData) || 'N/A';

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            
            {/* Top Navigation Bar with Status Bar Clearance */}
            <View 
                style={{
                    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 8 : 34) : 8,
                }}
                className="bg-white px-4 pb-3 border-b border-slate-200/80 flex-row justify-between items-center shadow-sm"
            >
                <View className="flex-row items-center flex-1 mr-2">
                    <View className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm mr-3">
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{ width: 62, height: 62, borderRadius: 12, resizeMode: 'contain' }}
                        />
                    </View>
                    <View className="flex-1 justify-center">
                        <Text className="text-base font-extrabold text-slate-900 tracking-tight" numberOfLines={1}>
                            Smart Pump Controller
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                            <Text className="text-xs font-semibold text-slate-500">
                                Live System Active
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Logout Action Button */}
                <TouchableOpacity
                    onPress={handleLogout}
                    activeOpacity={0.7}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 active:bg-rose-50 active:border-rose-200 ml-1"
                >
                    <Ionicons name="log-out-outline" size={20} color="#f43f5e" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 150 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={handleRefresh} 
                        colors={["#0284c7"]} 
                        tintColor="#0284c7"
                    />
                }
            >
                {/* User & Device Identity Card */}
                <View className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-slate-200/70 shadow-sm flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1 mr-3">
                        <View className="bg-gradient-to-tr bg-blue-600 w-11 h-11 rounded-2xl items-center justify-center mr-3 shadow-md shadow-blue-200">
                            <Text className="text-white font-extrabold text-lg">
                                {effectiveUserName.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Account</Text>
                            <Text className="text-sm font-bold text-slate-800" numberOfLines={1}>
                                {effectiveUserName}
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <View className="bg-slate-100 px-2 py-0.5 rounded-md flex-row items-center border border-slate-200">
                                    <Ionicons name="hardware-chip-outline" size={11} color="#64748b" style={{ marginRight: 3 }} />
                                    <Text className="text-[11px] font-mono font-semibold text-slate-600">
                                        ID: {effectiveDeviceId}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Online Status Pill */}
                    <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                        <Text className="text-[11px] font-bold text-emerald-700">Online</Text>
                    </View>
                </View>

                {/* Pump Control Hero Card */}
                <View 
                    className={`mx-4 mt-4 rounded-3xl p-5 border shadow-md transition-all ${
                        isPumpRunning 
                            ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/20' 
                            : 'bg-white border-slate-200/80 shadow-slate-200/50'
                    }`}
                >
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-row items-center">
                            <View 
                                className={`w-12 h-12 rounded-2xl items-center justify-center mr-3 ${
                                    isPumpRunning ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-slate-100 border border-slate-200'
                                }`}
                            >
                                <Ionicons 
                                    name="power" 
                                    size={24} 
                                    color={isPumpRunning ? '#34d399' : '#64748b'} 
                                />
                            </View>
                            <View>
                                <Text className={`text-base font-extrabold ${isPumpRunning ? 'text-white' : 'text-slate-800'}`}>
                                    Pump Remote Control
                                </Text>
                                <Text className={`text-xs mt-0.5 ${isPumpRunning ? 'text-emerald-400' : 'text-slate-500'}`}>
                                    {isPumpRunning ? 'Motor Active & Pumping' : 'Pump is currently on Standby'}
                                </Text>
                            </View>
                        </View>

                        <Badge status={responseData?.MotorStatus?.Value} />
                    </View>

                    {/* Divider & Switch Control Row */}
                    <View 
                        className={`pt-3 flex-row justify-between items-center border-t ${
                            isPumpRunning ? 'border-slate-800' : 'border-slate-100'
                        }`}
                    >
                        <View>
                            <Text className={`text-xs font-bold uppercase tracking-wider ${isPumpRunning ? 'text-slate-400' : 'text-slate-400'}`}>
                                Power Switch
                            </Text>
                            <Text className={`text-sm font-semibold mt-0.5 ${isPumpRunning ? 'text-emerald-300' : 'text-slate-700'}`}>
                                {isEnabled ? 'Turned ON' : 'Turned OFF'}
                            </Text>
                        </View>

                        <Switch
                            trackColor={{ false: '#cbd5e1', true: '#10b981' }}
                            thumbColor={isEnabled ? '#ffffff' : '#f8fafc'}
                            ios_backgroundColor="#cbd5e1"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>

                {/* Water Reservoir Section */}
                <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm items-center">
                    <View className="w-full flex-row justify-between items-center mb-3">
                        <View className="flex-row items-center">
                            <Ionicons name="water-outline" size={18} color="#0284c7" style={{ marginRight: 6 }} />
                            <Text className="text-base font-extrabold text-slate-800">
                                Water Reservoir
                            </Text>
                        </View>
                        <View className="bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                            <Text className="text-[11px] font-bold text-sky-700">Tank Sensor</Text>
                        </View>
                    </View>

                    <View style={styles.tankContainer}>
                        <WaterTank percentage={responseData.sensor_data ?? 0} />
                    </View>
                </View>

                {/* Motor Telemetry Statistics */}
                <View className="mx-4 mt-4 bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm">
                    <View className="flex-row items-center mb-3 ml-1">
                        <Ionicons name="pulse-outline" size={16} color="#475569" style={{ marginRight: 6 }} />
                        <Text className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Motor Operation Telemetry
                        </Text>
                    </View>

                    <View className="flex-row justify-between gap-2.5">
                        {/* Stat 1: Last Run */}
                        <View className="flex-1 bg-sky-50/70 border border-sky-100 p-3 rounded-2xl items-center">
                            <View className="w-7 h-7 rounded-full bg-sky-100 items-center justify-center mb-1.5">
                                <Ionicons name="time-outline" size={15} color="#0284c7" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">
                                Last Run
                            </Text>
                            <Text className="text-sm font-extrabold text-sky-700 text-center mt-1" numberOfLines={1}>
                                {responseData?.motor_last_on_time || '--'}
                            </Text>
                        </View>

                        {/* Stat 2: 24h Total */}
                        <View className="flex-1 bg-emerald-50/70 border border-emerald-100 p-3 rounded-2xl items-center">
                            <View className="w-7 h-7 rounded-full bg-emerald-100 items-center justify-center mb-1.5">
                                <Ionicons name="flash-outline" size={15} color="#059669" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">
                                24h Total
                            </Text>
                            <Text className="text-sm font-extrabold text-emerald-700 text-center mt-1" numberOfLines={1}>
                                {responseData?.last_24_hour_total_on_time || '--'}
                            </Text>
                        </View>

                        {/* Stat 3: Average */}
                        <View className="flex-1 bg-amber-50/70 border border-amber-100 p-3 rounded-2xl items-center">
                            <View className="w-7 h-7 rounded-full bg-amber-100 items-center justify-center mb-1.5">
                                <Ionicons name="speedometer-outline" size={15} color="#d97706" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-500 text-center uppercase tracking-wide">
                                Average
                            </Text>
                            <Text className="text-sm font-extrabold text-amber-700 text-center mt-1" numberOfLines={1}>
                                {responseData?.average_on_time || '--'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Last Communication Time Pill */}
                <View className="my-5 items-center">
                    <View className="flex-row items-center bg-slate-200/80 px-4 py-2 rounded-full border border-slate-300/60">
                        <Ionicons name="sync-outline" size={13} color="#64748b" style={{ marginRight: 6 }} />
                        <Text className="text-slate-600 text-xs font-semibold">
                            Last Communication: {responseData?.last_comunication_time || "Connected"}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    tankContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default dashboard;