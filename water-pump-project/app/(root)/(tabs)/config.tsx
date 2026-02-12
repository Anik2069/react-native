import MeterSensor from '@/components/MeterSensor'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import axiosInstance from '@/lib/axios';
import Badge from '@/components/Badge';
import WaterTank from '@/components/WaterTank';
import PumpConfigForm from '@/components/PumpConfigForm';

function dashboard() {
    const router = useRouter();
    const [responseData, setResponseData] = useState([]);
    const intervalRef = useRef<number | null>(null);

    const handleLogout = () => {
        SecureStore.setItemAsync("token", "");
        router.push("/(auth)/sign-in");
    }


    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };


    const fetchData = async () => {
        console.log("Fetching data...Config");
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
                    if (response.data.status != "error") {

                        // setWaterLevel(response.data.data.MeterInfo[0].Value)
                        setResponseData(response.data.data);
                    } else {
                        if (intervalRef.current !== null) {
                            clearInterval(intervalRef.current);
                        }
                        router.push("/(auth)/sign-in")
                    }


                })

                // axiosInstance.post("/fetch_api.php", tempFormData, {
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     }
                // }).then((response) => {

                //     setResponseData(response.data.data);
                // })
            }
        } catch (error) {
            console.error("Error retrieving token:", error);
        }
    };
    const [isEnabled, setIsEnabled] = useState(false);

    return (
        <SafeAreaView className='h-full '>
            <ScrollView
                className="h-full"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <View className="flex flex-row justify-between items-center shadow-lg bg-white p-4 rounded-lg">
                    {/* Left - Logo */}
                    <View className="flex items-center">
                        <Image
                            source={require('@/assets/images/logo.jpg')}
                            className="w-[80px] h-[80px] rounded-lg"
                        />
                    </View>

                    {/* Center - Title */}
                    <View className="flex-1 items-center">
                        <Text className="text-xl font-semibold text-gray-800">Water Pump Project</Text>
                    </View>

                    {/* Right - Logout Button */}
                    <View className="flex items-center">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="flex-row items-center p-2 rounded-md bg-red-500 hover:bg-red-400 transition-all duration-200"
                        >
                            {/* <Ionicons name="log-out" size={20} color="white" className="mr-2" /> */}
                            <Text className="text-white font-medium">Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    {/* <Text>You are logged in</Text> */}
                </View>

                <View className="bg-white rounded-lg shadow-lg p-2 m-2">
                    <PumpConfigForm />
                </View>

            </ScrollView>
        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 30,
    },
    tankContainer: {
        marginBottom: 40,
    },
    controls: {
        width: "100%",
        alignItems: "center",
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    slider: {
        width: "80%",
        height: 40,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "80%",
        marginTop: 20,
    },
})
export default dashboard