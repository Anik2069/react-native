import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ViewImageScreen from './app/screens/ViewImageScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from './app/components/AppText';
import AppButton from './app/components/AppButton';
import Card from './app/components/Card';
import ListingDetailsScreen from './app/screens/ListingDetailsScreen';
import MessagesScreen from './app/screens/MessagesScreen';
import Screen from './app/components/Screen';
import Icon from './app/components/Icon';
import ListItem from './app/components/ListItem';
import AccountScreen from './app/screens/AccountScreen';
import AppTextInput from './app/components/AppTextInput';
import AppSwitch from './app/components/AppSwitch';
import AppPicker from './app/components/AppPicker';
import { useState } from 'react';
import LoginScreen from './app/screens/LoginScreen';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import myNavTheme from './app/navigation/navigationTheme';

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
const categories = [
  {
    label: "GFu", value: 1
  },
  {
    label: "Gu", value: 2
  },
  {
    label: "Fu", value: 3
  }
]
export default function App() {
  const [category, setCategory] = useState(categories[0]);
  return (
    <>
      {/* theme={myNavTheme} */}
      <NavigationContainer >
        <AuthNavigator />
        {/* <AppNavigator /> */}
      </NavigationContainer>
    </>
  );
}
{/* <Screen>
  <AppPicker selectedItem={category}
    onSelectItem={(item) => setCategory(item)}
    placeholder={"Category"} items={categories} icon={"apps"} />
  <AppTextInput icon={"email"} placeholder={'Email'} />
  <AppSwitch />
</Screen> */}

{/* <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      > */}
{/* border  */ }
{/* <View style={{
        backgroundColor: "dodgerblue",
        width: 100,
        height: 100,
        borderWidth: 10,
        borderColor: "royalblue",
        borderRadius: 10,
        borderTopWidth: 20,
        borderTopRightRadius: 50,
      }}></View> */}
{/* shadow  */ }
{/* <View style={{
        backgroundColor: "dodgerblue",
        width: 100,
        height: 100,
        // for ios 
        shadowColor: "black",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 10,
        // andriod
        elevation: 30,

      }}></View> */}
{/* 
      <View style={{
        backgroundColor: "dodgerblue",
        width: 100,
        height: 100,
        padding: 20,
        paddingHorizontal: 10,
        paddingLeft: 30
        // paddingVertical:30
      }}>
        <View style={{
          backgroundColor: "gold",
          width: 50,
          height: 50,

        }}></View>

      </View>
      <View style={{
        backgroundColor: "tomato",
        width: 100,
        height: 100,
        margin: 20
      }}></View> */}
{/* 
      <Text style={{
        // fontFamily: "Roboto",
        fontSize: 30,
        fontStyle: "italic",
        fontWeight: "600",
        color: "tomato",
        textTransform: "capitalize",
        textAlign: "center",
        lineHeight: 30
        // textDecorationLine
      }}>
        I Love React Native! This is my react native apps. Here some more text
      </Text> */}
{/* <AppText>
        I Love React Native! This is my react native apps. Here some more text
      </AppText>
      <MaterialCommunityIcons name='email' size={200} color="dodgerblue"> </MaterialCommunityIcons> */}
{/* <AppButton title="Login" onPress={() => console.log("Tappped")} /> */ }

{/* </View> */ }
{/* <View style={{
        backgroundColor: "#f8f4f4",
        padding: 20,
        paddingTop: 100
      }}>
        <Card
          title="Red Jack"
          subtitle="$100"
          image={require("./app/assets/jacket.jpg")}
        />


        <Card
          title="Chair"
          subtitle="$100"
          image={require("./assets/chair.jpg")}
        />

      </View> */}
{/* <ListingDetailsScreen /> */ }
{/* <ViewImageScreen /> */ }
{/* <MessagesScreen /> */ }
{/* <AccountScreen /> */ }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // alignItems: 'center',
//     // justifyContent: 'center',
//   },
// });


// <NavigationContainer>
//   {/* stack navigation */}
//   {/* <Stack.Navigator screenOptions={{
//         headerStyle: { backgroundColor: "dodgerblue" },
//         headerTintColor: "white",
//       }}>
//         <Stack.Screen name='Tweets' component={Tweets}
//           options={{
//             headerStyle: { backgroundColor: "tomato" },
//             headerTintColor: "white",
//             // headerShown: false
//           }}
//         />
//         <Stack.Screen name='TweetsDetails' options={({ route }) => ({ title: route.params.id })} component={TweetsDetails} />
//       </Stack.Navigator> */}


//   {/* Tab navigation */}

//   <Tab.Navigator tabBarOptions={{
//     activeBackgroundColor: 'tomato',
//     activeTintColor: "white",
//     inactiveBackgroundColor: "#eee",
//     inactiveTintColor: "black"

//   }}>
//     <Tab.Screen name='Tweets' component={FeedNavigator} options={{
//       tabBarIcon: ({ size, color }) => <MaterialCommunityIcons name='home' size={size} color={color} />
//     }} />
//     <Tab.Screen name='Account' component={Account} />
//   </Tab.Navigator>
// </NavigationContainer >