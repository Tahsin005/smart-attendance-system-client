import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import { loginSuccess } from "../redux/slices/authSlice";

export default function Auth() {
  const dispatch = useDispatch();
  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

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
      <View className="mt-20 items-center">
        <View className="w-16 h-16 bg-binance-yellow rounded-xl items-center justify-center rotate-45 mb-10">
          <Ionicons name="finger-print" size={32} color="#1E2329" className="-rotate-45" />
        </View>
        <Text className="text-3xl font-bold text-binance-text text-center font-sans tracking-tight">
          Smart Attendance
        </Text>
        <Text className="text-binance-gray mt-2 font-sans">Effortless workforce management</Text>
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
