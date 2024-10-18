import { Platform } from "react-native"
import color from "./color"


export default {
    color,
    text: {
        fontSize: 18,
        fontFamily: Platform.OS === "andriod" ? "Roboto" : "Avenir",
        color: color.dark
    }
}