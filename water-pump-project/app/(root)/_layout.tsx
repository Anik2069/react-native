
import { Stack } from 'expo-router'
import React from 'react'

function layout() {

    return (

        <Stack>
            <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        </Stack>

    )
}

export default layout