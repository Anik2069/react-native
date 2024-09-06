import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ListingScreen from '../screens/ListingScreen';


const Tab = createBottomTabNavigator();

const AppNavigator = () =>
(
    <Tab.Navigator>
        <Tab.Screen name='Listing' component={ListingScreen} />
        <Tab.Screen name='ListingEdit' component={ListingScreen} />
        <Tab.Screen name='Account' component={ListingScreen} />
    </Tab.Navigator>
)

export default AppNavigator;