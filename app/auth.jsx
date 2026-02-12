import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, AppState, Keyboard, KeyboardAvoidingView, Linking, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import { useCheckHealthQuery } from "../redux/api/healthApi";
import { loginSuccess } from "../redux/slices/authSlice";


export default function Auth() {
  const dispatch = useDispatch();
  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();
  const { data: healthData, isSuccess: isHealthSuccess, isError: isHealthError, isLoading: isHealthLoading, refetch: refetchHealth } = useCheckHealthQuery();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('undetermined');

  const requestPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      setErrorMsg(null);
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (err) {
      setErrorMsg('An error occurred while fetching location');
    }
  };

  useEffect(() => {
    requestPermission();

    // listen for app state changes (e.g., returning from Settings)
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        requestPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleLogin = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await loginApi({ email, password }).unwrap();
      dispatch(loginSuccess({ user: result.data.user, token: result.data.token }));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Success", result.message || "Logged in successfully");
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", err.data?.message || "Login failed");
    }
  };

  const onButtonPress = () => {
    Haptics.selectionAsync();
  };

  return (
    <SafeAreaView className="flex-1 bg-binance-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 p-6 justify-between">
              <View className="mt-12 items-center">

                <View className="w-full h-56 rounded-3xl overflow-hidden bg-binance-bg border border-binance-lightGray/10 shadow-sm relative mb-8">
                  <View className="absolute inset-0 bg-binance-yellow/5" />

                  {/* Visual Art/Logo Area */}
                  <View className="flex-1 items-center justify-center p-8">
                    <View
                      className="w-20 h-20 bg-binance-bg rounded-[24px] items-center justify-center shadow-2xl border-2 border-binance-lightGray/20 rotate-12"
                    >
                      <Ionicons name="finger-print" size={40} color="#F0B90B" className="-rotate-12" />
                    </View>
                  </View>


                  <View className="absolute bottom-4 left-4 flex-row space-x-2">
                    {/* Location Badge */}
                    <View
                      className="bg-binance-bg/90 px-3 py-2 rounded-xl border border-binance-lightGray/20 flex-row items-center shadow-sm"
                    >
                      <View className={`w-2 h-2 rounded-full mr-2 ${location ? 'bg-green-500' : 'bg-binance-yellow'}`} />
                      <Text className="text-binance-text text-[10px] font-sans font-bold uppercase tracking-wider">
                        {location ? 'GPS Active' : 'Locating...'}
                      </Text>
                    </View>


                    {/* Server Health Badge */}
                    <TouchableOpacity
                      onPress={() => {
                        onButtonPress();
                        refetchHealth();
                      }}
                    >
                      <View
                        className="bg-binance-bg/90 px-3 py-2 rounded-xl border border-binance-lightGray/20 flex-row items-center shadow-sm"
                      >
                        <View className={`w-2 h-2 rounded-full mr-2 ${isHealthSuccess ? 'bg-green-500' : isHealthError ? 'bg-red-500' : 'bg-binance-yellow'}`} />
                        <Text className="text-binance-text text-[10px] font-sans font-bold uppercase tracking-wider">
                          {isHealthLoading ? 'Checking...' : isHealthSuccess ? 'Health: OK' : 'Health: ERR'}
                        </Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                </View>

                <Text
                  className="text-4xl font-bold text-binance-text text-center font-sans tracking-tight"
                >
                  Smart Attendance
                </Text>
                <Text
                  className="text-binance-gray mt-2 font-sans text-center text-base"
                >
                  Precision workforce tracking & analytics
                </Text>


                {location && (
                  <View
                    className="flex-row mt-6 space-x-3"
                  >
                    <View className="bg-binance-surface px-4 py-2 rounded-xl border border-binance-lightGray/20 shadow-sm">
                      <Text className="text-binance-gray text-[10px] font-sans font-bold uppercase tracking-widest opacity-50 mb-0.5">Latitude</Text>
                      <Text className="text-binance-text text-xs font-sans font-bold">{location.coords.latitude.toFixed(6)}</Text>
                    </View>
                    <View className="bg-binance-surface px-4 py-2 rounded-xl border border-binance-lightGray/20 shadow-sm">
                      <Text className="text-binance-gray text-[10px] font-sans font-bold uppercase tracking-widest opacity-50 mb-0.5">Longitude</Text>
                      <Text className="text-binance-text text-xs font-sans font-bold">{location.coords.longitude.toFixed(6)}</Text>
                    </View>
                  </View>
                )}


                {errorMsg && (
                  <Text
                    className="text-red-500 text-xs mt-3 font-sans font-medium text-center"
                  >
                    {errorMsg}
                  </Text>
                )}
              </View>


              <View
                className="mt-12 mb-10"
              >
                {permissionStatus !== 'granted' ? (
                  <View
                    className="bg-binance-surface p-8 rounded-[32px] border border-binance-lightGray/20 items-center shadow-sm"
                  >

                    <View className="w-16 h-16 bg-binance-bg rounded-2xl items-center justify-center mb-6 shadow-sm border border-binance-lightGray/10">
                      <Ionicons
                        name={permissionStatus === 'denied' ? "alert-circle" : "location-outline"}
                        size={32}
                        color={permissionStatus === 'denied' ? "#F6465D" : "#F0B90B"}
                      />
                    </View>
                    <Text className="text-binance-text font-bold text-xl text-center font-sans">
                      {permissionStatus === 'denied' ? "Permission Denied" : "Track Anywhere"}
                    </Text>
                    <Text className="text-binance-gray text-center mt-2 font-sans text-sm px-4">
                      {permissionStatus === 'denied'
                        ? "We need your location to verify attendance. Please enable it in settings."
                        : "Enable high-precision GPS to start recording your work hours effortlessly."}
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        onButtonPress();
                        permissionStatus === 'denied' ? Linking.openSettings() : requestPermission();
                      }}
                      activeOpacity={0.8}
                      className="bg-binance-yellow mt-8 px-10 py-4 rounded-[20px] shadow-sm w-full items-center"
                    >
                      <Text className="text-binance-text font-bold font-sans text-lg">
                        {permissionStatus === 'denied' ? "Open System Settings" : "Allow GPS Access"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : !showLogin ? (
                  <View className="space-y-4">
                    <TouchableOpacity
                      onPress={() => {
                        onButtonPress();
                        setShowLogin(true);
                      }}
                      activeOpacity={0.8}
                      className="bg-binance-yellow p-5 rounded-[24px] items-center shadow-md"
                    >
                      <Text className="text-binance-text font-bold text-xl font-sans">Continue to Login</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>


                    <View className="flex-row items-center mb-10">
                      <TouchableOpacity
                        onPress={() => {
                          onButtonPress();
                          setShowLogin(false);
                        }}
                        className="w-10 h-10 bg-binance-surface rounded-xl items-center justify-center border border-binance-lightGray/20"
                      >
                        <Ionicons name="chevron-back" size={24} color="#1E2329" />
                      </TouchableOpacity>
                      <Text className="text-2xl font-bold text-binance-text ml-5 font-sans tracking-tight">Identity Access</Text>
                    </View>

                    <View className="space-y-6">
                      <View>
                        <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Credentials / Email</Text>
                        <View className="bg-binance-surface p-1 rounded-[20px] border border-binance-lightGray/30 flex-row items-center focus:border-binance-yellow">
                          <View className="w-12 h-12 items-center justify-center">
                            <Ionicons name="mail-outline" size={20} color="#707A8A" />
                          </View>
                          <TextInput
                            placeholder="user@organization.com"
                            placeholderTextColor="#707A8A"
                            className="flex-1 p-3 text-binance-text text-lg font-sans"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                          />
                        </View>
                      </View>

                      <View className="mt-6">
                        <Text className="text-binance-gray text-[10px] font-bold mb-2 ml-1 uppercase tracking-widest opacity-60">Identity / Password</Text>
                        <View className="bg-binance-surface p-1 rounded-[20px] border border-binance-lightGray/30 flex-row items-center">
                          <View className="w-12 h-12 items-center justify-center">
                            <Ionicons name="lock-closed-outline" size={20} color="#707A8A" />
                          </View>
                          <TextInput
                            placeholder="••••••••"
                            placeholderTextColor="#707A8A"
                            className="flex-1 p-3 text-binance-text text-lg font-sans"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                          />
                        </View>
                      </View>

                      <View className="mt-12">
                        {isLoginLoading ? (
                          <View className="bg-binance-yellow p-5 rounded-[24px] items-center opacity-70 shadow-sm">
                            <ActivityIndicator color="#1E2329" size="small" />
                          </View>
                        ) : (
                          <TouchableOpacity
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            className="bg-binance-yellow p-5 rounded-[24px] items-center shadow-lg transform active:scale-95"
                          >
                            <Text className="text-binance-text font-bold text-xl font-sans">Grant Access</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );
}

