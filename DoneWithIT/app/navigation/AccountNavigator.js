import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingScreen from "../../../DoneWithIT/app/screens/ListingScreen";
import ListingDetailsScreen from "../../../DoneWithIT/app/screens/ListingDetailsScreen";
import MessagesScreen from "../screens/MessagesScreen";
import LoginScreen from "../screens/LoginScreen";
import AccountScreen from "../screens/AccountScreen";


const Stack = createStackNavigator();


const AccountNavigator = () => (
    <Stack.Navigator mode="modal">

        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
)

export default AccountNavigator;