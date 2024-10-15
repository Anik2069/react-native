import React from 'react';
import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import { FlatList, StyleSheet, View } from 'react-native';
import color from '../config/color';
import Icon from '../components/Icon';
import ListItemSeparator from '../components/ListItemSeparator';

const menuItems = [
    {
        title: "MyListing",
        icon: {
            name: "format-list-bulleted",
            backgroundColor: color.primary
        }
    },
    {
        title: "My Message",
        icon: {
            name: "email",
            backgroundColor: color.secondary
        }
    }
]


function AccountScreen(props) {
    return (
        <Screen style={styles.screen}>
            <View style={styles.container}>
                <ListItem
                    title="Md Anik Islam"
                    subTitle="anikislam668@gmail.com"
                    image={require("../assets/anik.jpg")}
                />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={menuItems}
                    keyExtractor={menuItem => menuItem.title}
                    ItemSeparatorComponent={ListItemSeparator}
                    renderItem={({ item }) =>
                        <ListItem title={item.title}
                            IconComponent={<Icon name={item.icon.name} backgroundColor={item.icon.backgroundColor} />}
                        />
                    }
                />
            </View>
            <ListItem
                title="Log Out"
                IconComponent={<Icon name='logout' backgroundColor="#ffe66d" />}
            />
        </Screen>
    );
}
const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    screen: {
        backgroundColor: color.light
    }
})

export default AccountScreen;