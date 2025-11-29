import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AppProvider } from "@/contexts/AppContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(customer)/browse" />
      <Stack.Screen name="(customer)/contractor/[id]" />
      <Stack.Screen name="(customer)/post-job" />
      <Stack.Screen name="(trader)/jobs" />
      <Stack.Screen name="(trader)/profile" />
      <Stack.Screen name="(trader)/subscription-plans" />
      <Stack.Screen name="(trader)/subscription-dashboard" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <SubscriptionProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </SubscriptionProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}
