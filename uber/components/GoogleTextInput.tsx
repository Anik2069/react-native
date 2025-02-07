import { GoogleInputProps } from '@/types/type'
import React from 'react'
import { Text, View } from 'react-native'

function GoogleTextInput({ icon, initialLocation, containerStyle, handlePress }: GoogleInputProps) {
    return (
        <View className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-5`} >
            
            <Text>Search</Text>
        </ View>
    )
}

export default GoogleTextInput