import React, { useState } from 'react'
import { 
  Image, 
  Keyboard, 
  KeyboardAvoidingView, 
  Platform, 
  SafeAreaView, 
  ScrollView, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  View 
} from 'react-native'
import axiosInstance from '../../lib/axios';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { Ionicons } from '@expo/vector-icons';

function signIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorData, setErrorData] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
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
          router.push("/dashboard");
        } else {
          alert("Invalid login")
        }

      }).catch((error) => {
        alert("Server offline");
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Branding Section */}
            <View className="items-center mb-8">
              <View className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <Image 
                  source={require('@/assets/images/logo.jpg')}
                  style={{ width: 90, height: 90, borderRadius: 20, resizeMode: 'contain' }}
                />
              </View>
              <Text className="text-2xl font-bold text-slate-800 tracking-tight mt-5">Smart Pump Portal</Text>
              <Text className="text-slate-500 text-xs text-center mt-1.5 max-w-[240px] leading-relaxed">
                Sign in to monitor and manage your Smart Water Pump system.
              </Text>
            </View>

            {/* Form Card */}
            <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              {errorData ? (
                <View className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4 flex-row items-center gap-2">
                  <Ionicons name="alert-circle" size={16} color="#f43f5e" />
                  <Text className="text-rose-600 text-xs font-semibold flex-1">{errorData}</Text>
                </View>
              ) : null}

              {/* Email Field */}
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Email / Username</Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 relative">
                  <Ionicons name="mail" size={16} color="#64748b" className="mr-2" />
                  <TextInput 
                    className="flex-1 py-3 text-slate-800 text-[14px] font-semibold" 
                    onChangeText={(value) => setFormData({ ...formData, 'email': value })}
                    placeholder="Enter email or username"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View className="mb-6">
                <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Password</Text>
                <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 relative">
                  <Ionicons name="lock-closed" size={16} color="#64748b" className="mr-2" />
                  <TextInput 
                    className="flex-1 py-3 text-slate-800 text-[14px] font-semibold mr-2" 
                    secureTextEntry={!showPassword} 
                    onChangeText={(value) => setFormData({ ...formData, 'password': value })}
                    placeholder="Enter password"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={16}
                      color="#64748b"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Actions */}
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={handleLogin} 
                  className="w-full bg-blue-600 active:bg-blue-700 py-3.5 rounded-xl flex-row justify-center items-center shadow-md shadow-blue-100"
                >
                  <Ionicons name="log-in-sharp" size={18} color="#fff" className="mr-2" />
                  <Text className="text-white text-[15px] font-bold">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => router.push("/(auth)/wifi-config")} 
                  className="w-full border border-blue-200 bg-white active:bg-slate-50 py-3.5 rounded-xl flex-row justify-center items-center mt-3"
                >
                  <Ionicons name="wifi-sharp" size={18} color="#2563eb" className="mr-2" />
                  <Text className="text-blue-600 text-[15px] font-bold">Setup Your Device</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default signIn