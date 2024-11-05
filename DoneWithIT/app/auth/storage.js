import * as SecureStore from "expo-secure-store";

const key = "authToken";

const storeToken = async authToken => {
    try {
        SecureStore.setItemAsync(key, authToken);

    } catch (error) {
        console.log("mara");
    }
}


const getToken = async () => {
    try {
        return await SecureStore.getItemAsync(key);

    } catch (error) {
        console.log("mara");
    }
}



const removeToken = async () => {
    try {
        return await SecureStore.deleteItemAsync(key);

    } catch (error) {
        console.log("mara");
    }
}


export default { getToken, storeToken, removeToken }