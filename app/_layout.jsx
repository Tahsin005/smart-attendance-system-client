import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../global.css";
import { loadUser } from "../redux/slices/authSlice";
import { store } from "../redux/store";
import "../tasks/locationTask"; // Register background task

function RouteGuard({ children }) {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isRehydrated, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isRehydrated) return;
    if (!navigationState?.key) return;

    const inAuthScreen = segments[0] === "auth";

    console.log('[RouteGuard] Ready - isAuthenticated:', isAuthenticated, 'inAuthScreen:', inAuthScreen, 'segments:', segments);

    if (!isAuthenticated && !inAuthScreen) {
      router.replace("/auth");
    } else if (isAuthenticated && inAuthScreen) {
      router.replace("/(protected)");
    } else if (isAuthenticated && segments.length === 0) {
      router.replace("/(protected)");
    }
  }, [isAuthenticated, isRehydrated, segments, router, navigationState?.key]);

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
