import React, { useEffect, useState, useCallback } from 'react';
import { 
    Alert, 
    Image, 
    RefreshControl, 
    SafeAreaView, 
    ScrollView, 
    Text, 
    TouchableOpacity, 
    View, 
    Platform, 
    StatusBar 
} from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import axiosInstance from '@/lib/axios';
import PumpConfigForm from '@/components/PumpConfigForm';
import { Ionicons } from '@expo/vector-icons';

export default function Config() {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

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
                        await SecureStore.setItemAsync("token", "");
                        await SecureStore.setItemAsync("userName", "");
                        await SecureStore.setItemAsync("deviceId", "");
                        router.push("/(auth)/sign-in");
                    }
                }
            ]
        );
    };

    const fetchConfigData = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                const formData = new FormData();
                formData.append("token", token);

                const response = await axiosInstance.post("fetch_config_api.php", formData);

                if (response.data && response.data.status !== "error") {
                    setFetchedData(response.data);
                }
            }
        } catch (error) {
            console.error("Error fetching config:", error);
        }
    }, []);

    useEffect(() => {
        fetchConfigData();
    }, [fetchConfigData]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchConfigData();
        setRefreshing(false);
    };

    const configItems = fetchedData?.data ? [
        { label: "Tank Height", val: fetchedData.data.tank_height != null ? String(fetchedData.data.tank_height) : "--", unit: "cm", icon: "resize-outline", color: "#0284c7" },
        { label: "Sensor Top Gap", val: fetchedData.data.top_gap != null ? String(fetchedData.data.top_gap) : "--", unit: "cm", icon: "arrow-down-outline", color: "#6366f1" },
        { label: "Start Trigger (ON)", val: fetchedData.data.p_start != null ? String(fetchedData.data.p_start) : "--", unit: "%", icon: "play", color: "#10b981" },
        { label: "Stop Trigger (OFF)", val: fetchedData.data.p_stop != null ? String(fetchedData.data.p_stop) : "--", unit: "%", icon: "stop", color: "#f43f5e" },
        { label: "Safety Run Timer", val: fetchedData.data.timer != null ? String(fetchedData.data.timer) : "--", unit: "sec", icon: "time-outline", color: "#f59e0b" },
        { label: "Electricity Rate", val: fetchedData.data.unit_cost != null ? String(fetchedData.data.unit_cost) : "--", unit: "BDT", icon: "flash-outline", color: "#059669" },
    ] : [];

    const isAutoOn = fetchedData?.data?.auto_mode === '1' || fetchedData?.data?.auto_mode === 1;

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
                            <View className="w-2 h-2 rounded-full bg-sky-500 mr-1.5" />
                            <Text className="text-xs font-semibold text-slate-500">
                                Configuration & Limits
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
                {/* 1. Main Form Card */}
                <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
                    <View className="flex-row items-center mb-4">
                        <View className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 items-center justify-center mr-3">
                            <Ionicons name="options-outline" size={20} color="#0284c7" />
                        </View>
                        <View>
                            <Text className="text-base font-extrabold text-slate-800">
                                Controller Parameters
                            </Text>
                            <Text className="text-xs text-slate-400">
                                Configure thresholds and operating limits
                            </Text>
                        </View>
                    </View>

                    <PumpConfigForm onUpdate={fetchConfigData} />
                </View>

                {/* 2. Active Profile / Saved Configuration Summary */}
                <View className="mx-4 mt-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center flex-1 mr-2">
                            <View className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 items-center justify-center mr-3">
                                <Ionicons name="hardware-chip-outline" size={19} color="#475569" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-extrabold text-slate-800">
                                    Current Active Profile
                                </Text>
                                <Text className="text-xs text-slate-400">
                                    Live settings currently on hardware
                                </Text>
                            </View>
                        </View>

                        {fetchedData?.data?.auto_mode !== undefined && (
                            <View className={`px-2.5 py-1 rounded-full border ${
                                isAutoOn 
                                    ? 'bg-emerald-50 border-emerald-300' 
                                    : 'bg-slate-100 border-slate-200'
                            }`}>
                                <Text className={`text-[11px] font-extrabold ${
                                    isAutoOn ? 'text-emerald-700' : 'text-slate-600'
                                }`}>
                                    {isAutoOn ? "Auto Mode: ON" : "Auto Mode: OFF"}
                                </Text>
                            </View>
                        )}
                    </View>

                    {fetchedData && fetchedData.data ? (
                        <View>
                            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden divide-y divide-slate-100">
                                {configItems.map((item, idx) => (
                                    <View 
                                        key={idx} 
                                        className="flex-row items-center justify-between px-3.5 py-3 bg-white"
                                    >
                                        <View className="flex-row items-center flex-1 mr-3">
                                            <View 
                                                style={{ backgroundColor: `${item.color}15` }} 
                                                className="w-8 h-8 rounded-xl items-center justify-center mr-3"
                                            >
                                                <Ionicons name={item.icon as any} size={15} color={item.color} />
                                            </View>
                                            <Text className="text-xs font-bold text-slate-700" numberOfLines={1}>
                                                {item.label}
                                            </Text>
                                        </View>

                                        <View className="flex-row items-center justify-end">
                                            <Text className="text-sm font-extrabold text-slate-900 font-mono tracking-tight">
                                                {item.val}
                                            </Text>
                                            <View className="ml-2 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 min-w-[34px] items-center">
                                                <Text className="text-[10px] font-bold text-slate-500 uppercase">
                                                    {item.unit}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            {fetchedData.data.updated_at && (
                                <View className="pt-3.5 items-center flex-row justify-center">
                                    <Ionicons name="cloud-done-outline" size={13} color="#94a3b8" style={{ marginRight: 4 }} />
                                    <Text className="text-[11px] font-semibold text-slate-400">
                                        Last Updated: {fetchedData.data.updated_at}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ) : (
                        <View className="py-6 items-center">
                            <Text className="text-xs text-slate-400 italic">No saved profile found or loading...</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}