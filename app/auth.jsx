import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/api/authApi";
import { loginSuccess } from "../redux/authSlice";

export default function Auth() {
  const dispatch = useDispatch();
  const [loginApi, { isLoading: isLoginLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async () => {
    try {
      const result = await loginApi({ email, password }).unwrap();
      dispatch(loginSuccess({ user: result.user, token: result.token }));
      Alert.alert("Success", "Logged in successfully");
    } catch (err) {
      Alert.alert("Error", err.data?.message || "Login failed");
    }
  };

  return (
    <View className="flex-1 bg-wise-bg p-6 justify-between">
      <View className="mt-10 items-center">
        <Text className="text-4xl font-extrabold text-wise-text text-center mt-6 leading-tight tracking-tighter">
          Smart Attendance{"\n"}System
        </Text>
      </View>

      <View className="mb-10">
        {!showLogin ? (
          <View className="space-y-4">
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setShowLogin(true)}
                className="flex-1 bg-wise-lime p-5 rounded-full items-center shadow-sm"
              >
                <Text className="text-wise-dark font-bold text-lg">Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="space-y-4">
            <View className="flex-row items-center mb-6">
              <TouchableOpacity onPress={() => setShowLogin(false)} className="p-2 -ml-2">
                <Ionicons name="arrow-back" size={24} color="#253342" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-wise-text ml-2">Welcome back</Text>
            </View>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#94a3b8"
              className="border border-wise-surface p-4 rounded-2xl bg-wise-surface text-wise-text text-lg"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              className="border border-wise-surface p-4 rounded-2xl bg-wise-surface text-wise-text text-lg"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View className="mt-6">
              {isLoginLoading ? (
                <View className="bg-wise-lime p-5 rounded-full items-center">
                  <ActivityIndicator color="#2E3333" />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  className="bg-wise-lime p-5 rounded-full items-center shadow-sm"
                >
                  <Text className="text-wise-dark font-bold text-lg">Continue</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
