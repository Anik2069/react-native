import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ListingScreen from "../../../DoneWithIT/app/screens/ListingScreen";
import ListingDetailsScreen from "../../../DoneWithIT/app/screens/ListingDetailsScreen";


const Stack = createStackNavigator();


const FeedNavigator = () => (
    <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Listings" component={ListingScreen} />
        <Stack.Screen name="ListingsDetails" component={ListingDetailsScreen} options={{ headerShown: false }} />
    </Stack.Navigator >
)

export default FeedNavigator;