import { View, Text, Switch, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import * as SecureStore from "expo-secure-store";

export default function PumpConfigForm() {
    const [isAuto, setIsAuto] = useState(false);
    const [pumpHeight, setPumpHeight] = useState("");
    const [pumpGap, setPumpGap] = useState("");
    const [startLevel, setStartLevel] = useState("");
    const [stopLevel, setStopLevel] = useState("");
    const [timer, setTimer] = useState("");

    const updateConfig = async () => {
        const formData = new FormData();
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            formData.append("token", token);
            formData.append("auto_mode", isAuto ? "1" : "0"); // Convert boolean to 0/1
            formData.append("p_start", startLevel || "");
            formData.append("p_stop", stopLevel || "");
            formData.append("tank_height", pumpHeight || "");
            formData.append("top_gap", pumpGap || "");
            formData.append("timer", "0");
            const response = await axiosInstance.post("config_update_api.php", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
        }

    }

    return (
        <ScrollView className="p-4 ">
            <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Pump Operation Config
            </Text>

            {/* Pump Height */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump Height</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter pump height"
                    keyboardType="numeric"
                    value={pumpHeight}
                    onChangeText={setPumpHeight}
                />
            </View>

            {/* Pump Gap */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump Gap Between Sensors</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter pump gap"
                    keyboardType="numeric"
                    value={pumpGap}
                    onChangeText={setPumpGap}
                />
            </View>

            {/* Pump Start Level */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump Start Level</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter start level"
                    keyboardType="numeric"
                    value={startLevel}
                    onChangeText={setStartLevel}
                />
            </View>

            {/* Pump Stop Level */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump Stop Level</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter stop level"
                    keyboardType="numeric"
                    value={stopLevel}
                    onChangeText={setStopLevel}
                />
            </View>

            {/* Automatic Pump */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-gray-700 text-[15px]">Automatic Pump</Text>
                <Switch
                    value={isAuto}
                    onValueChange={setIsAuto}
                    trackColor={{ false: "#d1d5db", true: "#4ade80" }}
                    thumbColor={isAuto ? "#16a34a" : "#f3f4f6"}
                />
            </View>

            {isAuto && (
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1 text-[15px]">Timer</Text>
                    <TextInput
                        className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                        placeholder="Enter Timer"
                        keyboardType="numeric"
                        value={timer}
                        onChangeText={setTimer}
                    />
                </View>
            )}

            {/* Save Button */}
            <TouchableOpacity
                className="bg-green-600 rounded-lg py-3 mb-6"
                onPress={updateConfig}
            >
                <Text className="text-white font-semibold text-center text-lg">Save Config</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
