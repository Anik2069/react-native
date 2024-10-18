import React from "react";
import { Text, } from 'react-native';
import styles from "./styles";
import defaultStyle from '../../config/styles';
function AppText({ children, style }) {
    return (
        <Text style={[defaultStyle.text, style]}>
            {children}
        </Text>
    )
}

export default AppText;

