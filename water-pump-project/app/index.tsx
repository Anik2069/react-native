import { Redirect } from 'expo-router';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';



export default function HomeScreen() {
  return <Redirect href="/(auth)/sign-in" />
}

