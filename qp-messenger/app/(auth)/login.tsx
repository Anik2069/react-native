import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Checkbox from 'expo-checkbox';

export default function Login() {
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  return (
    <SafeAreaView className="flex-1 bg-white">
     
      <ScrollView contentContainerClassName="justify-center flex-grow px-6 py-10">
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-[#2D7A78] items-center justify-center mb-4">
            <View className="w-12 h-6 bg-[#2D7A78]">
              <View className="items-center justify-center w-full h-full">
                <View className="w-10 h-2 transform bg-white rounded-full rotate-12" />
              </View>
            </View>
          </View>
          <Text className="text-3xl font-bold text-center">Quantum</Text>
          <Text className="mb-10 text-3xl font-bold text-center">Possibilities messenger</Text>
        </View>

        <View className="gap-4 mb-6 space-y-4">
          <TextInput
            className="w-full px-4 text-base bg-gray-100 rounded-lg h-14"
            placeholder="Phone number or email"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            className="w-full px-4 text-base bg-gray-100 rounded-lg h-14"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View className="flex-row items-center mb-6">
          {/* <Checkbox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#2D7A78' : undefined}
            className="w-6 h-6 mr-3 rounded"
          /> */}
          <Text className="text-base">Save login info</Text>
        </View>

        <View className="gap-3 space-y-4">
          <TouchableOpacity
            className="w-full h-14 bg-[#2D7A78] rounded-full items-center justify-center"
          // onPress={handleLogin}
          >
            <Text className="text-lg font-medium text-white">Log in</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center justify-center w-full bg-gray-800 rounded-full h-14">
            <Text className="text-lg font-medium text-white">Create New Account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity className="self-center mt-8">
          <Text className="text-[#2D7A78] text-base font-medium">Forgot password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}