import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from '../config/color';

function ListItemDeleteAction({ onPress }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.constainer}>
                <MaterialCommunityIcons name="trash-can" color="white" size={30} />
            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    constainer: {
        backgroundColor: color.danger,
        width: 70,
        justifyContent: "center",
        alignItems:"center"
    }
})

export default ListItemDeleteAction;