import React from 'react'
import { Text, View } from 'react-native'

function MeterSensor({ meterData }) {
    return (
        <View
            className={`flex flex-row items-center justify-between mb-2 rounded-lg shadow-md p-4`}
            style={{ backgroundColor: meterData.Bgcolor }}
        >
            {/* Left Section - Key */}
            <View className="flex-1">
                <Text className=" text-lg font-bold"  style={{ color: meterData.Textcolor }}>{meterData.Key}</Text>
            </View>

            {/* Right Section - Value */}
            <View className="flex-1 items-end">
                <Text className="text-white text-lg font-bold">
                    {meterData.Value === 0 ? 'Full' : 'Low'}
                </Text>
            </View>
        </View>
    )
}

export default MeterSensor