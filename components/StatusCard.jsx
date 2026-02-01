import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function StatusCard({ session, isLoading }) {
    const getStatusConfig = () => {
        if (!session || session.status === 'NOT_STARTED') {
            return {
                status: 'Ready to Start',
                description: 'Tap below to begin your work session',
                color: 'text-binance-gray',
                bgColor: 'bg-binance-lightGray',
                icon: 'time-outline',
                iconColor: '#707A8A',
            };
        }

        switch (session.status) {
            case 'WORKING':
                return {
                    status: 'Currently Working',
                    description: 'Your session is active',
                    color: 'text-binance-yellow',
                    bgColor: 'bg-binance-yellow/20',
                    icon: 'briefcase',
                    iconColor: '#F0B90B',
                };
            case 'COMPLETED':
                return {
                    status: 'Day Complete',
                    description: 'Great job! See you tomorrow',
                    color: 'text-[#10b981]',
                    bgColor: 'bg-[#10b981]/20',
                    icon: 'checkmark-circle',
                    iconColor: '#10b981',
                };
            default:
                return {
                    status: 'Unknown',
                    description: '',
                    color: 'text-binance-gray',
                    bgColor: 'bg-binance-lightGray',
                    icon: 'help-circle',
                    iconColor: '#707A8A',
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

    if (isLoading) {
        return (
            <View className="bg-binance-surface p-4 rounded-2xl border border-binance-lightGray">
                <View className="items-center py-4">
                    <Text className="text-binance-gray text-sm">Loading session...</Text>
                </View>
            </View>
        );
    }


    return (
        <View className="bg-binance-surface rounded-2xl border border-binance-lightGray overflow-hidden">
            {/* status header */}
            <View className={`${config.bgColor} px-4 py-3 flex-row items-center justify-between`}>
                <View className="flex-row items-center">
                    <Ionicons name={config.icon} size={20} color={config.iconColor} />
                    <Text className={`ml-2 font-bold ${config.color}`}>
                        {config.status}
                    </Text>
                </View>
                <Text className="text-binance-gray text-xs">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                    })}
                </Text>
            </View>

            {/* time details */}
            <View className="flex-row p-4">
                <View className="flex-1 items-center border-r border-binance-lightGray">
                    <Text className="text-binance-gray text-xs mb-1">Start Time</Text>
                    <Text className="text-binance-text font-bold text-lg">
                        {formatTime(session?.start_time)}
                    </Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-binance-gray text-xs mb-1">End Time</Text>
                    <Text className="text-binance-text font-bold text-lg">
                        {formatTime(session?.end_time)}
                    </Text>
                </View>
            </View>
        </View>
    );
}
