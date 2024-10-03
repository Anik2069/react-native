import React from 'react';
import color from '../config/color';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

function AppButton({ title, onPress, colorName = "primary" }) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color[colorName] }]} onPress={onPress}>

            <Text style={styles.text}>{title}</Text>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: color.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%',
        marginVertical: 10
    },
    text: {
        color: color.white,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: "bold"
    }
})

export default AppButton;