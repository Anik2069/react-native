import { icons } from '@/app/constants'
import { formatDate, formatTime } from '@/lib/utils'
import { Ride } from '@/types/type'
import React from 'react'
import { Image, Text, View } from 'react-native'

function RideCard({ ride:
    {
        destination_address, destination_latitude, destination_longitude, origin_address, created_at, ride_time, driver, payment_status
    } }: { ride: Ride }) {
    return (
        <View className='flex flex-row items-center justify-center bg-white rounded-lg shadow-sm shadow-neutral-300 mb-3'>
            <View className='flex flex-col items-center justify-center p-3'>
                <View className='flex flex-row items-center justify-between'>
                    <Image source={{ uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}` }} className='w-[80px] h-[90px] rounded-lg' />
                    <View className='flex flex-col mx-5 gap-y-5 flex-1'>
                        <View className='flex flex-row mx-5 gap-x-2 items-center'>
                            <Image source={icons.to} className='w-5 h-5' />
                            <Text className='text-md' numberOfLines={1}>{origin_address}</Text>
                        </View>
                        <View className='flex flex-row mx-5 gap-x-2 items-center'>
                            <Image source={icons.point} className='w-5 h-5' />
                            <Text className='text-md' numberOfLines={1}>{destination_address}</Text>
                        </View>
                    </View>

                </View>
                <View className='flex flex-col w-full mt-5 rounded-lg'>
                    <View className='flex flex-row items-center w-full justify-between mb-5'>
                        <Text className='text-md text-gray-500 font-medium'>Date & time</Text>
                        <Text className='text-md text-gray-500 font-medium'>{formatDate(created_at)},{formatTime(ride_time)}</Text>
                    </View>
                    <View className='flex flex-row items-center w-full justify-between mb-5'>
                        <Text className='text-md text-gray-500 font-medium'>Driver</Text>
                        <Text className='text-md text-gray-500 font-medium'>{driver.first_name} {driver.last_name}</Text>
                    </View>

                    <View className='flex flex-row items-center w-full justify-between mb-5'>
                        <Text className='text-md text-gray-500 font-medium'>Seat</Text>
                        <Text className='text-md text-gray-500 font-medium'>{driver.car_seats} </Text>
                    </View>

                    <View className='flex flex-row items-center w-full justify-between mb-5'>
                        <Text className='text-md text-gray-500 font-medium'>Payment Status</Text>
                        <Text className={`text-md capitalize text-gray-500 font-medium ${payment_status == "paid" ? 'text-green-500' : 'text-red-500'} `} >{payment_status} </Text>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default RideCard