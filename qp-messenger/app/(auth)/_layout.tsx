import { Stack } from 'expo-router'
import React from 'react'

function _layout() {
    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />

        </Stack>
    )
}

export default _layout
