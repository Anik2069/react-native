import React, { useContext } from 'react';
import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import { FlatList, StyleSheet, View } from 'react-native';
import color from '../config/color';
import Icon from '../components/Icon';
import ListItemSeparator from '../components/ListItemSeparator';
import storage from '../auth/storage';
import AuthContext from '../auth/context';

const menuItems = [
    {
        title: "MyListing",
        icon: {
            name: "format-list-bulleted",
            backgroundColor: color.primary
        },
        url: "Lisiting"
    },
    {
        title: "My Message",
        icon: {
            name: "email",
            backgroundColor: color.secondary
        },
        url: "Messages"
    }
]




function AccountScreen({ navigation }) {

    const authContext = useContext(AuthContext);
    const handleLogout = () => {
        authContext.setUser(null);
        storage.removeToken();
    }
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
                        <ListItem
                            title={item.title}
                            onPress={() => navigation.navigate("Messages")}
                            IconComponent={<Icon name={item.icon.name} backgroundColor={item.icon.backgroundColor}

                            />}
                        />
                    }
                />
            </View>
            <ListItem
                title="Log Out"
                IconComponent={<Icon name='logout' backgroundColor="#ffe66d" />}
                onPress={handleLogout}
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