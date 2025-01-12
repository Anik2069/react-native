import React from 'react'
import { Text, View } from 'react-native'

function MeterSensor({ bgColor = "bg-red-400" }) {
    return (
        <View className={`flex flex-row ${bgColor} justify-between mt-2`}>
            <View className='p-5 '>
                <Text className='text-white font-bold'>Low Sensor</Text>
            </View>
            <View className='p-5 '>
                <Text className='text-white font-bold'>Low</Text>
            </View>
        </View>
    )
}

export default MeterSensor