import { DefaultTheme } from "@react-navigation/native";
import color from "../config/color";


const myNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.color,
        primary: color.primary,
        background: color.white,
    }
}

export default myNavTheme