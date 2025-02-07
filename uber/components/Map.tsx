import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { PROVIDER_DEFAULT } from "react-native-maps"

function Map() {
    // const region ={}';;'
    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                tintColor='black'
                mapType='mutedStandard'
                showsPointsOfInterest={false}
                showsUserLocation={true}
                userInterfaceStyle='light'
                // initialRegion={}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
export default Map