import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppText from '../components/AppText';
import color from '../config/color';
import ListItem from '../components/ListItem';

function ListingDetailsScreen({ route }) {
    const listing = route.params;
    return (
        <View>
            <Image style={styles.image} source={listing.image}></Image>
            <View style={styles.detailsContainer}>
                <AppText style={styles.title}>{listing.title}</AppText>
                <AppText style={styles.price}>{listing.price}</AppText>
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