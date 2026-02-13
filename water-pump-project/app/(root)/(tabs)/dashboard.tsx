import MeterSensor from '@/components/MeterSensor'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';
import axiosInstance from '@/lib/axios';
import Badge from '@/components/Badge';
import WaterTank from '@/components/WaterTank';

function dashboard() {
    const router = useRouter();
    const [responseData, setResponseData] = useState<any>({});
    const intervalRef = useRef<number | null>(null);

    const handleLogout = () => {
        SecureStore.setItemAsync("token", "");
        router.push("/(auth)/sign-in");
    }

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchData();
        }, 2000);

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);


    const [refreshing, setRefreshing] = useState(false);

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

                // Remove manual Content-Type header to allow Axios to set the boundary correctly
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
    // console.log(responseData,"responseDataresponseData");

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
                    <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        Motor Statistics
                    </Text>
                    <View className="flex flex-row justify-center items-center gap-4">
                        {/* Motor Last On Time */}
                        <View className="flex-1 bg-blue-100 p-3 rounded-lg justify-center items-center">
                            <Text className="text-sm font-medium text-gray-700 text-center">
                                Motor Last On Time
                            </Text>
                            <Text className="text-lg font-bold text-blue-600 text-center">
                                {responseData?.motor_last_on_time || '--'}
                            </Text>
                        </View>
                        {/* Last 24 Hour Total On Time */}
                        <View className="flex-1 bg-green-100 p-3 rounded-lg justify-center items-center">
                            <Text className="text-sm font-medium text-gray-700 text-center">
                                Last 24 Hour Total On Time
                            </Text>
                            <Text className="text-lg font-bold text-green-600 text-center">
                                {responseData?.last_24_hour_total_on_time || '--'}
                            </Text>
                        </View>
                        {/* Average On Time */}
                        <View className="flex-1 bg-yellow-100 p-3 rounded-lg justify-center items-center">
                            <Text className="text-sm font-medium text-gray-700 text-center">
                                Average On Time
                            </Text>
                            <Text className="text-lg font-bold text-yellow-600 text-center">
                                {responseData?.average_on_time || '--'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View className="p-2 m-2 bg-white flex flex-row  justify-between rounded-md">
                    <View className="flex-row items-center">
                        <Text>Meter Status: </Text>
                        <Badge status={responseData?.MotorStatus?.Value} />
                    </View>
                    <View className="ml-4">
                        <Switch
                            trackColor={{ false: '#767577', true: '#33ff8f' }}
                            thumbColor={isEnabled ? '#79ff33' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>


                <View className='p-2 m-2 rounded-lg bg-white justify-center items-center'>
                    <Text className="text-lg font-semibold text-gray-800 mb-4 text-center">
                        Water Level
                    </Text>
                    <View style={styles.tankContainer}>
                        {
                            responseData.sensor_data &&
                            <WaterTank percentage={responseData.sensor_data} />
                        }

                    </View>

                    {/* {
                        responseData?.MeterInfo && responseData?.MeterInfo.map((meterData) => (
                            <MeterSensor meterData={meterData} />
                        ))
                    } */}



                </View>

                <View className="mb-6 items-center">
                    <Text className="text-gray-500 text-sm font-medium">
                        Last Communication: {responseData?.last_comunication_time || "N/A"}
                    </Text>
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