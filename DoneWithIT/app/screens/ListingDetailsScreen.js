import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import color from '../config/color';
import ListItem from '../components/ListItem';

function ListingDetailsScreen(props) {
    return (
        <View>
            <Image style={styles.image} source={require("../assets/jacket.jpg")}></Image>
            <View style={styles.detailsContainer}>
                <AppText style={styles.title}>Red</AppText>
                <AppText style={styles.price}>$100</AppText>
                <View style={styles.userContainer}>
                    <ListItem
                        image={require("../assets/anik.jpg")}
                        title="Md Anik Islam"
                        subTitle="5 listings"
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: 300
    },
    detailsContainer: {
        padding: 20
    },
    userContainer: {
        marginVertical: 40
    },
    title: {
        fontSize: 24,
        fontWeight: "500"
    },
    price: {
        color: color.secondary,
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 10
    }
})

export default ListingDetailsScreen;