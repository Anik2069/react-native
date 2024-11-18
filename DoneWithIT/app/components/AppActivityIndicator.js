import React from 'react';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';

function AppActivityIndicator({ visible = false }) {
    // if (!visible) return null
    // return
    // 


    return (
        <LottieView source={require("../assets/animations/loaderV2.json")} autoPlay loop />
    );

}

export default AppActivityIndicator;