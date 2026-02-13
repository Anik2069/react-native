// import { View, Text, Switch, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { View, Text, Switch, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
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
    const [unitCost, setUnitCost] = useState("");

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
            // formData.append("timer", "0");
            formData.append("timer", timer || "0");
            formData.append("unit_cost", unitCost || "0");

            console.log("Sending FormData:", formData);

            try {
                // Let Axios set the Content-Type with the correct boundary automatically
                const response = await axiosInstance.post("config_update_api.php", formData);

                console.log("Response:", response.data);

                if (response.data) {
                    Alert.alert("Success", "Configuration updated successfully!");
                } else {
                    Alert.alert("Error", "No response data received.");
                }

            } catch (error) {
                console.error("Update Config Error:", error);
                Alert.alert("Error", "Failed to update configuration. Check console for details.");
            }
        } else {
            Alert.alert("Error", "Authentication token not found. Please login again.");
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
            <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 300, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
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
                    <Text className="text-gray-700 mb-1 text-[15px]">Pump ON Level (%)</Text>
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
                    <Text className="text-gray-700 mb-1 text-[15px]">Pump OFF Level (%)</Text>
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

                {/* Unit Price */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1 text-[15px]">Your Unit Price</Text>
                    <TextInput
                        className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                        placeholder="Enter unit price"
                        keyboardType="decimal-pad"
                        // keyboardType="numeric"
                        value={unitCost}
                        onChangeText={setUnitCost}
                    />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    className="bg-green-600 rounded-lg py-3 mb-6"
                    onPress={updateConfig}
                >
                    <Text className="text-white font-semibold text-center text-lg">Save Config</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
