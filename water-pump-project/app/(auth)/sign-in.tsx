import React from 'react'
import { Button, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'

function signIn() {
  return (
    <View className='bg-white h-full p-2'>
      <View className='flex flex-col p-5 pt-10 h-[40%] text-center justify-center items-center '>
        <View>
          <Image source={require('@/assets/images/logo.jpg')} />
        </View>

        <View>
          <Text>Welcome Back to WPP</Text>
        </View>

      </View>
      <View className=''>
        <Text className=''>Email</Text>
        <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500`}>
          <TextInput className='w-full shadow-gray-50 rounded-full p-4 text-[15px] flex-2 ' />
        </View>
        <Text>Password</Text>
        <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500`}>
          <TextInput className='w-full shadow-gray-50 rounded-full p-4 text-[15px] flex-2 ' />
        </View>
        <View className='mt-4 rounded-md '>
          <TouchableOpacity className={`w-full rounded-full p-2 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 bg-blue-600`}>

            <Text className={`text-lg font-bold text-white `}> Login</Text>

          </TouchableOpacity>
        </View>

      </View>

    </View>
  )
}

export default signIn