import React from 'react'
import { Text, View } from 'react-native'

export default function Badge({ status }) {
    return (
        <View className={` ${status == 1 ? 'bg-green-700' : 'bg-red-500'} rounded-lg p-2 `}>
            <Text className='text-white font-bold'>{status == 1 ? "On" : "Off"}</Text>
        </View>
    )
}
