import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import color from '../config/color';
function AppTextInput({ icon }) {
    const [firstName, setFirstName] = useState("");
    return (
        <View style={styles.container}>
            <Text>{firstName}</Text>
            {icon && <MaterialCommunityIcons name={icon} />}
            <TextInput placeholder='First name'
                keyboardType='numeric'
                onChangeText={text => setFirstName(text)}
                style={{
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1
                }}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: color.light,
        borderRadius: 25,
        flexDirection: "row",
        width: '100%',
        padding: 15,
        marginVertical: 10
    },
    textInput: {
        fontSize: 18,

    }
})
export default AppTextInput;