import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import ListItem from '../components/ListItem';

import Screen from '../components/Screen';
import ListItemSeparator from '../components/ListItemSeparator';
import ListItemDeleteAction from '../components/ListItemDeleteAction';

const initalMessage = [
    {
        id: 1,
        title: "T1",
        description: "TD1",
        image: require("../assets/anik.jpg"),
    },
    {
        id: 2,
        title: "T2",
        description: "TD2",
        image: require("../assets/anik.jpg"),
    }
]

function MessagesScreen(props) {
    const [messagges, setMessages] = useState(initalMessage);
    const [refreshing, setRefreshing] = useState(false);

    const handleDelete = (message) => {
        setMessages(messagges.filter((m) => m.id !== message.id));
    }
    return (
        <Screen>
            <FlatList data={messagges} keyExtractor={messagge => messagge.id.toString()}
                renderItem={({ item }) =>
                    <ListItem
                        title={item.title}
                        subTitle={item.description}
                        image={item.image}
                        onPress={() => console.log("selected", item)}
                        renderRightActions={() =>
                            <ListItemDeleteAction
                                onPress={() => handleDelete(item)}
                            />
                        }
                    />}
                ItemSeparatorComponent={<ListItemSeparator />}
                refreshing={refreshing}
                onRefresh={() => {
                    setMessages([
                        {
                            id: 2,
                            title: "T2",
                            description: "TD2",
                            image: require("../assets/anik.jpg"),
                        }
                    ])
                }}

            />
        </Screen>
    );
}

export default MessagesScreen;