import React from 'react';
import { Image, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import AppText from './AppText';
import color from '../config/color';
import Swipeable from 'react-native-gesture-handler/Swipeable';


function ListItem({ title, subTitle, image, onPress, renderRightActions, IconComponent }) {
    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableHighlight
                underlayColor={color.light}
                onPress={onPress}>
                <View style={styles.container}>
                    {IconComponent}
                    {image && <Image style={styles.image} source={image} />}
                    <View style={styles.detailsContainer}>
                        <AppText style={styles.title}>{title}</AppText>
                        {subTitle && <AppText style={styles.subtitle}>{subTitle}</AppText>}
                    </View>
                </View>
            </TouchableHighlight>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 15,
        backgroundColor:color.white
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 10
    },
    detailsContainer: {
        marginLeft: 10,
        justifyContent: "center"
    },
    title: {
        fontWeight: "500"
    },
    subtitle: {
        color: color.medium
    }
})
export default ListItem;