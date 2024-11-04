import React, { useEffect, useState } from "react"
import { StyleSheet, FlatList, Button, ActivityIndicator } from "react-native"

import Card from "../components/Card"
import color from "../config/color"
import Screen from "../components/Screen"
import routes from "../navigation/route";
import listingsApi from "../api/listing"
import AppText from "../components/AppText"
import AppButton from "../components/AppButton"
import AppActivityIndicator from "../components/AppActivityIndicator"
// const listData = [
//     {
//         id: "1",
//         title: "Red jacket for sale",
//         price: "$100",
//         image: require("../assets/jacket.jpg"),
//     },
//     {
//         id: "2",
//         title: "Couch in great condition",
//         price: "$1000",
//         image: require("../assets/couch.jpg"),
//     },
// ]

const ListingScreen = ({ navigation }) => {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadListings();

    }, [])

    const loadListings = async () => {
        setLoading(true);
        const respone = await listingsApi.getListings();

        if (!respone.ok) return setError(true)

        setLoading(false);
        setError(false);
        setListings(respone.data)
    }


    return (
        <Screen style={styles.container}>
            {error &&
                <>
                    <AppText>Could not retrive the lists</AppText>
                    <AppButton title="Retry" onPress={loadListings} />
                </>}
            <AppActivityIndicator visible={true} />
            {/* <ActivityIndicator animating={loading} size={50} /> */}
            {/* <FlatList
                data={listings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card
                        title={item.title}
                        subTitle={item.price}
                        imageUrl={item.images[0].url}
                        onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
                    />
                )}
            /> */}
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        backgroundColor: color.light,
    },
})
export default ListingScreen