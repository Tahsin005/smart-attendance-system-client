import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from "react";
import { Alert, Modal, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    workSessionApi,
} from "../../redux/api/workSessionApi";
import { logout } from "../../redux/slices/authSlice";

export default function Home() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    // work session state
    const { data: sessionData, isLoading: isSessionInitialLoading, isFetching: isSessionFetching, refetch } = useGetTodaySessionQuery();
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

            // If we get a 400 error indicating work already started, 
            // the UI is likely stale. Refetch to sync state.
            if (error?.status === 400 || error?.data?.message?.includes('already been started')) {
                console.log('[Home] Session sync error detected, refetching...');
                refetch();
            }
        } finally {
            setIsSubmitting(false);
            setActionType(null);
        }
    }, [actionType, getCurrentLocation, startWork, endWork, refetch]);

    const handleCameraClose = useCallback(() => {
        setShowCamera(false);
        setActionType(null);
    }, []);

    const handleRefresh = useCallback(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        refetch();
    }, [refetch]);

    const handleLogout = useCallback(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        dispatch(logout());
        dispatch(workSessionApi.util.resetApiState());
    }, [dispatch]);

    const isLoading = isSessionInitialLoading || isSessionFetching || isStarting || isEnding || isSubmitting;

    return (
        <>
            <ScrollView
                className="flex-1 bg-binance-bg pb-10"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isSessionFetching}
                        onRefresh={handleRefresh}
                        tintColor="#F0B90B"
                        colors={["#F0B90B"]}
                    />
                }
            >
                {/* Premium Header */}
                <View
                    className="pt-14 px-6 bg-binance-bg pb-8 border-b border-binance-lightGray/10"
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-12 h-12 rounded-2xl bg-binance-surface items-center justify-center border border-binance-lightGray/20 shadow-sm">
                                <Ionicons name="person-outline" size={20} color="#707A8A" />
                            </View>
                            <View className="ml-4">
                                <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Authenticated as</Text>
                                <Text className="text-binance-text font-sans font-bold text-sm tracking-tight">{user?.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={handleLogout}
                            activeOpacity={0.7}
                            className="w-10 h-10 items-center justify-center bg-binance-surface rounded-xl border border-binance-lightGray/20"
                        >
                            <Ionicons name="log-out-outline" size={22} color="#F6465D" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    className="px-6 pt-8"
                >
                    <Text className="text-binance-text font-bold text-3xl tracking-tight">Attendance</Text>
                    <Text className="text-binance-gray text-base mt-1 font-sans opacity-80">
                        Record your duty cycle with identity verification
                    </Text>
                </View>

                <View
                    className="px-6 mt-8"
                >
                    <StatusCard session={session} isLoading={isSessionInitialLoading} />
                </View>

                <View
                    className="px-6 mt-8"
                >
                    <AttendanceButton
                        status={sessionStatus}
                        isLoading={isLoading}
                        onPress={handleAttendancePress}
                    />
                </View>

                {/* Premium Info Card */}
                <View
                    className="px-6 mt-10"
                >
                    <View className="bg-binance-surface p-6 rounded-[32px] border border-binance-lightGray/30 shadow-sm">
                        <View className="flex-row items-center mb-4">
                            <View className="w-8 h-8 bg-binance-yellow/10 rounded-lg items-center justify-center">
                                <Ionicons name="information-circle" size={18} color="#F0B90B" />
                            </View>
                            <Text className="text-binance-text font-bold text-base ml-3 tracking-tight">
                                Protocol Guidelines
                            </Text>
                        </View>
                        <View className="space-y-4">
                            {[
                                { text: 'Trigger the action to start/end your shift', icon: 'radio-button-on' },
                                { text: 'Identity verification via selfie is mandatory', icon: 'camera-outline' },
                                { text: 'Geospatial coordinates are logged as proof', icon: 'location-outline' },
                                { text: 'Only one duty cycle is permitted per day', icon: 'calendar-outline' }
                            ].map((item, index) => (
                                <View key={index} className="flex-row items-start mb-3">
                                    <View className="mt-1 w-1.5 h-1.5 rounded-full bg-binance-yellow mr-3" />
                                    <Text className="text-binance-gray text-sm leading-5 font-medium opacity-80 flex-1">
                                        {item.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>


                {/* location Info Card */}
                {session?.start_lat && (
                    <View
                        className="px-6 mt-6 pb-10"
                    >
                        <View className="bg-binance-bg p-5 rounded-[28px] border border-binance-lightGray/30 flex-row items-center shadow-sm">
                            <View className="w-12 h-12 bg-binance-yellow/10 rounded-2xl items-center justify-center border border-binance-yellow/5">
                                <Ionicons name="navigate" size={22} color="#F0B90B" />
                            </View>
                            <View className="ml-4 flex-1">
                                <Text className="text-binance-gray text-[10px] font-bold uppercase tracking-widest opacity-50 mb-0.5">Logged Commencement</Text>
                                <Text className="text-binance-text font-bold text-sm tracking-tight italic opacity-90">
                                    {session.start_lat.toFixed(6)}, {session.start_lng.toFixed(6)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}


                <View className="h-20" />
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
