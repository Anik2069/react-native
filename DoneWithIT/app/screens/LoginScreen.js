import React, { useContext, useState } from 'react';
import Screen from '../components/Screen';
import { Image, StyleSheet } from 'react-native';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import { Formik } from 'formik';
import * as  Yup from 'yup';
import AppText from '../components/AppText';
import color from '../config/color';
import ErrorMessage from '../components/ErrorMessage';
import AppForm from '../components/AppForm';
import AppFormField from '../components/AppFormField';
import SubmitButton from '../components/SubmitButton';
import auth from '../api/auth';
import { jwtDecode } from "jwt-decode";
import AuthContext from '../auth/context';
import storage from '../auth/storage';

const validatorSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().min(4).label("Password"),
})

function LoginScreen({ navigation }) {
    const [loginFailed, setLoginFailed] = useState();

    const authContext = useContext(AuthContext);

    const handleSubmit = async ({ email, password }) => {
        const result = await auth.login(email, password);
        console.log(result);
        if (!result.ok) {
            return setLoginFailed(true)
        }

        setLoginFailed(false)
        const user = jwtDecode(result.data);
        // console.log(user);
        authContext.setUser(user);
        storage.storeToken(result.data);
    }

    return (
        <Screen style={styles.container}>
            <Image style={styles.logo} source={require("../assets/logo-red.png")} />

            <AppForm
                initialValues={{ email: "", passsword: "" }}
                onSubmit={handleSubmit}

                validationSchema={validatorSchema}
            >
                <ErrorMessage error="Invalid email or Password" visible={loginFailed} />
                <AppFormField
                    placeholder="Email"
                    icon={"email"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    // onChangeText={text => setEmail(text)}
                    name={"email"}
                />
                <AppFormField
                    placeholder="Password"
                    icon={"lock"}
                    autoCapitalize="none"
                    autoCorrect={false}
                    // onChangeText={text => setEmail(text)}
                    name={"password"}
                />

                <SubmitButton title="login" />



            </AppForm>



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