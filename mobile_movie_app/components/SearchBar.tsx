import { icons } from '@/constants/icons'
import React from 'react'
import { Image, Text, View } from 'react-native'

function SearchBar() {
    return (
        <View className='flex-row items-center bg-dard-200 rounded-full px-5 py-4'>
            <Image source={icons.search} className='size-5' resizeMode="contain" tintColor="#ab8bff" />
            <Text className='text-white'>SearchBar</Text>
        </View>
    )
}

export default SearchBar