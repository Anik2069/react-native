import React from 'react'
import { Image, Text, View } from 'react-native'
import CustomButton from './CustomButton'
import { icons } from '@/app/constants'

function OAuth() {
    //handleGoogleSignIn
    const handleGoogleSignIn = () => {
        console.log("Google Sign In")
    }
    return (
        <View>
            <View className='flex flex-row items-start justify-center mt-4 gap-x-3'>
                <View className='flex-1 h-[1px] bg-gray-100' />
                <Text className="text-lg">or</Text>
                <View className='flex-1 h-[1px] bg-gray-100' />
            </View>

            <CustomButton title="Log In with Google" className="w-full mt-5 shadow-none"
                IconLeft={() => {
                    return (
                        <Image source={icons.google} className="w-5 h-5 mx-2" resizeMode="contain" />
                    )
                }}
                bgVariant="outline"
                textVariant="secondary"
                onPress={handleGoogleSignIn}
            />

        </View>
    )
}

export default OAuth
