
import { Stack } from 'expo-router'
import React from 'react'

function layout() {

    return (

        <Stack>
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name='wifi-config' options={{ headerShown: false }} />
            <Stack.Screen name='wifi-setup' options={{ headerShown: false }} />
        </Stack>

    )
}

export default layout