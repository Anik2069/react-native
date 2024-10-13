import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import color from '../config/color';
import AppText from './AppText';

function Card({ title, subtitle, image }) {
    return (
        <View style={styles.card}>
            <Image style={styles.image} source={image} />
            <View style={styles.detailsContainer}>
                <AppText style={styles.title}>{title}</AppText>
                <AppText style={styles.subtitle}>{subtitle}</AppText>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    card: {
        borderRadius: 15,
        backgroundColor: color.white,
        marginBottom: 20,
        overflow: "hidden"
    },
    image: {
        width: "100%",
        height: 200
    },
    detailsContainer: {
        padding: 20,

    },
    title: {
        marginBottom: 7
    },

    subtitle: {
        color: color.secondary,
        fontWeight: "bold"
    }
})
export default Card;