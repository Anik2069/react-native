

import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { icons } from "../../constants";


const TabIcon = ({ focused }) => (
    <View className={`flex flex-row justify-center items-center rounded-full ${focused ? 'bg-green-200' : ''}`}>
        <View>
            <Image />
        </View>
    </View >
)

export default function Layout() {


    return (

        <Tabs initialRouteName="home" screenOptions={{
            tabBarActiveTintColor: "white"
        }}>
            <Tabs.Screen name='home' options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />
            }} />

            <Tabs.Screen name='rides' options={{
                title: "Rides",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.list} />
            }} />



            <Tabs.Screen name='chats' options={{
                title: "Chats",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.chat} />
            }} />

            <Tabs.Screen name='profile' options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={icons.home} />
            }} />
        </Tabs>
    )
}
