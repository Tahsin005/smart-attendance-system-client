import ActionButton from "@/components/ActionButton";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

export default function Home() {
    const { user, isAdmin } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    return (
        <ScrollView className="flex-1 bg-binance-bg pb-10">
            <View className="pt-14 px-5 bg-binance-bg pb-6 border-b border-binance-lightGray">
                <View className="flex-row items-center justify-between mb-6">
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-full bg-binance-lightGray items-center justify-center">
                            <Ionicons name="person" size={16} color="#707A8A" />
                        </View>
                        <Text className="ml-3 text-binance-text font-sans font-bold text-sm">{user?.email}</Text>
                    </View>
                    <View className="flex-row space-x-4">
                        <TouchableOpacity onPress={() => dispatch(logout())}>
                            <Ionicons name="log-out-outline" size={24} color="#707A8A" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View className="flex-row px-5 pt-6 pb-2 border-b border-binance-lightGray bg-binance-bg">
                <ActionButton icon="location" label="Scan" primary />
            </View>

            <View className="px-5 mt-6">
                <View className="bg-binance-yellow/20 p-4 rounded-xl flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <Ionicons name="megaphone" size={20} color="#F0B90B" />
                        <Text className="ml-3 text-binance-text font-sans font-bold text-xs flex-1">Shift starts in 2 hours. Be prepared!</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#F0B90B" />
                </View>
            </View>

            <View className="px-5 mt-6 space-y-4">
                <View className="flex-row space-x-4">
                    <View className="flex-1 bg-binance-surface p-4 rounded-2xl border border-binance-lightGray">
                        <Text className="text-binance-gray text-xs font-sans">Today's Start</Text>
                        <Text className="text-xl font-bold text-binance-text font-sans mt-2">09:00 AM</Text>
                        <View className="flex-row items-center mt-2">
                            <Ionicons name="trending-up" size={12} color="#10b981" />
                            <Text className="text-[#10b981] text-[10px] font-bold ml-1">On Time</Text>
                        </View>
                    </View>
                    <View className="flex-1 bg-binance-surface p-4 rounded-2xl border border-binance-lightGray">
                        <Text className="text-binance-gray text-xs font-sans">Current Status</Text>
                        <Text className="text-xl font-bold text-binance-text font-sans mt-2">ACTIVE</Text>
                        <View className="w-full h-1 bg-binance-lightGray rounded-full mt-3 overflow-hidden">
                            <View className="w-1/2 h-full bg-binance-yellow" />
                        </View>
                    </View>
                </View>

                <View className="bg-binance-surface p-4 rounded-2xl border border-binance-lightGray flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="w-10 h-10 bg-binance-yellow/10 rounded-full items-center justify-center">
                            <Ionicons name="location" size={20} color="#F0B90B" />
                        </View>
                        <View className="ml-3">
                            <Text className="text-binance-text font-bold font-sans">Main Entrance</Text>
                            <Text className="text-binance-gray text-[10px] font-sans">Verified via Terminal A-1</Text>
                        </View>
                    </View>
                    <View className="items-end">
                        <Text className="text-binance-text font-bold font-sans">08:58</Text>
                        <Text className="text-[#10b981] text-[10px] font-bold">SUCCESS</Text>
                    </View>
                </View>
            </View>

            <View className="pb-20" />
        </ScrollView>
    );
}
