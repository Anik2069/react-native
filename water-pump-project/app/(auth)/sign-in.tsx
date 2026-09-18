import React, { useState, useEffect, useRef } from 'react'
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
  View 
} from 'react-native'
import axiosInstance from '../../lib/axios';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { Ionicons } from '@expo/vector-icons';
import { findDeviceId, findUserName } from '@/lib/deviceHelper';

function signIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorData, setErrorData] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const passwordInputRef = useRef<any>(null);

  const router = useRouter();

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleLogin = async () => {
    Keyboard.dismiss();
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
      }).then(async (res) => {
        console.log("object", tempFormData)
        if (res.data.status == "success") {
          console.log(JSON.stringify(res.data), "login response full data");
          if (res.data.token) {
            await SecureStore.setItemAsync("token", String(res.data.token));
          }

          const detectedUser = findUserName(res.data) || formData.email;
          await SecureStore.setItemAsync("userName", detectedUser);

          const dId = findDeviceId(res.data);
          console.log("Extracted deviceId on login:", dId);
          if (dId) {
            await SecureStore.setItemAsync("deviceId", dId);
          }

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: isKeyboardVisible ? 'flex-start' : 'center', 
            paddingHorizontal: 20, 
            paddingTop: isKeyboardVisible ? 24 : 10,
            paddingBottom: isKeyboardVisible ? 160 : 40 
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {/* Branding Section */}
          <View className={`items-center ${isKeyboardVisible ? 'mb-4' : 'mb-8'}`}>
            <View className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
              <Image 
                source={require('@/assets/images/logo.png')}
                style={{ 
                  width: isKeyboardVisible ? 55 : 85, 
                  height: isKeyboardVisible ? 55 : 85, 
                  borderRadius: 16, 
                  resizeMode: 'contain' 
                }}
              />
            </View>
            <Text className={`font-bold text-slate-800 tracking-tight ${isKeyboardVisible ? 'text-xl mt-2' : 'text-2xl mt-4'}`}>
              Water Pump Controller
            </Text>
            {!isKeyboardVisible && (
              <Text className="text-slate-500 text-xs text-center mt-1.5 max-w-[240px] leading-relaxed">
                Sign in to monitor and control your Smart Water Pump system.
              </Text>
            )}
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
                  value={formData.email}
                  onChangeText={(value) => setFormData({ ...formData, 'email': value })}
                  placeholder="Enter email or username"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
              <Text className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 ml-1">Password</Text>
              <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 relative">
                <Ionicons name="lock-closed" size={16} color="#64748b" className="mr-2" />
                <TextInput 
                  ref={passwordInputRef}
                  className="flex-1 py-3 text-slate-800 text-[14px] font-semibold mr-2" 
                  value={formData.password}
                  secureTextEntry={!showPassword} 
                  onChangeText={(value) => setFormData({ ...formData, 'password': value })}
                  placeholder="Enter password"
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default signIn