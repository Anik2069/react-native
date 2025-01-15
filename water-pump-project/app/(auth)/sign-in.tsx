import React, { useState } from 'react'
import { Button, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import axiosInstance from '../../lib/axios';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";

function signIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorData, setErrorData] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    // console.log("object")
    setErrorData("");
    if (formData.email == "" && formData.password == "") {
      setErrorData("Please provide email and password");
      return;
    } else if (formData.email == "") {
      setErrorData("Please provide email");
      return;
    }
    else if (formData.password == "") {
      setErrorData("Please provide password");
      return;
    }
    const tempFormData = new FormData();
    tempFormData.append("user_input", formData.email);
    tempFormData.append("password", formData.password);

    axiosInstance.post("/login_api.php", tempFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }).then((res) => {
        console.log("object", tempFormData)
        if (res.data.status == "success") {
          alert("successfully login");
          console.log(res.data.token, "res.data.token");
          SecureStore.setItemAsync("token", res.data.token);
          router.push("/(root)/dashboard");
        } else {
          alert("Invalid login")
        }

      }).catch((error) => {
        alert("Server offline") ;
      });
  };

  return (
    <View className='h-full p-2 bg-white'>
      <View className='flex flex-col p-5 pt-10 h-[40%] text-center justify-center items-center '>
        <View>
          <Image source={require('@/assets/images/logo.jpg')} />
        </View>

        <View>
          <Text>Welcome Back to WPP</Text>

        </View>

      </View>
      <View className=''>
        <Text className='text-center text-red-400'>{errorData}</Text>
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text className=''>Email</Text>
              <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500`}>
                <TextInput className='w-full shadow-gray-50 rounded-full p-4 text-[15px] flex-2 ' onChangeText={(value) => setFormData({ ...formData, 'email': value })} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? 'padding' : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <Text>Password</Text>
              <View className={`flex flex-row justify-start items-center relative bg-neutral-100 rounded-full border border-neutral-100 focus:border-primary-500`}>
                <TextInput className='w-full shadow-gray-50 rounded-full p-4 text-[15px] flex-2 ' secureTextEntry={true} onChangeText={(value) => setFormData({ ...formData, 'password': value })} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        <View className='mt-4 rounded-md '>
          <TouchableOpacity onPress={handleLogin} className={`w-full rounded-full p-2 flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 bg-blue-600`}>

            <Text className={`text-lg font-bold text-white `}> Login</Text>

          </TouchableOpacity>
        </View>

      </View >

    </View >
  )
}

export default signIn