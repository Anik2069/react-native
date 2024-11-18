import React, { useState } from 'react';
import AppText from './AppText';
import { Button, FlatList, Modal, StyleSheet, View } from 'react-native';
import defaultStyle from '../config/styles';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Screen from './Screen';
import PickerItem from './PickerItem';


function AppPicker({ icon, items, placeholder, selectedItem, onSelectItem }) {
    const [modalVisiable, setModalVisialbe] = useState(false);
    return (
        <>
            <TouchableWithoutFeedback onPress={() => setModalVisialbe(true)}>
                <View style={styles.container}>
                    {icon && <MaterialCommunityIcons name={icon} size={20} color={defaultStyle.color.medium} style={styles.icon} />}
                    <AppText style={styles.text}>{selectedItem ? selectedItem.label : placeholder}</AppText>

                    <MaterialCommunityIcons name={"chevron-down"} size={20} color={defaultStyle.color.medium} />
                </View>
            </TouchableWithoutFeedback>
            <Modal visible={modalVisiable} animationType='slide'>
                <Screen>
                    <Button title="close" onPress={() => setModalVisialbe(false)} />
                    <FlatList
                        data={items}
                        keyExtractor={item => item.value.toString()}
                        renderItem={({ item }) => <PickerItem label={item.label} onPress={() => {
                            setModalVisialbe(false);
                            onSelectItem(item)
                        }} />}
                    />
                </Screen>
            </Modal>
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: defaultStyle.color.light,
        borderRadius: 25,
        flexDirection: "row",
        width: "100%",
        padding: 15,
        marginVertical: 10
    },

    icon: {
        marginRight: 10
    },
    text: {
        flex: 1
    }
})
export default AppPicker;