import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import { loginSuccess } from "../redux/slices/authSlice";

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#1E2329',
    borderWidth: 1,
    borderColor: '#2B3139',
    marginBottom: -32, // allow logo to overlap slightly
  },
  map: {
    flex: 1,
  },
})

export default function Auth() {
  const dispatch = useDispatch();
  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await loginApi({ email, password }).unwrap();
      dispatch(loginSuccess({ user: result.data.user, token: result.data.token }));
      Alert.alert("Success", result.message || "Logged in successfully");
    } catch (err) {
      Alert.alert("Error", err.data?.message || "Login failed");
    }
  };

  return (
    <View className="flex-1 bg-binance-bg p-6 justify-between">
      <View className="mt-12 items-center">
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={location ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            } : undefined}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>

          {/* Subtle Location Badge floating on map */}
          <View className="absolute bottom-3 left-3 bg-binance-bg/80 px-3 py-1.5 rounded-full border border-binance-lightGray/20">
            <View className="flex-row items-center">
              <View className={`w-2 h-2 rounded-full mr-2 ${location ? 'bg-green-500' : 'bg-binance-yellow'}`} />
              <Text className="text-binance-text text-[10px] font-sans font-bold uppercase tracking-wider">
                {location ? 'GPS Active' : 'Locating...'}
              </Text>
            </View>
          </View>
        </View>

        <View className="z-10 w-16 h-16 bg-binance-yellow rounded-2xl items-center justify-center rotate-45 mb-8 shadow-lg border-4 border-binance-bg">
          <Ionicons name="finger-print" size={32} color="#1E2329" className="-rotate-45" />
        </View>

        <Text className="text-3xl font-bold text-binance-text text-center font-sans tracking-tight">
          Smart Attendance
        </Text>
        <Text className="text-binance-gray mt-1 font-sans text-center">Effortless workforce management</Text>

        {location && (
          <View className="flex-row mt-4 space-x-3">
            <View className="bg-binance-surface px-3 py-1 rounded-md border border-binance-lightGray/10">
              <Text className="text-binance-gray text-[10px] font-sans">LAT: {location.coords.latitude.toFixed(6)}</Text>
            </View>
            <View className="bg-binance-surface px-3 py-1 rounded-md border border-binance-lightGray/10">
              <Text className="text-binance-gray text-[10px] font-sans">LNG: {location.coords.longitude.toFixed(6)}</Text>
            </View>
          </View>
        )}

        {errorMsg && (
          <Text className="text-red-500 text-xs mt-2 font-sans font-medium text-center">{errorMsg}</Text>
        )}
      </View>

      <View className="mb-10">
        {!showLogin ? (
          <View className="space-y-4">
            <TouchableOpacity
              onPress={() => setShowLogin(true)}
              className="bg-binance-yellow p-4 rounded-lg items-center shadow-sm"
            >
              <Text className="text-binance-text font-bold text-lg font-sans">Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View className="flex-row items-center mb-10">
              <TouchableOpacity onPress={() => setShowLogin(false)} className="p-2 -ml-2">
                <Ionicons name="arrow-back" size={24} color="#1E2329" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-binance-text ml-4 font-sans">Welcome Back</Text>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-binance-gray text-xs font-bold mb-2 ml-1 uppercase">Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  placeholderTextColor="#707A8A"
                  className="bg-binance-surface p-4 rounded-lg text-binance-text text-lg font-sans border border-binance-lightGray"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View className="mt-4">
                <Text className="text-binance-gray text-xs font-bold mb-2 ml-1 uppercase">Password</Text>
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor="#707A8A"
                  className="bg-binance-surface p-4 rounded-lg text-binance-text text-lg font-sans border border-binance-lightGray"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <View className="mt-8">
                {isLoginLoading ? (
                  <View className="bg-binance-yellow p-4 rounded-lg items-center opacity-70">
                    <ActivityIndicator color="#1E2329" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-binance-yellow p-4 rounded-lg items-center shadow-sm"
                  >
                    <Text className="text-binance-text font-bold text-lg font-sans">Log In</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
