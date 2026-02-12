import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useCallback } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useGetSessionDetailsQuery } from "../../../redux/api/workSessionApi";

export default function SessionDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const mapRef = useRef(null);

    // Polling every 10 seconds to catch live background updates
    const { data, isLoading } = useGetSessionDetailsQuery(id, {
        pollingInterval: 10000,
    });

    const session = data?.success ? data.data : null;

    const startLoc = session ? {
        latitude: parseFloat(session.start_lat),
        longitude: parseFloat(session.start_lng)
    } : null;

    const liveLoc = session?.liveLocation ? {
        latitude: parseFloat(session.liveLocation.lat),
        longitude: parseFloat(session.liveLocation.lng)
    } : null;

    const history = (session?.locationLogs || []).map(log => ({
        latitude: parseFloat(log.lat),
        longitude: parseFloat(log.lng)
    }));

    const initialRegion = {
        ...(liveLoc || startLoc || { latitude: 0, longitude: 0 }),
        latitudeDelta: 0.012,
        longitudeDelta: 0.012
    };

    // Auto-center map when liveLoc changes - placeholder logic
    useEffect(() => {
        if (liveLoc && mapRef.current) {
            // mapRef.current.animateToRegion(...)
        }
    }, [liveLoc?.latitude, liveLoc?.longitude]);

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const now = new Date();
        const recorded = new Date(dateStr);
        const diffSeconds = Math.floor((now - recorded) / 1000);

        if (diffSeconds < 60) return 'Signal: Live';
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        return `${Math.floor(diffSeconds / 3600)}h ago`;
    };

    const handleBack = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.back();
    }, [router]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-binance-bg">
                <ActivityIndicator color="#F0B90B" size="large" />
            </View>
        );
    }

    if (!session) {
        return (
            <View className="flex-1 items-center justify-center bg-binance-bg">
                <Text className="text-binance-gray font-sans">Session not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-binance-bg">
            <View
                className="pt-14 px-6 pb-8 border-b border-binance-lightGray/10 bg-binance-bg flex-row items-center"
            >
                <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.7}
                    className="w-10 h-10 items-center justify-center bg-binance-surface rounded-xl border border-binance-lightGray/20 mr-4"
                >
                    <Ionicons name="arrow-back" size={20} color="#1E2329" />
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-xl font-bold text-binance-text font-sans tracking-tight">Session Verification</Text>
                    <Text className="text-binance-gray font-sans text-[10px] opacity-60 font-bold uppercase tracking-widest" numberOfLines={1}>Reference: #{id.toString().slice(-8).toUpperCase()}</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-6">
                    {/* Live Track Card */}
                    {session.liveLocation && (
                        <View
                            className="bg-binance-surface p-6 rounded-[32px] shadow-sm mb-6"
                        >
                            <View className="flex-row items-center justify-between mb-6">
                                <View className="flex-row items-center">
                                    <View className="w-2.5 h-2.5 rounded-full bg-binance-yellow mr-3" />
                                    <Text className="text-binance-yellow text-xs font-bold uppercase tracking-widest">Active Signal</Text>
                                </View>
                                <View className="bg-binance-bg/50 px-3 py-1 rounded-full border border-binance-yellow/10">
                                    <Text className="text-binance-text text-[10px] font-sans font-bold">
                                        {timeAgo(session.liveLocation.recorded_at)}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between mb-8">
                                <View className="flex-1">
                                    <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1.5">Latitudinal Index</Text>
                                    <Text className="text-binance-text font-bold font-sans text-lg tracking-tight">
                                        {session.liveLocation.lat.toFixed(6)}
                                    </Text>
                                </View>
                                <View className="w-[1px] h-8 bg-binance-yellow/10 mx-6" />
                                <View className="flex-1">
                                    <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1.5">Longitudinal Index</Text>
                                    <Text className="text-binance-text font-bold font-sans text-lg tracking-tight">
                                        {session.liveLocation.lng.toFixed(6)}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between pt-4 border-t border-binance-yellow/5">
                                <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-60">Last Transmission</Text>
                                <Text className="text-binance-text font-bold font-sans text-xs">
                                    {new Date(session.liveLocation.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Metadata Card */}
                    <View
                        className="bg-binance-surface p-6 rounded-[32px] border border-binance-lightGray/30 shadow-sm mb-6"
                    >
                        <Text className="text-binance-gray text-[10px] font-bold mb-6 uppercase tracking-widest opacity-60">Session Metadata</Text>

                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-binance-gray text-sm font-medium opacity-80">Registry Date</Text>
                            <Text className="text-binance-text font-bold font-sans text-sm tracking-tight">
                                {new Date(session.work_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="text-binance-gray text-sm font-medium opacity-80">Workflow Status</Text>
                            <View className="bg-binance-yellow/10 px-3 py-1 rounded-lg border border-binance-yellow/10">
                                <Text className="text-binance-yellow text-[10px] font-bold uppercase tracking-widest">{session.status}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between pt-5 border-t border-binance-lightGray/10">
                            <Text className="text-binance-gray text-sm font-medium opacity-80">Commencement</Text>
                            <Text className="text-binance-text font-bold font-sans text-sm tracking-tight">
                                {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Text>
                        </View>
                    </View>

                    {/* Timeline Card */}
                    <View
                        className="bg-binance-surface p-6 rounded-[32px] border border-binance-lightGray/30 shadow-sm mb-10"
                    >
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-60">Geospatial Timeline</Text>
                            <View className="bg-binance-lightGray/10 px-2.5 py-1 rounded-lg">
                                <Text className="text-binance-gray text-[9px] font-bold uppercase">{history.length} nodes</Text>
                            </View>
                        </View>

                        {history.length === 0 ? (
                            <View className="items-center justify-center py-8">
                                <Ionicons name="navigate-outline" size={32} color="#707A8A" className="opacity-20 mb-3" />
                                <Text className="text-binance-gray text-xs font-medium italic opacity-60">No movement history recorded</Text>
                            </View>
                        ) : (
                            <View className="pl-2">
                                {history.slice(0, 50).map((log, index) => (
                                    <View key={index} className="flex-row items-start mb-6 last:mb-0">
                                        <View className="items-center mr-4">
                                            <View className={`w-2.5 h-2.5 rounded-full ${index === 0 ? 'bg-binance-yellow shadow-lg shadow-binance-yellow/50' : 'bg-binance-lightGray/40'} z-10`} />
                                            {index !== history.length - 1 && index !== 49 && (
                                                <View className="w-[1px] h-12 bg-binance-lightGray/20 absolute top-2.5" />
                                            )}
                                        </View>
                                        <View className="flex-1 pt-0">
                                            <Text className="text-binance-text font-bold font-sans text-sm tracking-tight">Point Node #{history.length - index}</Text>
                                            <Text className="text-binance-gray text-[10px] mt-1 font-medium opacity-60 italic">
                                                {log.latitude.toFixed(6)}, {log.longitude.toFixed(6)}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {history.length > 5 && (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                className="mt-6 pt-4 border-t border-binance-lightGray/10 items-center"
                            >
                                <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-40">End of recent logs</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

