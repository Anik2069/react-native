

import { Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function Layout() {
    return (
        <Tabs
            initialRouteName="dashboard"
            screenOptions={{
                tabBarActiveTintColor: "#38bdf8",
                tabBarInactiveTintColor: "#94a3b8",
                headerShown: false,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "700",
                    marginTop: -4,
                },
                tabBarStyle: {
                    position: "absolute",
                    left: 20,
                    right: 20,
                    bottom: Platform.OS === 'ios' ? 30 : 22,
                    backgroundColor: "#0f172a",
                    borderRadius: 28,
                    height: 64,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderWidth: 1.5,
                    borderColor: "#334155",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 16,
                    elevation: 10,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ focused, color, size }) => (
                        <Ionicons
                            name={focused ? "speedometer" : "speedometer-outline"}
                            size={size || 22}
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
                        <Ionicons
                            name={focused ? "time" : "time-outline"}
                            size={size || 22}
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
                        <Ionicons
                            name={focused ? "options" : "options-outline"}
                            size={size || 22}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}