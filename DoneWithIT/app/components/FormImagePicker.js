import React from 'react';
import ImageInputList from './ImageInputList';
import ErrorMessage from './ErrorMessage';
import { useFormikContext } from 'formik';

function FormImagePicker({ name }) {
    const { setFieldValue, handleChange, errors, touched, values } = useFormikContext()
    const imageuris = values[name];
    const handleAdd = uri => {
        console.log(uri, "uri");
        setFieldValue(name, [...imageuris, uri])
    }
    const handleRemove = uri => {
        console.log(uri, "uri2");
        setFieldValue(name, imageuris.filter((imageuri) => imageuri !== uri))
    }
    return (
        <>

            <ImageInputList imageuris={imageuris} onAddImage={handleAdd} onRemoveImage={handleRemove} />
            <ErrorMessage visible={touched[name]} error={errors[name]} />
        </>
    );
}

export default FormImagePicker;