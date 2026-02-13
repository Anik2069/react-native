import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, SafeAreaView, ActivityIndicator } from 'react-native';
import axiosInstance from '@/lib/axios';
import * as SecureStore from "expo-secure-store";

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
                    // Check if response.data.data is the array, OR if response.data itself is the array or contains the data in another way
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
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="p-4"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            >
                <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">Pump Usage History</Text>

                {historyData.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-10">No history data available.</Text>
                ) : (
                    historyData.map((item, index) => (
                        <View key={index} className="bg-white p-4 mb-4 rounded-lg shadow-sm border border-gray-100">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600 font-semibold">Start Time:</Text>
                                <Text className="text-gray-800">{item.on_time || "N/A"}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600 font-semibold">End Time:</Text>
                                <Text className="text-gray-800">{item.off_time || "N/A"}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-gray-600 font-semibold">Duration:</Text>
                                <Text className="text-gray-800 font-medium">{item.duration || "N/A"}</Text>
                            </View>
                            <View className="flex-row justify-between border-t border-gray-100 pt-2 mt-2">
                                <Text className="text-gray-600 font-semibold">Cost:</Text>
                                <Text className="text-green-600 font-bold">{item.cost ? `${item.cost} BDT` : "N/A"}</Text>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}