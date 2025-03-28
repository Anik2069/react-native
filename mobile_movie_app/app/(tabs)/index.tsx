import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 items-center justify-center bg-white"
    >
      <Text className="text-5xl text-dark-200 font-bold">Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/onboarding"} className="text-blue-500 mt-4">
        Go to Onboarding
      </Link>
      <Link href={"/movie/55"} className="text-blue-500 mt-4">
        Go to Details
      </Link>
    </View>
  );
}
