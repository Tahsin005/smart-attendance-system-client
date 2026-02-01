import { Ionicons } from "@expo/vector-icons";
import { CameraView } from "expo-camera";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SelfieCamera({ onCapture, onClose }) {
    const cameraRef = useRef(null);
    const [isCapturing, setIsCapturing] = useState(false);

    const handleCapture = async () => {
        if (!cameraRef.current || isCapturing) return;

        try {
            setIsCapturing(true);

            // Capture with reasonable quality (0.7)
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.7,
                skipProcessing: false,
            });

            onCapture(photo);
        } catch (error) {
            console.error("Error capturing photo:", error);
            setIsCapturing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="front"
                mode="picture"
            >
                {/* Header with close button */}
                <View className="flex-row justify-between items-center px-5 pt-4">
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                    >
                        <Ionicons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">Take Selfie</Text>
                    <View className="w-10" />
                </View>

                {/* Instructions */}
                <View className="flex-1 items-center justify-center">
                    <View className="w-64 h-64 rounded-full border-4 border-white/30" />
                    <Text className="text-white text-center mt-4 px-10 opacity-70">
                        Position your face within the circle
                    </Text>
                </View>

                {/* Capture button */}
                <View className="items-center pb-10">
                    <TouchableOpacity
                        onPress={handleCapture}
                        disabled={isCapturing}
                        className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
                    >
                        {isCapturing ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <View className="w-16 h-16 rounded-full bg-white" />
                        )}
                    </TouchableOpacity>
                    <Text className="text-white mt-3 opacity-70">
                        {isCapturing ? "Capturing..." : "Tap to capture"}
                    </Text>
                </View>
            </CameraView>
        </SafeAreaView>
    );
}
