import React, { useEffect } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import color from '../config/color';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

function ImageInput({ imageuri, onChangeImage }) {

    useEffect(() => {
        requestPermission();

    }, [])
    const requestPermission = async () => {
        // const { granted } =await Permissions.askAsync(Permissions.CAMERA, Permissions.LOCATION_BACKGROUND,)
        const { granted } = await ImagePicker.requestCameraPermissionsAsync();

        if (!granted) alert("You neeed to enable permission")
    }

    const handlePress = () => {
        if (!imageuri) selectImage();
        else Alert.alert("Delete", "Are You want to delete this Image", [
            {
                text: "Yes", onPress: () => onChangeImage(null)
            },
            {
                text: "No"
            }
        ])
    }

    const selectImage = async () => {
        try {
            // const { granted } = Permissions.askAsync(Permissions.CAMERA, Permissions.LOCATION_BACKGROUND,) 
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5,

            });
            if (!result.canceled) {
                onChangeImage(result.assets[0].uri);
            }
            // console.log(result, result.canceled, result.assets[0].uri);
        } catch (error) {
            console.log("Error", error)
        }

    }
    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                {
                    !imageuri && <MaterialCommunityIcons color={color.medium} name='camera' size={40} />
                }
                {
                    imageuri && <Image source={{ uri: imageuri }} style={styles.images} />
                }

            </View>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        backgroundColor: color.light,
        borderRadius: 15,
        height: 100,
        width: 100,
        overflow: "hidden",
        justifyContent: "center"
    },
    images: {
        height: "100%",
        width: "100%",
    }
})
export default ImageInput;