
import { Stack } from 'expo-router'
import React from 'react'

function layout() {

    return (

        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>

    )
}

export default layout