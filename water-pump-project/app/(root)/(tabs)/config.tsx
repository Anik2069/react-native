import React, { useEffect, useState, useCallback } from 'react';
import { Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import axiosInstance from '@/lib/axios';
import PumpConfigForm from '@/components/PumpConfigForm';

export default function Config() {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    const handleLogout = () => {
        SecureStore.setItemAsync("token", "");
        router.push("/(auth)/sign-in");
    }

    const fetchConfigData = useCallback(async () => {
        console.log("Fetching data...Config Page");
        try {
            const token = await SecureStore.getItemAsync("token");
            if (token) {
                const formData = new FormData();
                formData.append("token", token);

                const response = await axiosInstance.post("fetch_config_api.php", formData);
                console.log("Config Page Data:", response.data);

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

    return (
        <SafeAreaView className='h-full flex-1 bg-gray-50'>
            <ScrollView
                className="h-full pt-10"
                contentContainerStyle={{ paddingBottom: 150 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View className="flex flex-row justify-between items-center shadow-lg bg-white p-4 rounded-lg mb-4">
                    {/* Left - Logo */}
                    <View className="flex items-center">
                        <Image
                            source={require('@/assets/images/logo.jpg')}
                            className="w-[80px] h-[80px] rounded-lg"
                        />
                    </View>

                    {/* Center - Title */}
                    <View className="flex-1 items-center">
                        <Text className="text-xl font-semibold text-gray-800">Smart Pump Controller</Text>
                    </View>

                    {/* Right - Logout Button */}
                    <View className="flex items-center">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center p-2 rounded-md bg-red-500 hover:bg-red-400 transition-all duration-200"
                        >
                            <Text className="text-white font-medium">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Form Section */}
                <View className="bg-white rounded-lg shadow-lg p-2 m-2">
                    <PumpConfigForm onUpdate={fetchConfigData} />
                </View>

                {/* Display Fetched Data Section (Current Config) */}
                <View className="m-2 mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <Text className="text-lg font-bold text-gray-800 mb-4 text-center">Current Configuration</Text>
                    {fetchedData && fetchedData.data ? (
                        <View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Pump Height:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.tank_height || "--"} cm</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Pump Gap:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.top_gap || "--"} cm</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Pump Start Level:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.p_start || "--"}%</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Pump Stop Level:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.p_stop || "--"}%</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Timer:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.timer || "--"} sec</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Unit Cost:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.unit_cost || "--"} BDT</Text>
                            </View>
                            <View className="flex-row items-center py-2 border-b border-gray-100 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Auto Mode:</Text>
                                <Text className={`font-medium pl-8 ${fetchedData.data.auto_mode == '1' ? 'text-green-600' : 'text-gray-800'}`}>
                                    {fetchedData.data.auto_mode == '1' ? "ON" : "OFF"}
                                </Text>
                            </View>
                            <View className="flex-row items-center py-2 pt-4 mt-2 pr-4">
                                <Text className="text-gray-600 w-40 pl-4">Last Updated:</Text>
                                <Text className="font-medium text-gray-800 pl-8">{fetchedData.data.updated_at || "--"}</Text>
                            </View>
                        </View>
                    ) : (
                        <Text className="text-gray-500 italic text-center">Loading current config...</Text>
                    )}
                </View>

            </ScrollView>
        </SafeAreaView >
    )
}