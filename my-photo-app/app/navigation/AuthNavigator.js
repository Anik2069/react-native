import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="welcome" component={WelcomeScreen} options={{
            headerStyle: { backgroundColor: "tomato" },
            headerTintColor: "white",
            headerShown: false
        }} />
        <Stack.Screen name="login" component={LoginScreen}  />
        <Stack.Screen name="register" component={WelcomeScreen} />
    </Stack.Navigator>
)

export default AuthNavigator;