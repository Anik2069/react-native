import React from 'react';
import color from '../config/color';

function AppButton({ title }) {
    return (
        <View styles={styles.button}>
            <Text styles={styles.text}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundCOlor: color.primary,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        width: '100%'
    },
    text: {
        color: color.white,
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: bold
    }
})

export default AppButton;