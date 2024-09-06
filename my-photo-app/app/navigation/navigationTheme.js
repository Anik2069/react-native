import { DefaultTheme } from "@react-navigation/native";
import color from "../config/colors";


const myNavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: color.primary,
        background: color.white,
    }
}

export default myNavTheme