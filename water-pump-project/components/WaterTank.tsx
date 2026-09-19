"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

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
    width = 170,
    height = 260,
    showPercentage = true,
    tankColor = "#f8fafc",
    waterColorStart = "#38bdf8",
    waterColorEnd = "#0284c7",
}) => {
    const clampedPercentage = Math.min(Math.max(Number(percentage) || 0, 0), 100);

    const waterLevelAnim = useRef(new Animated.Value(0)).current;
    const waterHeight = waterLevelAnim.interpolate({
        inputRange: [0, 100],
        outputRange: [0, height],
    });

    useEffect(() => {
        Animated.spring(waterLevelAnim, {
            toValue: clampedPercentage,
            friction: 7,
            tension: 40,
            useNativeDriver: false,
        }).start();
    }, [clampedPercentage]);

    return (
        <View style={styles.outerWrapper}>
            {/* Water Tank Glass Container */}
            <View style={[styles.tankContainer, { width, height }]}>
                {/* Background Tank Cavity */}
                <View style={[styles.tankCavity, { backgroundColor: tankColor }]}>
                    
                    {/* Animated Water Fill */}
                    <Animated.View
                        style={[
                            styles.waterFillContainer,
                            {
                                height: waterHeight,
                                width: width - 8,
                            },
                        ]}
                    >
                        <LinearGradient
                            colors={['#06b6d4', '#0284c7', '#1e3a8a']}
                            style={styles.waterGradient}
                            start={{ x: 0.5, y: 0 }}
                            end={{ x: 0.5, y: 1 }}
                        />
                        {/* Water Surface Wave Line */}
                        <View style={styles.waterSurface} />
                    </Animated.View>

                    {/* Specular Reflection Highlight (Left acrylic sheen) */}
                    <View style={styles.glassReflection} />
                    <View style={styles.glassReflectionThin} />

                    {/* Level Measurement Ticks (Right Side) */}
                    <View style={styles.markerContainer}>
                        {[100, 75, 50, 25, 0].map((level) => (
                            <View 
                                key={level} 
                                style={[
                                    styles.markerRow, 
                                    { bottom: Math.max(4, (height - 20) * (level / 100)) }
                                ]}
                            >
                                <View style={[styles.markerTick, level === 50 || level === 100 ? styles.markerTickMajor : null]} />
                                <Text style={styles.markerLabel}>{level}%</Text>
                            </View>
                        ))}
                    </View>

                    {/* Center Percentage Display */}
                    {showPercentage && (
                        <View style={styles.centerBadgeContainer}>
                            <View style={styles.percentagePill}>
                                <Ionicons name="water" size={18} color="#0284c7" style={{ marginRight: 4 }} />
                                <Text style={styles.percentageNumber}>
                                    {`${Math.round(clampedPercentage)}%`}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Tank Metallic Caps (Top and Base) */}
                <View style={styles.topCap} />
                <View style={styles.bottomCap} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerWrapper: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    tankContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tankCavity: {
        width: '100%',
        height: '100%',
        borderRadius: 24,
        borderWidth: 2.5,
        borderColor: '#cbd5e1',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#f8fafc',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    waterFillContainer: {
        position: 'absolute',
        bottom: 0,
        left: 2,
        borderBottomLeftRadius: 21,
        borderBottomRightRadius: 21,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        overflow: 'hidden',
    },
    waterGradient: {
        width: '100%',
        height: '100%',
    },
    waterSurface: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    glassReflection: {
        position: 'absolute',
        top: 12,
        bottom: 12,
        left: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
    },
    glassReflectionThin: {
        position: 'absolute',
        top: 16,
        bottom: 16,
        left: 20,
        width: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    markerContainer: {
        position: 'absolute',
        right: 8,
        top: 10,
        bottom: 10,
        width: 42,
    },
    markerRow: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
    },
    markerTick: {
        width: 8,
        height: 1.5,
        backgroundColor: '#94a3b8',
        marginRight: 4,
    },
    markerTickMajor: {
        width: 12,
        height: 2,
        backgroundColor: '#64748b',
    },
    markerLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#64748b',
        letterSpacing: -0.2,
    },
    centerBadgeContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentagePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(226, 232, 240, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 5,
    },
    percentageNumber: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    topCap: {
        position: 'absolute',
        top: -4,
        width: '50%',
        height: 8,
        backgroundColor: '#94a3b8',
        borderRadius: 4,
        alignSelf: 'center',
    },
    bottomCap: {
        position: 'absolute',
        bottom: -5,
        width: '60%',
        height: 8,
        backgroundColor: '#64748b',
        borderRadius: 4,
        alignSelf: 'center',
    },
});

export default WaterTank;

