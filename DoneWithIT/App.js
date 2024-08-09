import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Tweets({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      {/* <Button title='View Tweet' onPress={() => navigation.navigate("TweetsDetails")} /> */}
      <Link />
    </View>
  );
}


function TweetsDetails({ route }) {
  //useRoute
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen {route.params.id}</Text>

    </View>
  );
}

function Link() {
  const navigation = useNavigation();
  return (
    <Button title='click' onPress={() => navigation.navigate("TweetsDetails", { id: 10 })} />
  );
}



function Account({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Account</Text>
      {/* <Button title='View Tweet' onPress={() => navigation.navigate("TweetsDetails")} /> */}
      <Link />
    </View>
  );
}


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


const FeedNavigator = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: { backgroundColor: "dodgerblue" },
    headerTintColor: "white",
  }}>
    <Stack.Screen name='Tweets' component={Tweets}
      options={{
        headerStyle: { backgroundColor: "tomato" },
        headerTintColor: "white",
        // headerShown: false
      }}
    />
    <Stack.Screen name='TweetsDetails' options={({ route }) => ({ title: route.params.id })} component={TweetsDetails} />
  </Stack.Navigator>
)

export default function App() {
  return (
    <NavigationContainer>
      {/* stack navigation */}
      {/* <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: "dodgerblue" },
        headerTintColor: "white",
      }}>
        <Stack.Screen name='Tweets' component={Tweets}
          options={{
            headerStyle: { backgroundColor: "tomato" },
            headerTintColor: "white",
            // headerShown: false
          }}
        />
        <Stack.Screen name='TweetsDetails' options={({ route }) => ({ title: route.params.id })} component={TweetsDetails} />
      </Stack.Navigator> */}


      {/* Tab navigation */}

      <Tab.Navigator tabBarOptions={{
        activeBackgroundColor: 'tomato',
        activeTintColor: "white",
        inactiveBackgroundColor: "#eee",
        inactiveTintColor: "black"

      }}>
        <Tab.Screen name='Tweets' component={FeedNavigator} options={{
          tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name='home' size={size} color={color} />
        }} />
        <Tab.Screen name='Account' component={Account} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // alignItems: 'center',
//     // justifyContent: 'center',
//   },
// });
