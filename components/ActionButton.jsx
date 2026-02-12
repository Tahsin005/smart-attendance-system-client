import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const ActionButton = ({ icon, label, primary, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.9);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    const handlePress = () => {
        Haptics.selectionAsync();
        onPress();
    };

    return (
        <View className="items-center mr-6">
            <AnimatedTouchableOpacity
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
                style={animatedStyle}
                className={`w-14 h-14 rounded-2xl items-center justify-center shadow-sm ${primary ? 'bg-binance-yellow' : 'bg-binance-surface border border-binance-lightGray/30'}`}
            >
                <Ionicons name={icon} size={24} color="#1E2329" />
            </AnimatedTouchableOpacity>
            {label && <Text className="mt-2 text-binance-gray font-bold text-[10px] font-sans lowercase tracking-wide opacity-60">{label}</Text>}
        </View>
    );
};

export default ActionButton;
