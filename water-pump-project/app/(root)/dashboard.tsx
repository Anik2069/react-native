import MeterSensor from '@/components/MeterSensor'
import React from 'react'
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';

function dashboard() {
    const router = useRouter();
    const handleLogout = () => {
        console.log("log")
        SecureStore.setItemAsync("token", "");
        router.push("/(auth)/sign-in");
    }
    return (
        <SafeAreaView className='h-full '>
            <View className='flex flex-row    text-center justify-center items-center shadow-md bg-white '>
                <View className='mt-[5px]' >
                    <Image source={require('@/assets/images/logo.jpg')} className='w-[80px] h-[80px] rounded-lg' />
                </View>
                <View className='p-5 justify-center'>
                    <Text>Water Pump Project</Text>
                </View>
                <View className='p-5 justify-end items-end '>

                    <TouchableOpacity onPress={handleLogout}>
                        <Text>Logout</Text>
                    </TouchableOpacity>

                </View>

            </View>
            <View>
                <Text>You are logged in</Text>
            </View>
            <MeterSensor />
            <MeterSensor />
            <MeterSensor />
            <MeterSensor bgColor="bg-green-500" />
        </SafeAreaView>

    )
}

export default dashboard