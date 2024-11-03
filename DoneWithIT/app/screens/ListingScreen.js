import React, { useEffect, useState } from "react"
import { StyleSheet, FlatList } from "react-native"

import Card from "../components/Card"
import color from "../config/color"
import Screen from "../components/Screen"
import routes from "../navigation/route";
import listingsApi from "../api/listing"
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

    useEffect(() => {
        loadListings()
    }, [])

    const loadListings = async () => {
        const respone = await listingsApi.getListings();
        setListings(respone.data)
    }


    return (
        <Screen style={styles.container}>
            <FlatList
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
            />
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