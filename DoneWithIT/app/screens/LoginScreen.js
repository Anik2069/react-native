import React, { useState } from 'react';
import Screen from '../components/Screen';
import { Image, StyleSheet } from 'react-native';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { Formik } from 'formik';
import * as  Yup from 'yup';
import AppText from '../components/AppText';
import color from '../config/color';
import ErrorMessage from '../components/ErrorMessage';
const validatorSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
})

function LoginScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    return (
        <Screen style={styles.container}>
            <Image style={styles.logo} source={require("../assets/logo-red.png")} />

            <Formik
                initialValues={{ email: "", passsword: "" }}
                onSubmit={values => navigation.navigate("Listings")}

                validationSchema={validatorSchema}
            >
                {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
                    <>
                        <AppTextInput placeholder="Email" icon={"email"}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            // onChangeText={text => setEmail(text)}
                            onBlur={() => setFieldTouched("email")}
                            onChangeText={handleChange("email")}
                        />
                        <ErrorMessage visible={touched.email} error={errors.email} />
                        <AppTextInput placeholder="Password"
                            icon={"lock"}
                            autoCapitalize="none"
                            autoCorrect={false} secureTextEntry
                            onChangeText={handleChange("password")}
                        />
                        <ErrorMessage visible={touched.password} error={errors.password} />
                        <AppButton title="Login"
                            onPress={handleSubmit}
                        // onPress={() => console.log(email, passsword, "Login Press")}
                        />
                    </>
                )}

            </Formik>



        </Screen>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: "center",
        marginTop: 50,
        marginBottom: 20
    }
})
export default LoginScreen;