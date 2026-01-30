import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../global.css";
import { loadUser } from "../redux/authSlice";
import { store } from "../redux/store";

function RouteGuard({ children }) {
  const router = useRouter();
  const segments = useSegments();
  const { user, isRehydrated, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isRehydrated) return;

    const inAuthGroup = segments[0] === "auth";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/auth");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(protected)");
    }
  }, [isAuthenticated, isRehydrated, segments]);

  return <>{children}</>;
}

function RootContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <RouteGuard>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" options={{ animation: 'fade' }} />
        <Stack.Screen name="(protected)" options={{ animation: 'fade' }} />
      </Stack>
    </RouteGuard>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar style="light" />
        <RootContent />
      </Provider>
    </SafeAreaProvider>
  );
}
