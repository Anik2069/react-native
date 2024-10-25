import React, { useEffect, useState } from 'react';
import Screen from '../components/Screen';
import AppTextInput from '../components/AppTextInput';
import ImageInput from '../components/ImageInput';
import { Button } from 'react-native';
import ImageInputList from '../components/ImageInputList';
import * as  Yup from 'yup';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import FormImagePicker from '../components/FormImagePicker';
import PickerItem from '../components/PickerItem';
import AppPicker from '../components/AppPicker';
import SubmitButton from '../components/SubmitButton';
import * as Location from "expo-location";

const validatorSchema = Yup.object().shape({
    title: Yup.string().required().email().label("Title"),
    price: Yup.string().required().min(1).label("price"),
    description: Yup.string().label("Desctiption"),
    category: Yup.string().required().nullable().label("Category"),
    images: Yup.array().required().min(1, "PLease select at least one image"),
})

const categories = [
    {
        label: "GFu", value: 1
    },
    {
        label: "Gu", value: 2
    },
    {
        label: "Fu", value: 3
    }
]

function EditScreen({ selectImage }) {
    const [imageuris, setImageUris] = useState([]);
    const handleAdd = uri => {
        console.log(uri, "uri");
        setImageUris([...imageuris, uri])
    }
    const handleRemove = uri => {
        console.log(uri, "uri2");
        setImageUris(imageuris.filter((imageuri) => imageuri !== uri))
    }
    const getLocation = async () => {
        const result = await Location.requestBackgroundPermissionsAsync();
        console.log(result);

        const result2 = await Location.getLastKnownPositionAsync()

        console.log(result2, "dd");
    }
    useEffect(() => {
        getLocation()
    }, [])
    return (
        <Screen>
            <AppForm
                initialValues={{
                    title: "",
                    price: "",
                    description: "",
                    category: null,
                    images: []
                }}
            >
                <FormImagePicker name={"images"} />
                <AppFormField placeholder="Title" name={"title"} />
                <AppTextInput placeholder="Price" name={"price"} />
                <AppTextInput placeholder="Description" name={"description"} />
                <AppPicker placeholder={"Select a category"} items={categories} />
                <SubmitButton title="Save" />
            </AppForm>
            {/* <ImageInputList imageuris={imageuris} onAddImage={handleAdd} onRemoveImage={handleRemove} /> */}


            {/* <AppTextInput placeholder="title" name={"title"} /> */}
        </Screen>
    );
}

export default EditScreen;