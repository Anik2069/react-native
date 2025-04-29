"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

interface WaterTankProps {
    percentage: number // 0-100
    width?: number
    height?: number
    showPercentage?: boolean
    tankColor?: string
    waterColorStart?: string
    waterColorEnd?: string
}

const WaterTank: React.FC<WaterTankProps> = ({
    percentage,
    width = 150,
    height = 250,
    showPercentage = true,
    tankColor = "#e0e0e0",
    waterColorStart = "#4fc3f7",
    waterColorEnd = "#0288d1",
}) => {
    const clampedPercentage = Math.min(Math.max(percentage, 0), 100)

    const waterLevelAnim = useRef(new Animated.Value(0)).current
    const waterHeight = waterLevelAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [0, height],
    })

    useEffect(() => {
        Animated.timing(waterLevelAnim, {
            toValue: clampedPercentage,
            duration: 1000,
            useNativeDriver: false,
        }).start()
    }, [clampedPercentage])

    return (
        <View style={[styles.container, { width, height }]}>
            <View style={[styles.tank, { width, height, backgroundColor: tankColor }]}>
                <Animated.View
                    style={[
                        styles.waterContainer,
                        {
                            height: waterHeight,
                            width: width - 10,
                            bottom: 0,
                        },
                    ]}
                >
                    <LinearGradient
                        colors={[waterColorStart, waterColorEnd]}
                        style={styles.water}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                    />
                </Animated.View>

                {showPercentage && (
                    <View style={styles.percentageContainer}>
                        <Text style={styles.percentageText}>{`${Math.round(clampedPercentage)}%`}</Text>
                    </View>
                )}

                <View style={styles.markers}>
                    {[0, 25, 50, 75, 100].map((level) => (
                        <View key={level} style={[styles.marker, { bottom: (height * (level / 100)) }]}>
                            <Text style={styles.markerText}>{level}%</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    tank: {
        borderRadius: 10,
        borderWidth: 3,
        borderColor: "#9e9e9e",
        overflow: "hidden",
        position: "relative",
    },
    waterContainer: {
        position: "absolute",
        left: 2,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        overflow: "hidden",
    },
    water: {
        width: "100%",
        height: "100%",
    },
    percentageContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    percentageText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#000",
        textShadowColor: "rgba(255, 255, 255, 0.7)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    markers: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 30,
    },
    marker: {
        position: "absolute",
        right: 5,
        width: 20,
        height: 1,
        backgroundColor: "#9e9e9e",
    },
    markerText: {
        position: "absolute",
        right: 0,
        fontSize: 8,
        color: "#616161",
        top: -7,
    },
})

export default WaterTank
