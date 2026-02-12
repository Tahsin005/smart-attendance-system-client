import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function AttendanceButton({ status, isLoading, onPress }) {
    const getButtonConfig = () => {
        switch (status) {
            case 'WORKING':
                return {
                    text: 'Conclude Session',
                    icon: 'power',
                    bgClass: 'bg-red-500/10',
                    borderClass: 'border-red-500/20',
                    textColor: 'text-red-500',
                    iconColor: '#EF4444',
                    disabled: false,
                };
            case 'COMPLETED':
                return {
                    text: 'Duty Cycle Encoded',
                    icon: 'shield-checkmark',
                    bgClass: 'bg-binance-lightGray/10',
                    borderClass: 'border-binance-lightGray/20',
                    textColor: 'text-binance-gray',
                    iconColor: '#707A8A',
                    disabled: true,
                };
            default: // NOT_STARTED or undefined
                return {
                    text: 'Initialize Shift',
                    icon: 'finger-print',
                    bgClass: 'bg-binance-yellow',
                    borderClass: 'border-binance-yellow/20',
                    textColor: 'text-binance-dark',
                    iconColor: '#1E2329',
                    disabled: false,
                };
        }
    };

    const config = getButtonConfig();

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            onPressIn={handlePressIn}
            disabled={config.disabled || isLoading}
            activeOpacity={0.8}
            className={`${config.bgClass} ${config.borderClass} border py-2 px-2 rounded-[24px] flex-row items-center justify-center shadow-sm ${(config.disabled || isLoading) ? 'opacity-60' : ''}`}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={config.iconColor} />
            ) : (
                <View className="flex-row items-center">
                    <Ionicons
                        name={config.icon}
                        size={22}
                        color={config.iconColor}
                    />
                    <Text
                        className={`ml-3 font-bold text-lg font-sans tracking-tight ${config.textColor}`}
                    >
                        {config.text}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

