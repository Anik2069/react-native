import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    ScrollView, 
    RefreshControl, 
    SafeAreaView, 
    ActivityIndicator, 
    Image, 
    Platform, 
    StatusBar 
} from 'react-native';
import axiosInstance from '@/lib/axios';
import * as SecureStore from "expo-secure-store";
import { Ionicons } from '@expo/vector-icons';

export default function History() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                const formData = new FormData();
                formData.append("token", token);

                const response = await axiosInstance.post("history_api.php", formData);
                console.log("History API Response:", response.data);

                if (response.data && response.data.status !== "error") {
                    let dataToSet = [];
                    if (response.data.data && Array.isArray(response.data.data.history)) {
                        dataToSet = response.data.data.history;
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        dataToSet = response.data.data;
                    } else if (response.data.history && Array.isArray(response.data.history)) {
                        dataToSet = response.data.history;
                    }

                    setHistoryData(dataToSet);
                } else {
                    console.error("Error fetching history:", response.data?.message);
                }
            }
        } catch (error) {
            console.error("Fetch History Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-50 justify-center items-center">
                <ActivityIndicator size="large" color="#0284c7" />
                <Text className="text-slate-500 font-semibold text-xs mt-3">Loading history...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-slate-100">
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
            
            {/* Header */}
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
                            style={{ width: 52, height: 52, borderRadius: 10, resizeMode: 'contain' }}
                        />
                    </View>
                    <View className="flex-1 justify-center">
                        <Text className="text-base font-extrabold text-slate-900 tracking-tight">
                            Usage History
                        </Text>
                        <Text className="text-xs font-semibold text-slate-500">
                            {historyData.length} total operations logged
                        </Text>
                    </View>
                </View>

                <View className="bg-sky-50 border border-sky-200 px-3 py-1 rounded-full flex-row items-center">
                    <Ionicons name="time" size={13} color="#0284c7" style={{ marginRight: 4 }} />
                    <Text className="text-xs font-bold text-sky-700">Logs</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4 pt-4"
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
                {historyData.length === 0 ? (
                    <View className="bg-white rounded-3xl p-8 border border-slate-200/80 items-center justify-center mt-8">
                        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
                            <Ionicons name="document-text-outline" size={32} color="#94a3b8" />
                        </View>
                        <Text className="text-base font-bold text-slate-700">No History Records</Text>
                        <Text className="text-xs text-slate-400 text-center mt-1 max-w-[200px]">
                            Pump start and stop history records will appear here automatically.
                        </Text>
                    </View>
                ) : (
                    historyData.map((item, index) => (
                        <View 
                            key={index} 
                            className="bg-white p-4 mb-3.5 rounded-2xl shadow-sm border border-slate-200/70"
                        >
                            {/* Card Header */}
                            <View className="flex-row justify-between items-center pb-3 border-b border-slate-100">
                                <View className="flex-row items-center">
                                    <View className="w-6 h-6 rounded-lg bg-sky-100 items-center justify-center mr-2">
                                        <Text className="text-[11px] font-extrabold text-sky-700">
                                            #{historyData.length - index}
                                        </Text>
                                    </View>
                                    <Text className="text-xs font-bold text-slate-700">Pump Cycle</Text>
                                </View>
                                
                                {item.duration ? (
                                    <View className="bg-slate-100 px-2.5 py-0.5 rounded-full flex-row items-center border border-slate-200">
                                        <Ionicons name="timer-outline" size={12} color="#64748b" style={{ marginRight: 3 }} />
                                        <Text className="text-[11px] font-semibold text-slate-600">
                                            {item.duration}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>

                            {/* Timestamps */}
                            <View className="py-3 flex-row justify-between">
                                <View className="flex-1 pr-2">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Started
                                        </Text>
                                    </View>
                                    <Text className="text-xs font-semibold text-slate-800 ml-3.5">
                                        {item.on_time || "N/A"}
                                    </Text>
                                </View>

                                <View className="w-[1px] bg-slate-100 mx-2" />

                                <View className="flex-1 pl-2">
                                    <View className="flex-row items-center mb-1">
                                        <View className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                            Stopped
                                        </Text>
                                    </View>
                                    <Text className="text-xs font-semibold text-slate-800 ml-3.5">
                                        {item.off_time || "N/A"}
                                    </Text>
                                </View>
                            </View>

                            {/* Cost Pill Footer */}
                            <View className="pt-2.5 border-t border-slate-100 flex-row justify-between items-center">
                                <Text className="text-[11px] font-medium text-slate-500">Electricity Cost</Text>
                                <View className="bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                                    <Text className="text-xs font-extrabold text-emerald-700">
                                        {item.cost ? `${item.cost} BDT` : "0.00 BDT"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}