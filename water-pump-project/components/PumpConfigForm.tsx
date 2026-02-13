import { View, Text, Switch, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import * as SecureStore from "expo-secure-store";

export default function PumpConfigForm({ onUpdate }: { onUpdate?: () => void }) {
    const [isAuto, setIsAuto] = useState(false);
    const [pumpHeight, setPumpHeight] = useState("");
    const [pumpGap, setPumpGap] = useState("");
    const [startLevel, setStartLevel] = useState("");
    const [stopLevel, setStopLevel] = useState("");
    const [timer, setTimer] = useState("");
    const [unitCost, setUnitCost] = useState("");
    const [fetchedData, setFetchedData] = useState<any>(null); // Store raw API data (for form population only now)

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = await SecureStore.getItemAsync("token");
                if (token) {
                    const formData = new FormData();
                    formData.append("token", token);
                    const response = await axiosInstance.post("fetch_config_api.php", formData);

                    console.log("Fetched Config Data (Form):", response.data);

                    if (response.data) {
                        const data = response.data;
                        setFetchedData(data); // Save raw data for display

                        // Populate form fields
                        setPumpHeight(data.tank_height ? data.tank_height.toString() : "");
                        setPumpGap(data.top_gap ? data.top_gap.toString() : "");
                        setStartLevel(data.p_start ? data.p_start.toString() : "");
                        setStopLevel(data.p_stop ? data.p_stop.toString() : "");
                        setTimer(data.timer ? data.timer.toString() : "");
                        setUnitCost(data.unit_cost ? data.unit_cost.toString() : "");
                        setIsAuto(data.auto_mode == "1");
                    }
                }
            } catch (error) {
                console.error("Fetch Config Error:", error);
            }
        };

        fetchConfig();
    }, []);

    const updateConfig = async () => {
        const formData = new FormData();
        const token = await SecureStore.getItemAsync("token");
        if (token) {
            formData.append("token", token);
            formData.append("auto_mode", isAuto ? "1" : "0");
            formData.append("p_start", startLevel || "");
            formData.append("p_stop", stopLevel || "");
            formData.append("tank_height", pumpHeight || "");
            formData.append("top_gap", pumpGap || "");
            formData.append("timer", timer || "0");
            formData.append("unit_cost", unitCost || "0");

            console.log("Sending FormData:", formData);

            try {
                const response = await axiosInstance.post("config_update_api.php", formData);

                console.log("Response:", response.data);

                if (response.data) {
                    Alert.alert("Success", "Configuration updated successfully!");
                    if (onUpdate) onUpdate(); // Notify parent
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
        <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Pump Operation Config
            </Text>

            {/* Pump Height */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Tank Height (cm)</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter Tank Height"
                    keyboardType="numeric"
                    value={pumpHeight}
                    onChangeText={setPumpHeight}
                />
            </View>

            {/* Pump Gap */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Sensor Gap Between Water (cm)</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter Sensor Gap"
                    keyboardType="numeric"
                    value={pumpGap}
                    onChangeText={setPumpGap}
                />
            </View>

            {/* Pump Start Level */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump ON Level (0-100)%</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter Pump ON Level"
                    keyboardType="numeric"
                    value={startLevel}
                    onChangeText={setStartLevel}
                />
            </View>

            {/* Pump Stop Level */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Pump OFF Level (0-100)%</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter Pump OFF Level"
                    keyboardType="numeric"
                    value={stopLevel}
                    onChangeText={setStopLevel}
                />
            </View>

            {/* Automatic Mode Control */}
            <View className="flex-row justify-between items-center mb-6">
                <Text className="text-gray-700 text-[15px]">Automatic Mode Control</Text>
                <Switch
                    value={isAuto}
                    onValueChange={setIsAuto}
                    trackColor={{ false: "#d1d5db", true: "#4ade80" }}
                    thumbColor={isAuto ? "#16a34a" : "#f3f4f6"}
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-700 mb-1 text-[15px]">Timer (sec)</Text>
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
                <Text className="text-gray-700 mb-1 text-[15px]">Your Unit Price (BDT)</Text>
                <TextInput
                    className="w-full rounded-md p-4 text-[15px] border border-gray-300"
                    placeholder="Enter unit price"
                    keyboardType="decimal-pad"
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
        </View>
    );
}
