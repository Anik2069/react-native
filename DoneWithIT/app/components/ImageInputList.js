import React, { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ImageInput from './ImageInput';

function ImageInputList({ imageuris = [], onRemoveImage, onAddImage }) {
    const scorllView = useRef();

    return (
        <View>
            <ScrollView ref={scorllView} horizontal onContentSizeChange={() => scorllView.current.scrollToEnd()}>
                <View style={styles.container}>
                    {
                        imageuris.map(uri =>
                            <View key={uri} style={styles.imageContainer}>
                                <ImageInput imageuri={uri}

                                    onChangeImage={() => onRemoveImage(uri)} />
                            </View>
                        )
                    }
                    <ImageInput onChangeImage={uri => onAddImage(uri)} />
                </View>
            </ScrollView >
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    imageContainer: {
        marginRight: 10
    }
})

export default ImageInputList;