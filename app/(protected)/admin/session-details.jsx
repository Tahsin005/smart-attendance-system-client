import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
import { useGetSessionDetailsQuery } from "../../../redux/api/workSessionApi";

import { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 320,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#161A1E',
        borderWidth: 1,
        borderColor: '#2B3139',
    },
    map: {
        flex: 1,
    },
});

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

    // Auto-center map when liveLoc changes
    useEffect(() => {
        if (liveLoc && mapRef.current) {
            mapRef.current.animateToRegion({
                ...liveLoc,
                latitudeDelta: 0.012,
                longitudeDelta: 0.012
            }, 1000);
        }
    }, [liveLoc?.latitude, liveLoc?.longitude]);

    const timeAgo = (dateStr) => {
        if (!dateStr) return '';
        const now = new Date();
        const recorded = new Date(dateStr);
        const diffSeconds = Math.floor((now - recorded) / 1000);

        if (diffSeconds < 60) return 'Just now';
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
        return `${Math.floor(diffSeconds / 3600)}h ago`;
    };

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
            <View className="pt-14 px-5 pb-6 border-b border-binance-lightGray bg-binance-bg flex-row items-center">
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#1E2329"
                    onPress={() => router.back()}
                    style={{ marginRight: 15 }}
                />
                <View className="flex-1">
                    <Text className="text-xl font-bold text-binance-text font-sans">Session Details</Text>
                    <Text className="text-binance-gray font-sans text-xs">ID: {id}</Text>
                </View>
            </View>

            <ScrollView className="flex-1">
                <View className="px-5 mt-4">
                    <View style={styles.mapContainer}>
                        {/* <MapView
                            ref={mapRef}
                            style={styles.map}
                            initialRegion={initialRegion}
                            key={id} // Force re-render if ID changes
                        >
                            <Marker
                                coordinate={startLoc}
                                title="Start Location"
                                pinColor="#707A8A"
                            />
                            {liveLoc && (
                                <Marker
                                    coordinate={liveLoc}
                                    title="Live Location"
                                    description={`Last signal: ${session.liveLocation.recorded_at}`}
                                    pinColor="#F0B90B"
                                >
                                    <View className="items-center">
                                        <View className="bg-white px-2 py-1 rounded-lg border border-binance-yellow shadow-sm mb-1">
                                            <Text className="text-[8px] font-bold text-binance-yellow">LIVE</Text>
                                        </View>
                                        <View className="bg-binance-yellow p-1.5 rounded-full border-2 border-white shadow-md">
                                            <Ionicons name="navigate" size={16} color="#1E2329" />
                                        </View>
                                    </View>
                                </Marker>
                            )}
                            {history.length > 1 && (
                                <Polyline
                                    coordinates={[startLoc, ...history, ...(liveLoc ? [liveLoc] : [])]}
                                    strokeColor="#F0B90B"
                                    strokeWidth={3}
                                    lineDashPattern={[0]}
                                />
                            )}
                        </MapView> */}

                        {liveLoc && (
                            <TouchableOpacity
                                onPress={() => mapRef.current?.animateToRegion({ ...liveLoc, latitudeDelta: 0.012, longitudeDelta: 0.012 })}
                                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg border border-binance-lightGray"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="compass" size={24} color="#F0B90B" />
                            </TouchableOpacity>
                        )}

                        {/* subtle Location Badge floating on map - bottom left like auth.jsx */}
                        <View className="absolute bottom-4 left-4 bg-binance-bg/80 px-3 py-1.5 rounded-full border border-binance-lightGray/20">
                            <View className="flex-row items-center">
                                <View className={`w-2 h-2 rounded-full mr-2 ${liveLoc ? 'bg-green-500' : 'bg-binance-yellow'}`} />
                                <Text className="text-binance-text text-[10px] font-sans font-bold uppercase tracking-wider">
                                    {liveLoc ? 'GPS Active' : 'Locating...'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Coordinate Boxes - matching auth.jsx style (smaller) */}
                {liveLoc && (
                    <View className="flex-row px-5 mt-4 space-x-3">
                        <View className="bg-binance-surface px-3 py-1.5 rounded-lg border border-binance-lightGray/10 flex-1">
                            <Text className="text-binance-gray text-[9px] font-sans uppercase font-bold mb-0.5">LATITUDE</Text>
                            <Text className="text-binance-text font-bold font-sans text-xs">{liveLoc.latitude.toFixed(6)}</Text>
                        </View>
                        <View className="bg-binance-surface px-3 py-1.5 rounded-lg border border-binance-lightGray/10 flex-1">
                            <Text className="text-binance-gray text-[9px] font-sans uppercase font-bold mb-0.5">LONGITUDE</Text>
                            <Text className="text-binance-text font-bold font-sans text-xs">{liveLoc.longitude.toFixed(6)}</Text>
                        </View>
                    </View>
                )}

                <View className="p-5">
                    {session.liveLocation && (
                        <View className="bg-binance-yellow/5 p-4 rounded-2xl border border-binance-yellow/30 shadow-sm mb-4">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <View className="w-2 h-2 rounded-full bg-binance-yellow mr-2 animate-pulse" />
                                    <Text className="text-binance-yellow text-[10px] font-bold uppercase tracking-wider">Live Track</Text>
                                </View>
                                <Text className="text-binance-gray text-[10px] font-sans">
                                    Last signal: {timeAgo(session.liveLocation.recorded_at)}
                                </Text>
                            </View>

                            <View className="flex-row items-start justify-between">
                                <View className="flex-1">
                                    <Text className="text-binance-gray text-[10px] mb-1">Current Coordinates</Text>
                                    <Text className="text-binance-text font-bold font-sans text-sm">
                                        {session.liveLocation.lat.toFixed(6)}, {session.liveLocation.lng.toFixed(6)}
                                    </Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-binance-gray text-[10px] mb-1">Recorded At</Text>
                                    <Text className="text-binance-text font-bold font-sans text-[11px]">
                                        {new Date(session.liveLocation.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View className="bg-binance-surface p-4 rounded-2xl border border-binance-lightGray shadow-sm mb-4">
                        <Text className="text-binance-gray text-[10px] font-bold mb-3 uppercase">Session Info</Text>

                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-binance-gray text-xs font-sans">Date</Text>
                            <Text className="text-binance-text font-bold font-sans text-xs">
                                {new Date(session.work_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </Text>
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-binance-gray text-xs font-sans">Status</Text>
                            <View className="bg-binance-bg px-2 py-0.5 rounded border border-binance-lightGray">
                                <Text className="text-binance-yellow text-[10px] font-bold uppercase">{session.status}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between">
                            <Text className="text-binance-gray text-xs font-sans">Started At</Text>
                            <Text className="text-binance-text font-bold font-sans text-xs">
                                {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </Text>
                        </View>
                    </View>

                    <View className="bg-binance-surface p-4 rounded-2xl border border-binance-lightGray shadow-sm">
                        <Text className="text-binance-gray text-[10px] font-bold mb-3 uppercase">Location Logs ({history.length})</Text>
                        {history.length === 0 ? (
                            <Text className="text-binance-gray text-xs font-sans italic text-center py-4">No movement history recorded</Text>
                        ) : (
                            history.slice(0, 5).map((log, index) => (
                                <View key={index} className="flex-row items-center justify-between mb-3 last:mb-0">
                                    <View className="flex-row items-center">
                                        <View className="w-1.5 h-1.5 rounded-full bg-binance-gray mr-2" />
                                        <Text className="text-binance-gray text-[10px] font-sans">Log point {history.length - index}</Text>
                                    </View>
                                    <Text className="text-binance-text font-sans text-[10px]">{log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</Text>
                                </View>
                            ))
                        )}
                        {history.length > 5 && (
                            <Text className="text-binance-gray text-[10px] font-sans text-center mt-2">Showing last 5 points</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
