import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../redux/api/authApi";
import { logout } from "../../redux/authSlice";

export default function Home() {
    const { user, isAdmin } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleRegister = async () => {
        try {
            await registerApi({ email: regEmail, password: regPassword, role: "EMPLOYEE" }).unwrap();
            Alert.alert("Success", "User registered successfully");
            setRegEmail("");
            setRegPassword("");
        } catch (err) {
            Alert.alert("Error", err.data?.message || "Registration failed");
        }
    };

    const ActionButton = ({ icon, label, primary }) => (
        <View className="items-center mr-6">
            <TouchableOpacity
                className={`w-14 h-14 rounded-full items-center justify-center ${primary ? 'bg-wise-lime' : 'bg-wise-surface'}`}
            >
                <Ionicons name={icon} size={24} color={primary ? "#2E3333" : "#2E3333"} />
            </TouchableOpacity>
            <Text className="mt-2 text-wise-text font-medium text-xs">{label}</Text>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-wise-bg px-5 pt-14">
            <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center">
                    <Text className="text-lg font-bold">{user?.email}</Text>
                </View>
                <TouchableOpacity className="w-10 h-10 bg-wise-surface rounded-full items-center justify-center">
                    <Ionicons name="log-out-outline" onPress={() => dispatch(logout())} size={20} color="#2E3333" />
                </TouchableOpacity>
            </View>

            {/* Action Buttons */}
            <View className="flex-row mb-10">
                <ActionButton icon="location" primary />
                <ActionButton icon="home" />
            </View>

            <View className="bg-wise-surface p-6 rounded-[32px] mb-8 relative">
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 bg-white rounded-full items-center justify-center mr-3">
                        <Ionicons name="time" size={18} color="#253342" />
                    </View>
                    <Text className="text-lg text-wise-text font-bold">Attendance Today</Text>
                </View>
                <Text className="text-wise-text text-4xl font-black mb-1">09:00 AM</Text>
                <Text className="text-wise-text/60 font-medium">Verified via Central Terminal</Text>
                <TouchableOpacity className="absolute top-6 right-6">
                    <Ionicons name="chevron-down" size={24} color="#253342" />
                </TouchableOpacity>
            </View>

            {/* Admin Section */}
            {isAdmin && (
                <View className="mb-20">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-2xl font-bold text-wise-text">Admin Portal</Text>
                        <TouchableOpacity><Text className="text-green-600 font-bold">See all</Text></TouchableOpacity>
                    </View>

                    <View className="bg-white border border-wise-surface p-6 rounded-[32px] shadow-sm">
                        <Text className="text-xl font-bold mb-6 text-wise-text">Register New Employee</Text>
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#94a3b8"
                            className="border border-wise-surface p-4 rounded-2xl bg-wise-surface text-wise-text text-lg mb-4"
                            value={regEmail}
                            onChangeText={setRegEmail}
                            autoCapitalize="none"
                        />
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#94a3b8"
                            className="border border-wise-surface p-4 rounded-2xl bg-wise-surface text-wise-text text-lg mb-6"
                            secureTextEntry
                            value={regPassword}
                            onChangeText={setRegPassword}
                        />

                        {isRegisterLoading ? (
                            <View className="bg-wise-lime p-5 rounded-full items-center">
                                <ActivityIndicator color="#2E3333" />
                            </View>
                        ) : (
                            <TouchableOpacity
                                onPress={handleRegister}
                                className="bg-wise-lime p-5 rounded-full items-center shadow-sm"
                            >
                                <Text className="text-wise-dark font-bold text-lg text-center">Register Employee</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </ScrollView>
    );
}
