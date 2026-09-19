import React, { useState, useEffect } from "react";
import { View, Text, Switch, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "@/lib/axios";
import * as SecureStore from "expo-secure-store";

interface PumpConfigFormProps {
    onUpdate?: () => void;
}

export default function PumpConfigForm({ onUpdate }: PumpConfigFormProps) {
    const [isAuto, setIsAuto] = useState(false);
    const [pumpHeight, setPumpHeight] = useState("");
    const [pumpGap, setPumpGap] = useState("");
    const [startLevel, setStartLevel] = useState("");
    const [stopLevel, setStopLevel] = useState("");
    const [timer, setTimer] = useState("");
    const [unitCost, setUnitCost] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = await SecureStore.getItemAsync("token");
                if (token) {
                    const formData = new FormData();
                    formData.append("token", token);
                    const response = await axiosInstance.post("fetch_config_api.php", formData);

                    if (response.data && response.data.status !== "error") {
                        const data = response.data.data || response.data;
                        setPumpHeight(data.tank_height != null ? String(data.tank_height) : "");
                        setPumpGap(data.top_gap != null ? String(data.top_gap) : "");
                        setStartLevel(data.p_start != null ? String(data.p_start) : "");
                        setStopLevel(data.p_stop != null ? String(data.p_stop) : "");
                        setTimer(data.timer != null ? String(data.timer) : "");
                        setUnitCost(data.unit_cost != null ? String(data.unit_cost) : "");
                        setIsAuto(data.auto_mode === "1" || data.auto_mode === 1);
                    }
                }
            } catch (error) {
                console.error("Fetch Config Error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const updateConfig = async () => {
        // Basic validation
        if (startLevel && stopLevel && Number(startLevel) >= Number(stopLevel)) {
            Alert.alert("Configuration Alert", "Pump ON level must be lower than Pump OFF level.");
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
                Alert.alert("Authentication Error", "Please login again.");
                return;
            }

            const formData = new FormData();
            formData.append("token", token);
            formData.append("auto_mode", isAuto ? "1" : "0");
            formData.append("p_start", startLevel || "0");
            formData.append("p_stop", stopLevel || "100");
            formData.append("tank_height", pumpHeight || "0");
            formData.append("top_gap", pumpGap || "0");
            formData.append("timer", timer || "0");
            formData.append("unit_cost", unitCost || "0");

            const response = await axiosInstance.post("config_update_api.php", formData);

            if (response.data) {
                Alert.alert("Settings Saved", "Pump controller configuration successfully updated.");
                if (onUpdate) onUpdate();
            } else {
                Alert.alert("Error", "No response received from controller.");
            }
        } catch (error) {
            console.error("Update Config Error:", error);
            Alert.alert("Error", "Failed to update configuration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View className="py-12 items-center justify-center">
                <ActivityIndicator size="large" color="#0284c7" />
                <Text className="text-xs font-semibold text-slate-400 mt-3">Loading controller settings...</Text>
            </View>
        );
    }

    return (
        <View className="space-y-4">
            {/* 1. Hero Automation Switch Card */}
            <View 
                className={`p-4 rounded-2xl border transition-all ${
                    isAuto 
                        ? 'bg-emerald-50/80 border-emerald-300 shadow-sm shadow-emerald-100' 
                        : 'bg-slate-50 border-slate-200'
                }`}
            >
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center flex-1 mr-3">
                        <View 
                            className={`w-11 h-11 rounded-xl items-center justify-center mr-3 ${
                                isAuto ? 'bg-emerald-500 shadow-md shadow-emerald-200' : 'bg-slate-200'
                            }`}
                        >
                            <Ionicons 
                                name={isAuto ? "sync" : "power-outline"} 
                                size={22} 
                                color={isAuto ? "#ffffff" : "#64748b"} 
                            />
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-center">
                                <Text className="text-sm font-extrabold text-slate-900">
                                    Automatic Control
                                </Text>
                                <View className={`ml-2 px-2 py-0.5 rounded-full ${isAuto ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                                    <Text className={`text-[10px] font-bold ${isAuto ? 'text-emerald-700' : 'text-slate-600'}`}>
                                        {isAuto ? 'ACTIVE' : 'OFF'}
                                    </Text>
                                </View>
                            </View>
                            <Text className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {isAuto 
                                    ? "Automatic pumping based on water level triggers" 
                                    : "Manual control only — triggers disabled"}
                            </Text>
                        </View>
                    </View>

                    <Switch
                        value={isAuto}
                        onValueChange={setIsAuto}
                        trackColor={{ false: "#cbd5e1", true: "#10b981" }}
                        thumbColor={isAuto ? "#ffffff" : "#f8fafc"}
                    />
                </View>
            </View>

            {/* 2. Reservoir Geometry Section */}
            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mt-3">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="cube-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
                    <Text className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Reservoir Dimensions
                    </Text>
                </View>

                <View className="flex-row space-x-3">
                    {/* Tank Height */}
                    <View className="flex-1 mr-1.5">
                        <Text className="text-[11px] font-bold text-slate-600 mb-1 ml-0.5">Tank Height</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="resize-outline" size={15} color="#0284c7" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 200"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={pumpHeight}
                                onChangeText={setPumpHeight}
                            />
                            <Text className="text-[11px] font-bold text-slate-400">cm</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Total tank depth</Text>
                    </View>

                    {/* Sensor Gap */}
                    <View className="flex-1 ml-1.5">
                        <Text className="text-[11px] font-bold text-slate-600 mb-1 ml-0.5">Top Sensor Gap</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="arrow-down-outline" size={15} color="#6366f1" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 15"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={pumpGap}
                                onChangeText={setPumpGap}
                            />
                            <Text className="text-[11px] font-bold text-slate-400">cm</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Sensor to max water</Text>
                    </View>
                </View>
            </View>

            {/* 3. Water Level Triggers */}
            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mt-3">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="water-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
                    <Text className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Water Level Triggers
                    </Text>
                </View>

                <View className="flex-row space-x-3">
                    {/* Pump Start Level (ON) */}
                    <View className="flex-1 mr-1.5">
                        <View className="flex-row items-center justify-between mb-1 ml-0.5">
                            <Text className="text-[11px] font-bold text-slate-600">Start Pump</Text>
                            <View className="bg-emerald-100 px-1.5 py-0.2 rounded">
                                <Text className="text-[9px] font-extrabold text-emerald-700">TURN ON</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center bg-white border border-emerald-300 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="play" size={14} color="#10b981" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 20"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={startLevel}
                                onChangeText={setStartLevel}
                            />
                            <Text className="text-[11px] font-bold text-emerald-600">%</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Start when below</Text>
                    </View>

                    {/* Pump Stop Level (OFF) */}
                    <View className="flex-1 ml-1.5">
                        <View className="flex-row items-center justify-between mb-1 ml-0.5">
                            <Text className="text-[11px] font-bold text-slate-600">Stop Pump</Text>
                            <View className="bg-rose-100 px-1.5 py-0.2 rounded">
                                <Text className="text-[9px] font-extrabold text-rose-700">TURN OFF</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center bg-white border border-rose-300 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="stop" size={14} color="#f43f5e" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 95"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={stopLevel}
                                onChangeText={setStopLevel}
                            />
                            <Text className="text-[11px] font-bold text-rose-600">%</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Stop when reaches</Text>
                    </View>
                </View>
            </View>

            {/* 4. Limits & Billing */}
            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mt-3">
                <View className="flex-row items-center mb-3">
                    <Ionicons name="shield-checkmark-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
                    <Text className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Operational Safety & Billing
                    </Text>
                </View>

                <View className="flex-row space-x-3">
                    {/* Max Timer */}
                    <View className="flex-1 mr-1.5">
                        <Text className="text-[11px] font-bold text-slate-600 mb-1 ml-0.5">Safety Timer</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="time-outline" size={15} color="#f59e0b" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 1800"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numeric"
                                value={timer}
                                onChangeText={setTimer}
                            />
                            <Text className="text-[11px] font-bold text-slate-400">sec</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Max continuous run</Text>
                    </View>

                    {/* Unit Cost */}
                    <View className="flex-1 ml-1.5">
                        <Text className="text-[11px] font-bold text-slate-600 mb-1 ml-0.5">Electricity Rate</Text>
                        <View className="flex-row items-center bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm">
                            <Ionicons name="flash-outline" size={15} color="#059669" style={{ marginRight: 6 }} />
                            <TextInput
                                className="flex-1 text-slate-800 text-sm font-bold p-0"
                                placeholder="e.g. 8.5"
                                placeholderTextColor="#94a3b8"
                                keyboardType="decimal-pad"
                                value={unitCost}
                                onChangeText={setUnitCost}
                            />
                            <Text className="text-[11px] font-bold text-slate-400">BDT</Text>
                        </View>
                        <Text className="text-[10px] text-slate-400 mt-1 ml-0.5">Per unit cost</Text>
                    </View>
                </View>
            </View>

            {/* 5. Save Configuration Button */}
            <TouchableOpacity
                activeOpacity={0.8}
                disabled={isSubmitting}
                className={`py-4 rounded-2xl flex-row justify-center items-center shadow-lg mt-4 ${
                    isSubmitting 
                        ? 'bg-slate-300 shadow-none' 
                        : 'bg-sky-600 active:bg-sky-700 shadow-sky-200'
                }`}
                onPress={updateConfig}
            >
                {isSubmitting ? (
                    <ActivityIndicator size="small" color="#ffffff" style={{ marginRight: 8 }} />
                ) : (
                    <Ionicons name="save" size={18} color="#ffffff" style={{ marginRight: 8 }} />
                )}
                <Text className="text-white font-extrabold text-sm tracking-wide">
                    {isSubmitting ? "Saving Configuration..." : "Save Configuration"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
