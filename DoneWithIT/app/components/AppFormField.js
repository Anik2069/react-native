import React from 'react';
import AppTextInput from './AppTextInput';
import ErrorMessage from './ErrorMessage';
import { useFormikContext } from 'formik';

function AppFormField({ name, ...otherProps }) {
    const { setFieldTouched, handleChange, errors, touched } = useFormikContext()
    return (
        <>
            <AppTextInput
                // placeholder={name}
                // icon={"email"}
                // autoCapitalize="none"
                // autoCorrect={false}
                // keyboardType="email-address"
                // onChangeText={text => setEmail(text)}
                onBlur={() => setFieldTouched(name)}
                onChangeText={handleChange(name)}
                {...otherProps}
            />
            <ErrorMessage visible={touched[name]} error={errors[name]} />
        </>
    );
}

export default AppFormField;