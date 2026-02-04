import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { useGetUserWorkSessionsQuery } from "../../../redux/api/adminApi";

export default function WorkSessions() {
    const { userId, email } = useLocalSearchParams();
    const router = useRouter();
    const { data, isLoading, refetch, isFetching } = useGetUserWorkSessionsQuery({ userId });

    const sessions = data?.success ? data.data : [];

    const getStatusColor = (status) => {
        switch (status) {
            case 'WORKING': return 'text-binance-yellow';
            case 'COMPLETED': return 'text-binance-green';
            case 'NOT_STARTED': return 'text-binance-gray';
            default: return 'text-binance-gray';
        }
    };

    const renderSession = ({ item }) => (
        <View className="bg-binance-surface p-4 rounded-xl border border-binance-lightGray mb-3 shadow-sm">
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-binance-text font-bold font-sans text-sm">
                        {new Date(item.work_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </Text>
                    <View className="flex-row items-center mt-2">
                        <View className="bg-binance-bg px-2 py-0.5 rounded mr-2 border border-binance-lightGray">
                            <Text className={`text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                                {item.status}
                            </Text>
                        </View>
                        <Text className="text-binance-gray text-[10px] font-sans">
                            Started at {new Date(item.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
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
            <View className="pt-14 px-5 pb-6 border-b border-binance-lightGray bg-binance-bg flex-row items-center">
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#1E2329"
                    onPress={() => router.back()}
                    style={{ marginRight: 15 }}
                />
                <View>
                    <Text className="text-xl font-bold text-binance-text font-sans">Work Sessions</Text>
                    <Text className="text-binance-gray font-sans text-xs" numberOfLines={1}>{email}</Text>
                </View>
            </View>

            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSession}
                contentContainerClassName="p-5"
                ListEmptyComponent={
                    <View className="items-center justify-center py-20">
                        <Ionicons name="calendar-outline" size={64} color="#707A8A" className="opacity-20" />
                        <Text className="text-binance-gray font-sans mt-4">No work sessions found</Text>
                    </View>
                }
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor="#F0B90B" />
                }
            />
        </View>
    );
}
