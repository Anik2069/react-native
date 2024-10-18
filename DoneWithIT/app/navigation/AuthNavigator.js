import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator';


const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name='Welcome' component={WelcomeScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='Tab' component={AppNavigator} />
        {/* <Tab.Screen name='Account' component={AccountScreen} /> */}
    </Stack.Navigator>
)

export default AuthNavigator;