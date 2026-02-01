import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import AttendanceButton from "../../components/AttendanceButton";
import SelfieCamera from "../../components/SelfieCamera";
import StatusCard from "../../components/StatusCard";
import { useLocation } from "../../hooks/useLocation";
import { usePermissions } from "../../hooks/usePermissions";
import {
    useGetTodaySessionQuery,
    useStartWorkMutation,
    useEndWorkMutation,
} from "../../redux/api/workSessionApi";
import { logout } from "../../redux/slices/authSlice";

export default function Home() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // work session state
    const { data: sessionData, isLoading: isSessionLoading, refetch } = useGetTodaySessionQuery();
    const [startWork, { isLoading: isStarting }] = useStartWorkMutation();
    const [endWork, { isLoading: isEnding }] = useEndWorkMutation();

    // local state
    const [showCamera, setShowCamera] = useState(false);
    const [actionType, setActionType] = useState(null); // 'start' or 'end'
    const [isSubmitting, setIsSubmitting] = useState(false);

    // hooks
    const { requestAllPermissions, hasAllPermissions } = usePermissions();
    const { getCurrentLocation } = useLocation();

    // get current session from API response
    const session = sessionData?.data;
    const sessionStatus = session?.status || 'NOT_STARTED';

    const handleAttendancePress = useCallback(async () => {
        // determine action based on current status
        const action = sessionStatus === 'WORKING' ? 'end' : 'start';

        // request permissions if not granted
        if (!hasAllPermissions) {
            const granted = await requestAllPermissions();
            if (!granted) return;
        }

        setActionType(action);
        setShowCamera(true);
    }, [sessionStatus, hasAllPermissions, requestAllPermissions]);

    const handleSelfieCapture = useCallback(async (photo) => {
        setShowCamera(false);
        setIsSubmitting(true);

        try {
            // get current GPS location
            const location = await getCurrentLocation();
            if (!location) {
                setIsSubmitting(false);
                return;
            }

            // create FormData for multipart upload
            const formData = new FormData();

            // append image file
            formData.append('image', {
                uri: photo.uri,
                type: 'image/jpeg',
                name: 'selfie.jpg',
            });

            // append GPS coordinates
            formData.append('lat', location.latitude.toString());
            formData.append('lng', location.longitude.toString());

            // submit to appropriate endpoint
            let result;
            if (actionType === 'start') {
                result = await startWork(formData).unwrap();
            } else {
                result = await endWork(formData).unwrap();
            }

            // show success message
            Alert.alert(
                'Success',
                actionType === 'start'
                    ? 'Work session started successfully!'
                    : 'Work session ended successfully!'
            );

            // refetch session to update UI
            refetch();
        } catch (error) {
            console.error('Attendance submission error:', error);

            // handle specific error cases
            let errorMessage = 'Failed to submit attendance. Please try again.';

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.status === 'FETCH_ERROR') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error?.status === 401) {
                errorMessage = 'Session expired. Please login again.';
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setIsSubmitting(false);
            setActionType(null);
        }
    }, [actionType, getCurrentLocation, startWork, endWork, refetch]);

    const handleCameraClose = useCallback(() => {
        setShowCamera(false);
        setActionType(null);
    }, []);

    const isLoading = isSessionLoading || isStarting || isEnding || isSubmitting;

    return (
        <>
            <ScrollView className="flex-1 bg-binance-bg pb-10">
                <View className="pt-14 px-5 bg-binance-bg pb-6 border-b border-binance-lightGray">
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 rounded-full bg-binance-lightGray items-center justify-center">
                                <Ionicons name="person" size={16} color="#707A8A" />
                            </View>
                            <Text className="ml-3 text-binance-text font-sans font-bold text-sm">{user?.email}</Text>
                        </View>
                        <TouchableOpacity onPress={() => dispatch(logout())}>
                            <Ionicons name="log-out-outline" size={24} color="#707A8A" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="px-5 pt-6">
                    <Text className="text-binance-text font-bold text-2xl mb-2">Attendance</Text>
                    <Text className="text-binance-gray text-sm">
                        Record your work session with a selfie
                    </Text>
                </View>

                <View className="px-5 mt-6">
                    <StatusCard session={session} isLoading={isSessionLoading} />
                </View>
                <View className="px-5 mt-6">
                    <AttendanceButton
                        status={sessionStatus}
                        isLoading={isLoading}
                        onPress={handleAttendancePress}
                    />
                </View>

                {/* info Card */}
                <View className="px-5 mt-6">
                    <View className="bg-binance-yellow/10 p-4 rounded-xl flex-row items-start">
                        <Ionicons name="information-circle" size={20} color="#F0B90B" />
                        <View className="ml-3 flex-1">
                            <Text className="text-binance-text font-bold text-sm mb-1">
                                How it works
                            </Text>
                            <Text className="text-binance-gray text-xs leading-5">
                                • Tap the button to start or end your work session{'\n'}
                                • Take a selfie when prompted{'\n'}
                                • Your GPS location will be recorded automatically{'\n'}
                                • You can only have one session per day
                            </Text>
                        </View>
                    </View>
                </View>

                {/* location Info (when session is active) */}
                {session?.start_lat && (
                    <View className="px-5 mt-4">
                        <View className="bg-binance-surface p-4 rounded-2xl border border-binance-lightGray flex-row items-center">
                            <View className="w-10 h-10 bg-binance-yellow/10 rounded-full items-center justify-center">
                                <Ionicons name="location" size={20} color="#F0B90B" />
                            </View>
                            <View className="ml-3 flex-1">
                                <Text className="text-binance-text font-bold text-sm">
                                    Check-in Location
                                </Text>
                                <Text className="text-binance-gray text-xs">
                                    {session.start_lat.toFixed(6)}, {session.start_lng.toFixed(6)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View className="pb-20" />
            </ScrollView>

            {/* selfie Camera Modal */}
            <Modal
                visible={showCamera}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <SelfieCamera
                    onCapture={handleSelfieCapture}
                    onClose={handleCameraClose}
                />
            </Modal>
        </>
    );
}
