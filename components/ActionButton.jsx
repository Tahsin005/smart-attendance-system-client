import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

const ActionButton = ({ icon, label, primary, onPress }) => (
    <View className="items-center mr-6">
        <TouchableOpacity
            onPress={onPress}
            className={`w-12 h-12 rounded-lg items-center justify-center ${primary ? 'bg-binance-yellow' : 'bg-binance-surface border border-binance-lightGray'}`}
        >
            <Ionicons name={icon} size={22} color="#1E2329" />
        </TouchableOpacity>
        {label && <Text className="mt-2 text-binance-gray font-medium text-[10px] font-sans lowercase">{label}</Text>}
    </View>
);

export default ActionButton;
