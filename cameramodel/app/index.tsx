import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import * as MediaLibrary from 'expo-media-library'; // For saving images to device storage

function index() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedUri, setCapturedUri] = useState<string | null>(null); // To store the captured image URI
    const [showPreview, setShowPreview] = useState(false); // To control modal visibility
    const cameraRef = useRef(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ fixOrientation: true, mirrorImage: true });
            setCapturedUri(photo.uri); // Save captured image URI
            setShowPreview(true); // Show preview modal
        }
    };

    const saveImage = async () => {
        if (capturedUri) {
            const asset = await MediaLibrary.createAssetAsync(capturedUri);
            console.log('Picture saved to gallery:', asset.uri);
            setShowPreview(false); // Close preview modal
        }
    };

    const retakePicture = () => {
        setCapturedUri(null); // Clear captured image
        setShowPreview(false); // Close preview modal
    };

    return (
        <View style={styles.container}>
            {!capturedUri ? (
                // Camera view if no picture is captured
                <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                    <Image
                        source={require('../assets/tshirt_design.png')} // The T-shirt design
                        style={styles.tshirtDesign}
                        resizeMode="contain"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Text style={styles.text}>Capture T-shirt Design</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                // Preview modal
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showPreview}
                    onRequestClose={() => setShowPreview(false)}
                >
                    <View style={styles.modalContainer}>
                        <Image source={{ uri: capturedUri }} style={styles.previewImage} />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.button} onPress={retakePicture}>
                                <Text style={styles.text}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={saveImage}>
                                <Text style={styles.text}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    tshirtDesign: {
        position: 'absolute',
        top: '40%', // Adjust based on your T-shirt design placement
        left: '20%', // Center horizontally
        width: '60%', // Adjust for the T-shirt width
        height: '30%', // Adjust for the T-shirt height
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    previewImage: {
        width: '80%',
        height: '60%',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
});

export default index;
