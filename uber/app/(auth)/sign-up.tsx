import { Alert, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../constants";
import InputField from "@/components/InputField";
import { useState } from "react";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from 'react-native-modal';


const Welcome = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    })

    const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
    })


    const onSignUpPress = async () => {
        if (!isLoaded) return

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress: form.email,
                password: form.password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            setVerification({
                ...verification,
                state: 'pending'
            });
            // Set 'pendingVerification' to true to display second form
            // and capture OTP code
            // setPendingVerification(?true)
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
            Alert.alert("Error", err.errors[0].longMessage);
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code: verification.code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                //TODO: Create a database user! 


                await setActive({ session: signUpAttempt.createdSessionId })
                setVerification({ ...verification, state: 'success' });
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                // console.error(JSON.stringify(signUpAttempt, null, 2))

                setVerification({ ...verification, state: 'failed', error: "Verification failed" });

            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            setVerification({
                ...verification,
                state: 'failed',
                error: err?.errors[0]?.longMessage
            });
        }
    }


    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[300px]">
                    <Image source={images.signUpCar} />
                    <Text className={'text-2xl text-black font-bold absolute bottom-5 left-5'}>Create Your Accouont</Text>
                </View>
            </View>
            <View className="p-5">
                <InputField label={"Name"}
                    labelStyle={""}
                    placeholder="Enter Your Name"
                    icon={icons.person}
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, 'name': value })}
                />
                <InputField label={"Email"}
                    labelStyle={""}
                    placeholder="Enter Your Email"
                    icon={icons.email}
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, 'email': value })}
                />
                <InputField label={"password"}
                    labelStyle={""}
                    placeholder="Enter Your password"
                    icon={icons.lock}
                    value={form.password}
                    secureTextEntry={true}
                    onChangeText={(value) => setForm({ ...form, 'password': value })}
                />
                <CustomButton title="Sign Up" onPress={onSignUpPress} className="mt-6" />

                <OAuth />

                <Link href="/sign-in" className="mt-10 text-lg text-center text-gray-500">
                    <Text>Already have an account? </Text>
                    <Text className="text-blue-500">Login</Text>
                </Link>

            </View>
            //verification  modal

            <ReactNativeModal isVisible={verification.state === 'pending'} onModalHide={() => {
                if (verification.state == "success") setShowSuccessModal(true)
            }
            }>
                <View className="bg-white rounded-2xl px-7 py-9 min-h-[300px]" >

                    <Text className="text-3xl font-bold text-center">Verification</Text>
                    <Text className="mt-2 font-bold text-center text-gray-400">We've sent verification code to {form.email}</Text>
                    <InputField label="Code" icon={icons.lock} value={verification.code} placeholder="12345" keyboardType="numeric"
                        onChangeText={(code) => {
                            setVerification({ ...verification, code })
                        }} />

                    {verification.error && (
                        <Text className="text-red-500 text-sm mt-1">
                            {verification.error}
                        </Text>
                    )}
                    <CustomButton title="Verify Email" className="mt-5 bg-success-500" onPress={onVerifyPress} />
                </View>
            </ReactNativeModal>

            <ReactNativeModal isVisible={showSuccessModal}>
                <View className="bg-white rounded-2xl px-7 py-9 min-h-[300px]" >
                    <View className="flex items-center justify-center">
                        <Image source={images.check} className="mx-auto my-5 w-[110px] h-[110px]" />
                    </View>
                    <Text className="text-3xl font-bold text-center">Verified</Text>
                    <Text className="mt-2 font-bold text-center text-gray-400">You have successfully verified your account</Text>
                    <CustomButton title="Browse Home" onPress={() => {
                        router.push("/(root)/(tabs)/home");
                        setShowSuccessModal(false)
                    }} className="mt-5" />
                </View>
            </ReactNativeModal>
        </ScrollView>
    )
}

export default Welcome;