import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/authApi";

export default function Admin() {
    const { isAdmin } = useSelector((state) => state.auth);


    const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleRegister = async () => {
        try {
            const result = await registerApi({ email: regEmail, password: regPassword, role: "EMPLOYEE" }).unwrap();
            Alert.alert("Success", result.message || "User registered successfully");
            setRegEmail("");
            setRegPassword("");
        } catch (err) {
            Alert.alert("Error", err.data?.message || "Registration failed");
        }
    };

    return (
        <ScrollView className="flex-1 bg-binance-bg pb-10">
            <View className="pt-14 px-5 pb-6 border-b border-binance-lightGray bg-binance-bg">
                <Text className="text-2xl font-bold text-binance-text font-sans">Management</Text>
                <Text className="text-binance-gray font-sans text-xs mt-1">Workforce control center</Text>
            </View>

            <View className="p-5">
                <View className="bg-binance-surface p-6 rounded-2xl border border-binance-lightGray shadow-sm">
                    <Text className="text-lg font-bold mb-6 text-binance-text font-sans">Register Employee</Text>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase">Email Address</Text>
                            <TextInput
                                placeholder="Enter email"
                                placeholderTextColor="#707A8A"
                                className="bg-binance-bg p-3 rounded-lg text-binance-text font-sans border border-binance-lightGray"
                                value={regEmail}
                                onChangeText={setRegEmail}
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase">Temporary Password</Text>
                            <TextInput
                                placeholder="Enter password"
                                placeholderTextColor="#707A8A"
                                className="bg-binance-bg p-3 rounded-lg text-binance-text font-sans border border-binance-lightGray"
                                secureTextEntry
                                value={regPassword}
                                onChangeText={setRegPassword}
                            />
                        </View>

                        <View className="mt-8">
                            {isRegisterLoading ? (
                                <View className="bg-binance-yellow p-4 rounded-lg items-center opacity-70">
                                    <ActivityIndicator color="#1E2329" />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    className="bg-binance-yellow p-4 rounded-lg items-center shadow-sm"
                                >
                                    <Text className="text-binance-text font-bold font-sans">Create Account</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <View className="mt-8 space-y-3">
                    <TouchableOpacity className="flex-row items-center justify-between p-4 bg-binance-surface rounded-xl border border-binance-lightGray mb-6">
                        <View className="flex-row items-center">
                            <Ionicons name="people" size={20} color="#1E2329" />
                            <Text className="ml-3 font-bold text-binance-text font-sans text-sm">Employee List</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#707A8A" />
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-row items-center justify-between p-4 bg-binance-surface rounded-xl border border-binance-lightGray">
                        <View className="flex-row items-center">
                            <Ionicons name="document-text" size={20} color="#1E2329" />
                            <Text className="ml-3 font-bold text-binance-text font-sans text-sm">Shift Reports</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#707A8A" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
