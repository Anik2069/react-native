import React from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';

function WelcomeScreen(props) {
    return (
        <ImageBackground
            style={styles.background}
            blurRadius={10}
            source={require("../assets/background.jpg")}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../../assets/anik.jpg")}></Image>
                <Text style={styles.tagline}>Login Here</Text>
            </View>
            <View style={styles.btnContainer}>
                <AppButton title="login" />
                <AppButton title="Register" colorName='secondary' />
                {/* <View style={styles.loginButton}></View> */}
                {/* <View style={styles.regButton}></View> */}
            </View>
            <Text>@ANIK</Text>
        </ImageBackground>
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
    },
    btnContainer: {
        padding: 20,
        width: "100%"
    },
    tagline: {
        fontSize: 25, fontWeight: "600", paddingVertical: 20
    }
})

export default WelcomeScreen;