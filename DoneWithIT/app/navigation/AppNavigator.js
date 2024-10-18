import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessagesScreen from '../screens/MessagesScreen';
import AccountScreen from '../screens/AccountScreen';
import ListingScreen from '../screens/ListingScreen';
import FeedNavigator from './FeedNavigator';
import AccountNavigator from './AccountNavigator';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import NewListingButton from './NewListingButton';

const Tab = createBottomTabNavigator();


const AppNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name='Feed' component={FeedNavigator} options={{
            tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons name='home' color={color} size={20} />

        }} />
        <Tab.Screen name='Messages' component={MessagesScreen} options={({ navigation }) => ({
            tabBarButton: () => <NewListingButton onPress={() => navigation.navigate("Messages")} />,
            tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons name='plus-circle' color={color} size={size} />

        })} />
        <Tab.Screen name='Account' component={AccountNavigator} options={{
            tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons name='account' color={color} size={size} />

        }} />
    </Tab.Navigator>
)

export default AppNavigator;