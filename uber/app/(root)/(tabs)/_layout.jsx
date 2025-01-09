

import { Tabs } from 'expo-router';
import { Image, View } from 'react-native';
import { icons } from "../../constants";


const TabIcon = ({ source, focused }: { source: ImageSourcePropType, focused: boolean }) => (
    <View className={`flex flex-row justify-center items-center rounded-full ${focused ? 'bg-green-200' : ''}`}>
        <View className={`rounded-full w-10 h-10 items-center justify-center ${focused ? 'bg-green-200' : ''}`}>
            <Image source={source} tintColor={"white"} resizeMethod='contain' className="w-7 h-7" />
        </View>
    </View >
)

export default function Layout() {
    return (
        <Tabs
            initialRouteName="home"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "white",
                // tabBarShowLabel: false,
                tabBarStyle: {
                    display: "flex",
                    backgroundColor: "#333333",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    alignItems: "center",
                    justifyContent: "center",
                    // paddingVertical: 50,
                    
                    // height: 78,
                    // overflow: "hidden",
                    // position: "absolute",
                    // flexDirection: "row",
                    // flexDirection: "row",


                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.home} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rides"
                options={{
                    title: "Rides",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.list} />
                    ),
                }}
            />
            <Tabs.Screen
                name="chats"
                options={{
                    title: "Chats",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.chat} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} source={icons.profile} />
                    ),
                }}
            />
        </Tabs>
    );
}
