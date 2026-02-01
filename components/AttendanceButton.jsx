import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

export default function AttendanceButton({ status, isLoading, onPress }) {
    const getButtonConfig = () => {
        switch (status) {
            case 'WORKING':
                return {
                    text: 'Punch Out',
                    icon: 'stop-circle',
                    bgClass: 'bg-red-500',
                    disabled: false,
                };
            case 'COMPLETED':
                return {
                    text: 'Shift Completed',
                    icon: 'checkmark-done-circle',
                    bgClass: 'bg-binance-lightGray',
                    disabled: true,
                };
            default: // NOT_STARTED or undefined
                return {
                    text: 'Punch In',
                    icon: 'play-circle',
                    bgClass: 'bg-binance-yellow',
                    disabled: false,
                };
        }
    };

    const config = getButtonConfig();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={config.disabled || isLoading}
            activeOpacity={0.8}
            className={`${config.bgClass} py-4 px-6 rounded-2xl flex-row items-center justify-center ${(config.disabled || isLoading) ? 'opacity-60' : ''
                }`}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#1E2329" />
            ) : (
                <>
                    <Ionicons
                        name={config.icon}
                        size={24}
                        color={status === 'COMPLETED' ? '#707A8A' : '#1E2329'}
                    />
                    <Text
                        className={`ml-3 font-bold text-lg ${status === 'COMPLETED' ? 'text-binance-gray' : 'text-binance-bg'
                            }`}
                    >
                        {config.text}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}
