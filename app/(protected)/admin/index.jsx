import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../../../redux/api/authApi";


export default function Admin() {
    const { isAdmin } = useSelector((state) => state.auth);
    const router = useRouter();


    const [registerApi, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleRegister = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        try {
            const result = await registerApi({ email: regEmail, password: regPassword, role: "EMPLOYEE" }).unwrap();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", result.message || "User registered successfully");
            setRegEmail("");
            setRegPassword("");
        } catch (err) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", err.data?.message || "Registration failed");
        }
    };

    const handleNav = useCallback((path) => {
        Haptics.selectionAsync();
        router.push(path);
    }, [router]);

    return (
        <ScrollView className="flex-1 bg-binance-bg pb-10" showsVerticalScrollIndicator={false}>
            <View
                className="pt-14 px-6 pb-8 border-b border-binance-lightGray/10 bg-binance-bg"
            >
                <Text className="text-3xl font-bold text-binance-text font-sans tracking-tight">Management</Text>
                <Text className="text-binance-gray font-sans text-sm mt-1 opacity-70">Workforce control & administrative center</Text>
            </View>

            <View className="px-6 py-8">
                {/* Registration Card */}
                <View
                    className="bg-binance-surface p-7 rounded-[32px] border border-binance-lightGray/30 shadow-sm"
                >
                    <View className="flex-row items-center mb-6">
                        <View className="w-10 h-10 bg-binance-yellow/10 rounded-2xl items-center justify-center mr-4">
                            <Ionicons name="person-add" size={20} color="#F0B90B" />
                        </View>
                        <Text className="text-lg font-bold text-binance-text font-sans tracking-tight">Register Employee</Text>
                    </View>

                    <View className="space-y-5">
                        <View>
                            <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Email Address</Text>
                            <TextInput
                                placeholder="employee@corp.com"
                                placeholderTextColor="#707A8A"
                                className="bg-binance-bg p-4 rounded-2xl text-binance-text font-sans border border-binance-lightGray/20 focus:border-binance-yellow/50"
                                value={regEmail}
                                onChangeText={setRegEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="mt-4">
                            <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Initial Access Code</Text>
                            <TextInput
                                placeholder="••••••••"
                                placeholderTextColor="#707A8A"
                                className="bg-binance-bg p-4 rounded-2xl text-binance-text font-sans border border-binance-lightGray/20 focus:border-binance-yellow/50"
                                secureTextEntry
                                value={regPassword}
                                onChangeText={setRegPassword}
                            />
                        </View>

                        <View className="mt-8">
                            {isRegisterLoading ? (
                                <View className="bg-binance-yellow/50 p-5 rounded-2xl items-center">
                                    <ActivityIndicator color="#1E2329" />
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleRegister}
                                    activeOpacity={0.8}
                                    className="bg-binance-yellow p-5 rounded-2xl items-center shadow-sm"
                                >
                                    <Text className="text-binance-bg font-bold font-sans text-base">Validate & Create</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                {/* Quick Navigation Grid */}
                <View className="mt-10 flex-row flex-wrap justify-between">
                    {[
                        {
                            label: 'Employee List',
                            icon: 'people',
                            path: '/(protected)/admin/employees',
                            desc: 'Manage staff',
                            delay: 400
                        }
                    ].map((item, idx) => (
                        <View
                            key={idx}
                            className="w-full mb-4"
                        >
                            <TouchableOpacity
                                onPress={() => handleNav(item.path)}
                                activeOpacity={0.8}
                                className="bg-binance-surface p-5 rounded-[28px] border border-binance-lightGray/30 shadow-sm"
                            >
                                <View className="w-10 h-10 bg-binance-lightGray/10 rounded-xl items-center justify-center mb-3">
                                    <Ionicons name={item.icon} size={20} color="#707A8A" />
                                </View>
                                <Text className="font-bold text-binance-text font-sans text-sm tracking-tight">{item.label}</Text>
                                <Text className="text-binance-gray text-[10px] mt-1 font-sans opacity-60 uppercase font-bold tracking-widest">{item.desc}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
