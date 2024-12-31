import { Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "../constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import OAuth from "@/components/OAuth";



const SignIn = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })
    const onSignUpPress = async () => {
        console.log("first")
    }
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[300px]">
                    <Image source={images.signUpCar} />
                    <Text className={'text-2xl text-black font-bold absolute bottom-5 left-5'}>Welcome 👋</Text>
                </View>
            </View>
            <View className="p-5">
               
                <InputField label={"Email"}
                    labelStyle={""}
                    placeholder="Enter Your Email"
                    icon={icons.email}
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, 'email': value })}
                />
                <InputField label={"Password"}
                    labelStyle={""}
                    placeholder="Enter Your password"
                    icon={icons.lock}
                    value={form.password}
                    secureTextEntry={true}
                    onChangeText={(value) => setForm({ ...form, 'password': value })}
                />
                <CustomButton title="Sign In" onPress={onSignUpPress} className="mt-6" />

                <OAuth />

                <Link href="/sign-up" className="mt-10 text-lg text-center text-gray-500">
                    <Text>Don't have an account? </Text>
                    <Text className="text-blue-500">Register</Text>
                </Link>
            </View>

        </ScrollView>
    )
}

export default SignIn;