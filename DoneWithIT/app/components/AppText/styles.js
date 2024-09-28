import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    text: {
        // fontSize: 58,
        // fontFamily: Platform.OS === "andriod" ? "Roboto" : "Avenir",
        // fontStyle: "italic",
        // fontWeight: "600",
        color: "tomato",
        // textTransform: "capitalize",
        // textAlign: "center",
        // lineHeight: 30
        ...Platform.select({
            ios: {
                fontSize: 20,
                fontFamily: "Avenir"
            },
            android: {
                fontSize: 18,
                fontFamily: "Roboto"
            }
        }),
    }
})

export default styles;