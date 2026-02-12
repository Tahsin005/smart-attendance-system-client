import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGetEmployeesQuery } from "../../../redux/api/adminApi";

export default function Employees() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const { data, isLoading, refetch, isFetching } = useGetEmployeesQuery({ email: search });

    const employees = data?.success ? data.data : [];

    const renderEmployee = useCallback(({ item, index }) => (
        <View>
            <TouchableOpacity
                onPress={() => {
                    Haptics.selectionAsync();
                    router.push({
                        pathname: "/(protected)/admin/work-sessions",
                        params: { userId: item.id, email: item.email }
                    });
                }}
                activeOpacity={0.8}
                className="bg-binance-surface p-5 rounded-[28px] border border-binance-lightGray/30 mb-4 shadow-sm"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 rounded-2xl bg-binance-lightGray/10 items-center justify-center border border-binance-lightGray/5">
                            <Ionicons name="person-outline" size={22} color="#707A8A" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-binance-text font-bold font-sans text-base tracking-tight" numberOfLines={1}>
                                {item.email}
                            </Text>
                            <View className="flex-row items-center mt-1.5">
                                <View className="bg-binance-yellow/10 px-2.5 py-0.5 rounded-lg border border-binance-yellow/5">
                                    <Text className="text-binance-yellow text-[10px] font-bold uppercase tracking-widest">
                                        {item.role}
                                    </Text>
                                </View>
                                <Text className="text-binance-gray text-[10px] ml-3 font-sans font-bold opacity-40 uppercase tracking-tighter">
                                    Since {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className="w-8 h-8 rounded-full bg-binance-lightGray/5 items-center justify-center border border-binance-lightGray/5">
                        <Ionicons name="chevron-forward" size={14} color="#707A8A" />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    ), [router]);

    const handleSearch = useCallback((text) => {
        setSearch(text);
    }, []);

    const handleClearSearch = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSearch("");
    }, []);

    const handleRefresh = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        refetch();
    }, [refetch]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-binance-bg">
                <ActivityIndicator color="#F0B90B" size="large" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-binance-bg">
            <View
                className="pt-14 px-6 pb-8 border-b border-binance-lightGray/10 bg-binance-bg"
            >
                <Text className="text-3xl font-bold text-binance-text font-sans tracking-tight">Employee Registry</Text>
                <Text className="text-binance-gray font-sans text-sm mt-1 opacity-70">Monitor and manage access lifecycle</Text>
            </View>

            <View
                className="px-6 pt-6 mb-2"
            >
                <View className="flex-row items-center bg-binance-surface border border-binance-lightGray/30 rounded-[20px] px-4 py-3.5 shadow-sm">
                    <Ionicons name="search-outline" size={20} color="#707A8A" />
                    <TextInput
                        className="flex-1 ml-3 text-binance-text font-sans text-base tracking-tight"
                        placeholder="Search identities..."
                        placeholderTextColor="#707A8A"
                        value={search}
                        onChangeText={handleSearch}
                        autoCapitalize="none"
                    />
                    {search !== "" && (
                        <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
                            <Ionicons name="close-circle" size={20} color="#707A8A" className="opacity-60" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <FlatList
                data={employees}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEmployee}
                contentContainerClassName="px-6 pt-4 pb-10"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View
                        className="items-center justify-center py-20"
                    >
                        <View className="w-20 h-20 bg-binance-lightGray/10 rounded-[32px] items-center justify-center mb-6">
                            <Ionicons name="people-outline" size={32} color="#707A8A" className="opacity-40" />
                        </View>
                        <Text className="text-binance-gray font-bold font-sans text-base opacity-60">No identities match your query</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={handleRefresh}
                        tintColor="#F0B90B"
                        colors={["#F0B90B"]}
                    />
                }
            />
        </View>
    );
}
