

import { Tabs } from 'expo-router';
import { MaterialIcons } from "@expo/vector-icons";
export default function Layout() {
    return (
        <Tabs
            initialRouteName="dashboard"
            screenOptions={{
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "#aaa",
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: 45,
                    backgroundColor: "#333333",
                    borderRadius: 30,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    elevation: 5, // shadow for Android
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                            name={focused ? "home" : "home-filled"} // active vs inactive
                            size={size || 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                            name={focused ? "history" : "schedule"} // active vs inactive
                            size={size || 24}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="config"
                options={{
                    title: "Config",
                    tabBarIcon: ({ focused, color, size }) => (
                        <MaterialIcons
                            name={ "settings"} // active vs inactive
                            size={size || 24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}