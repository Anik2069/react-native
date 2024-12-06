import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";


const Welcome = () => {
    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[300px]">
                    <Image source={images.signUpCar} />
                    <Text className={'text-2xl text-black font-bold absolute bottom-5 left-5'}>Create Your Accouont</Text>
                </View>
            </View>

        </ScrollView>
    )
}

export default Welcome;