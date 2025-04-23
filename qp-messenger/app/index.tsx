
import { Redirect } from "expo-router";

const Home = () => {
    const isSignedIn = false; // Replace with your actual authentication logic

    if (isSignedIn) {
        return <Redirect href={'/(tabs)'} />
    }

    return <Redirect href="/(auth)/login" />

}

export default Home;