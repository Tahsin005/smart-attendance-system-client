import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useGetSessionDetailsQuery } from "../../../redux/api/workSessionApi";

export default function SessionDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { data, isLoading } = useGetSessionDetailsQuery(id);

    const session = data?.success ? data.data : null;

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

    const startLoc = {
        latitude: parseFloat(session.start_lat),
        longitude: parseFloat(session.start_lng)
    };

    const liveLoc = session.liveLocation ? {
        latitude: parseFloat(session.liveLocation.lat),
        longitude: parseFloat(session.liveLocation.lng)
    } : null;

    const history = (session.locationLogs || []).map(log => ({
        latitude: parseFloat(log.lat),
        longitude: parseFloat(log.lng)
    }));

    const initialRegion = {
        ...(liveLoc || startLoc),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
    };

    // console.log(JSON.stringify(data, null, 2));

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
                <View className="h-80 w-full">
                    <MapView
                        className="flex-1"
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
                                pinColor="#F0B90B"
                            >
                                <View className="bg-binance-yellow p-1 rounded-full border-2 border-white">
                                    <Ionicons name="person" size={14} color="#1E2329" />
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
                    </MapView>
                </View>

                <View className="p-5">
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
