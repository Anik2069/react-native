import React from 'react';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import color from '../config/color';
import defaultStyle from '../config/styles';

function AppTextInput({ icon, ...otherProps }) {
    return (
        <View style={styles.container}>
            {icon && <MaterialCommunityIcons name={icon} size={25} color={color.medium} style={styles.icon} />}
            <TextInput style={defaultStyle.text} {...otherProps} />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyle.color.light,
        borderRadius: 25,
        flexDirection: "row",
        width: "100%",
        padding: 15,
        marginVertical: 10
    },

    icon: {
        marginRight: 10,
        marginTop:5
    }
})
export default AppTextInput;