import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback } from "react";
import { ActivityIndicator, FlatList, Platform, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useGetUserWorkSessionsQuery } from "../../../redux/api/adminApi";

export default function WorkSessions() {
    const { userId, email } = useLocalSearchParams();
    const router = useRouter();

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const formatParamsDate = (date) => {
        if (!date) return undefined;
        return date.toISOString().split('T')[0];
    };

    const displayDate = (date) => {
        if (!date) return "Select Date";
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const { data, isLoading, refetch, isFetching } = useGetUserWorkSessionsQuery({
        userId,
        startDate: formatParamsDate(startDate),
        endDate: formatParamsDate(endDate)
    });

    const sessions = data?.success ? data.data : [];

    const onStartChange = (event, selectedDate) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) setStartDate(selectedDate);
    };

    const onEndChange = (event, selectedDate) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) setEndDate(selectedDate);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'WORKING': return { color: 'text-binance-yellow', bg: 'bg-binance-yellow/10' };
            case 'COMPLETED': return { color: 'text-[#10b981]', bg: 'bg-[#10b981]/10' };
            case 'NOT_STARTED': return { color: 'text-binance-gray', bg: 'bg-binance-gray/10' };
            default: return { color: 'text-binance-gray', bg: 'bg-binance-gray/10' };
        }
    };

    const renderSession = useCallback(({ item, index }) => {
        const statusConfig = getStatusConfig(item.status);
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push({
                            pathname: "/(protected)/admin/session-details",
                            params: { id: item.id }
                        });
                    }}
                    activeOpacity={0.8}
                    className="bg-binance-surface p-5 rounded-[28px] border border-binance-lightGray/30 mb-4 shadow-sm"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-binance-text font-bold font-sans text-base tracking-tight">
                                {new Date(item.work_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                            <View className="flex-row items-center mt-2.5">
                                <View className={`${statusConfig.bg} px-2.5 py-0.5 rounded-lg border border-binance-lightGray/5 mr-3`}>
                                    <Text className={`text-[10px] font-bold uppercase tracking-widest ${statusConfig.color}`}>
                                        {item.status}
                                    </Text>
                                </View>
                                <Text className="text-binance-gray text-[10px] font-sans font-bold opacity-40 uppercase tracking-tighter">
                                    Commenced {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                        <View className="w-8 h-8 rounded-full bg-binance-lightGray/5 items-center justify-center border border-binance-lightGray/5">
                            <Ionicons name="chevron-forward" size={14} color="#707A8A" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }, [router]);

    const handleRefresh = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        refetch();
    }, [refetch]);

    const handleClearFilters = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setStartDate(null);
        setEndDate(null);
    }, []);

    const handleShowStartPicker = useCallback(() => {
        Haptics.selectionAsync();
        setShowStartPicker(true);
    }, []);

    const handleShowEndPicker = useCallback(() => {
        Haptics.selectionAsync();
        setShowEndPicker(true);
    }, []);

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
                className="pt-14 px-6 pb-8 border-b border-binance-lightGray/10 bg-binance-bg flex-row items-center"
            >
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                    activeOpacity={0.7}
                    className="w-10 h-10 items-center justify-center bg-binance-surface rounded-xl border border-binance-lightGray/20 mr-4"
                >
                    <Ionicons name="arrow-back" size={20} color="#1E2329" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-xl font-bold text-binance-text font-sans tracking-tight">Duty Logs</Text>
                    <Text className="text-binance-gray font-sans text-xs opacity-60 font-bold uppercase tracking-tighter" numberOfLines={1}>{email}</Text>
                </View>
            </View>

            <View
                className="p-6 bg-binance-surface border-b border-binance-lightGray/10 shadow-sm"
            >
                <View className="flex-row items-center gap-x-3">
                    <View className="flex-1">
                        <Text className="text-binance-gray text-[9px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Commencing</Text>
                        <TouchableOpacity
                            onPress={handleShowStartPicker}
                            activeOpacity={0.7}
                            className="bg-binance-bg p-3.5 rounded-2xl border border-binance-lightGray/20 flex-row items-center justify-between"
                        >
                            <Text className={`font-sans text-xs font-bold ${startDate ? 'text-binance-text' : 'text-binance-gray/60'}`}>
                                {displayDate(startDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={12} color="#707A8A" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex-1">
                        <Text className="text-binance-gray text-[9px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Terminating</Text>
                        <TouchableOpacity
                            onPress={handleShowEndPicker}
                            activeOpacity={0.7}
                            className="bg-binance-bg p-3.5 rounded-2xl border border-binance-lightGray/20 flex-row items-center justify-between"
                        >
                            <Text className={`font-sans text-xs font-bold ${endDate ? 'text-binance-text' : 'text-binance-gray/60'}`}>
                                {displayDate(endDate)}
                            </Text>
                            <Ionicons name="calendar-outline" size={12} color="#707A8A" />
                        </TouchableOpacity>
                    </View>
                    {(startDate || endDate) && (
                        <TouchableOpacity
                            onPress={handleClearFilters}
                            activeOpacity={0.7}
                            className="mt-5 w-11 h-11 items-center justify-center bg-red-500/10 rounded-2xl border border-red-500/20"
                        >
                            <Ionicons name="refresh" size={18} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {showStartPicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onStartChange}
                    maximumDate={endDate || new Date()}
                />
            )}

            {showEndPicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onEndChange}
                    minimumDate={startDate}
                    maximumDate={new Date()}
                />
            )}

            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSession}
                contentContainerClassName="px-6 pt-6 pb-10"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View
                        className="items-center justify-center py-20"
                    >
                        <View className="w-20 h-20 bg-binance-lightGray/10 rounded-[32px] items-center justify-center mb-6">
                            <Ionicons name="calendar-outline" size={32} color="#707A8A" className="opacity-40" />
                        </View>
                        <Text className="text-binance-gray font-bold font-sans text-base opacity-60">No archives found for this range</Text>
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
