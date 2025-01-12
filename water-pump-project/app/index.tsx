import { Redirect, useRouter } from 'expo-router';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from 'react';



export default function HomeScreen() {
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        console.log(token, "token");
        if (token) {
          setHasToken(true);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setIsTokenChecked(true);
      }
    };

    checkToken();
  }, []);

  // Wait until token check is complete
  if (!isTokenChecked) {
    return null; // Optionally, you can show a loading indicator here
  }

  // Redirect based on token availability
  if (hasToken) {
    return <Redirect href="/(root)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/sign-in" />;
  }
}
