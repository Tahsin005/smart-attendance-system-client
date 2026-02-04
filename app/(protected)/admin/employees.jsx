import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, View } from "react-native";
import { useGetEmployeesQuery } from "../../../redux/api/adminApi";

export default function Employees() {
    const [search, setSearch] = useState("");
    const { data, isLoading, refetch, isFetching } = useGetEmployeesQuery({ email: search });

    const employees = data?.success ? data.data : [];

    const renderEmployee = ({ item }) => (
        <View className="bg-binance-surface p-4 rounded-xl border border-binance-lightGray mb-3 shadow-sm">
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 rounded-full bg-binance-bg items-center justify-center border border-binance-lightGray">
                        <Ionicons name="person" size={20} color="#707A8A" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="text-binance-text font-bold font-sans text-sm" numberOfLines={1}>
                            {item.email}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <View className="bg-binance-yellow/10 px-2 py-0.5 rounded">
                                <Text className="text-binance-yellow text-[10px] font-bold uppercase">
                                    {item.role}
                                </Text>
                            </View>
                            <Text className="text-binance-gray text-[10px] ml-2 font-sans">
                                Joined {new Date(item.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#707A8A" />
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-binance-bg">
                <ActivityIndicator color="#F0B90B" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-binance-bg">
            <View className="pt-14 px-5 pb-6 border-b border-binance-lightGray bg-binance-bg">
                <Text className="text-2xl font-bold text-binance-text font-sans">Employee List</Text>
                <Text className="text-binance-gray font-sans text-xs mt-1">View and manage your workforce</Text>
            </View>

            <View className="px-5 pt-4">
                <View className="flex-row items-center bg-binance-surface border border-binance-lightGray rounded-xl px-3 py-2">
                    <Ionicons name="search" size={18} color="#707A8A" />
                    <TextInput
                        className="flex-1 ml-2 text-binance-text font-sans text-sm"
                        placeholder="Search by email"
                        placeholderTextColor="#707A8A"
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="none"
                    />
                    {search !== "" && (
                        <Ionicons name="close-circle" size={18} color="#707A8A" onPress={() => setSearch("")} />
                    )}
                </View>
            </View>

            <FlatList
                data={employees}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEmployee}
                contentContainerClassName="p-5"
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Ionicons name="people-outline" size={64} color="#707A8A" className="opacity-20" />
                        <Text className="text-binance-gray font-sans mt-4">No employees found</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#F0B90B" />
                }
            />
        </View>
    );
}
