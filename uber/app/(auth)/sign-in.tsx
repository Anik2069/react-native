import { Image, ScrollView, Text, View } from "react-native";
import { icons, images } from "../constants";
import InputField from "@/components/InputField";
import React, { useCallback, useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, useRouter } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";



const SignIn = () => {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()


    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })
    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: form.email,
                password: form.password,
            })

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status isn't complete, check why. User might need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        }
    }, [isLoaded, form.email,  form.password])
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
                <CustomButton title="Sign In" onPress={onSignInPress} className="mt-6" />

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