import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from '../config/color';

function ViewImageScreen(props) {
    return (
        <View style={styles.container}>
            <View style={styles.closeIcon}>
                <MaterialCommunityIcons name="close" color="white" size={30} />
            </View>
            <View style={styles.deleteIcon}>
                <MaterialCommunityIcons name="trash-can-outline" color="white" size={30} />
            </View>
            <Image resizeMode='contain' style={styles.image} source={require("../../assets/chair.jpg")}></Image>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        flex: 1
    },
    closeIcon: {
        // width: 50,
        // height: 50,
        // backgroundColor: color.primary,
        position: "absolute",
        top: 40,
        left: 30
    },

    deleteIcon: {
        // width: 50,
        // height: 50,
        // backgroundColor: color.secondary,
        position: "absolute",
        top: 40,
        right: 30
    },


    image: {
        width: "100%",
        height: "100%",
    }
})
export default ViewImageScreen;