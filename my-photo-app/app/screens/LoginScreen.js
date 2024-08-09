import React from 'react';
import { Button, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';

function LoginScreen({ navigation }) {
    return (
        <SafeAreaView
            style={styles.background}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../../assets/anik.jpg")}></Image>
                <Text>Login 2222</Text>
            </View>
            <View>
                <Button title='login' onPress={() => navigation.navigate("login")} />
            </View>
            <View style={styles.loginButton}></View>
            <View style={styles.regButton}></View>
            <Text>@ANIK</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    loginButton: {
        backgroundColor: "green",
        width: "100%",
        height: 50
    },
    logo: {
        // position: "absolute",
        // top: 70,
        width: 100,
        height: 100
    },
    regButton: {
        backgroundColor: "red",
        width: "100%",
        height: 50
    },
    logoContainer: {
        position: "absolute",
        top: 70,
        alignItems: "center"
    }
})

export default LoginScreen;