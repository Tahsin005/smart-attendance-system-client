import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function StatusCard({ session, isLoading }) {
    const getStatusConfig = () => {
        if (!session || session.status === 'NOT_STARTED') {
            return {
                status: 'Identity Ready',
                description: 'Awaiting session start',
                color: 'text-binance-gray',
                accentColor: '#707A8A',
                bgColor: 'bg-binance-lightGray/10',
                icon: 'finger-print-outline',
            };
        }

        switch (session.status) {
            case 'WORKING':
                return {
                    status: 'Tracking Active',
                    description: 'Work hours recorded',
                    color: 'text-binance-yellow',
                    accentColor: '#F0B90B',
                    bgColor: 'bg-binance-yellow/10',
                    icon: 'flash',
                };
            case 'COMPLETED':
                return {
                    status: 'Session Sealed',
                    description: 'Verification complete',
                    color: 'text-[#10b981]',
                    accentColor: '#10b981',
                    bgColor: 'bg-[#10b981]/10',
                    icon: 'shield-checkmark',
                };
            default:
                return {
                    status: 'Status: Pending',
                    description: '',
                    color: 'text-binance-gray',
                    accentColor: '#707A8A',
                    bgColor: 'bg-binance-lightGray/10',
                    icon: 'help-circle',
                };
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const config = getStatusConfig();

    if (isLoading && !session) {
        return (
            <View
                className="bg-binance-surface p-8 rounded-[32px] border border-binance-lightGray/20 shadow-sm items-center"
            >
                <Text className="text-binance-gray text-sm font-sans font-medium tracking-wide">Synchronizing identity...</Text>
            </View>
        );
    }


    return (
        <View
            className="bg-binance-surface rounded-[32px] border border-binance-lightGray/30 overflow-hidden shadow-sm"
        >
            {/* Glossy Header Area */}
            <View className="px-6 py-5 flex-row items-center justify-between border-b border-binance-lightGray/10">
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 ${config.bgColor} rounded-2xl items-center justify-center border border-binance-lightGray/5`}>
                        <Ionicons name={config.icon} size={20} color={config.accentColor} />
                    </View>
                    <View className="ml-4">
                        <Text className={`text-base font-bold font-sans tracking-tight ${config.color}`}>
                            {config.status}
                        </Text>
                        <Text className="text-binance-gray text-[10px] uppercase font-bold tracking-widest opacity-60">
                            {config.description}
                        </Text>
                    </View>
                </View>
                <View className="bg-binance-lightGray/10 px-3 py-1.5 rounded-lg border border-binance-lightGray/5">
                    <Text className="text-binance-text text-[10px] font-sans font-bold">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'short',
                            day: 'numeric'
                        })}
                    </Text>
                </View>
            </View>

            {/* Precision Time Block */}
            <View className="flex-row p-6 items-center">
                <View className="flex-1">
                    <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Commencement</Text>
                    <Text className="text-binance-text font-bold text-2xl tracking-tighter">
                        {formatTime(session?.start_time)}
                    </Text>
                </View>

                <View className="h-8 w-[1px] bg-binance-lightGray/20 mx-4" />

                <View className="flex-1">
                    <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Termination</Text>
                    <Text className="text-binance-text font-bold text-2xl tracking-tighter">
                        {formatTime(session?.end_time)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
