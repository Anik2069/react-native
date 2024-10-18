import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import color from '../config/color';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView, TouchableOpacity } from 'react-native-gesture-handler';
function NewListingButton({ onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.constainer}>
                <MaterialCommunityIcons name='plus-circle' color={color.white} size={30} />
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    constainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.primary,
        borderRadius: 40,
        borderColor: color.white,
        borderWidth: 10,
        bottom: 25,
        height: 80,
        width: 80
    }
})
export default NewListingButton;