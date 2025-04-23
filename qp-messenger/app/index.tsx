
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

const Home = () => {
    const [isTokenChecked, setIsTokenChecked] = useState(false);
    const [hasToken, setHasToken] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkToken = async () => {
            try {
                const token = await SecureStore.getItemAsync("token");
                console.log(token, "token");
                if (token) {
                    setHasToken(true);
                }
            } catch (error) {
                console.error("Error retrieving token:", error);
            } finally {
                setIsTokenChecked(true);
            }
        };

        checkToken();
    }, []);

    // Wait until token check is complete
    if (!isTokenChecked) {
        return null; // Optionally, you can show a loading indicator here
    }

    if (hasToken) {
        return <Redirect href={'/(tabs)'} />
    }

    return <Redirect href="/(auth)/login" />

}

export default Home;