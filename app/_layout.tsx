import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { ActivityIndicator, View } from 'react-native';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { hydrate, isHydrated, isAuthenticated, user } = useAuthStore();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  // Restore session from SecureStore on first launch
  useEffect(() => {
    hydrate();
  }, []);

  // Redirect after hydration is complete
  useEffect(() => {
    if (!isHydrated || !fontsLoaded) return;

    if (!isAuthenticated) {
      router.replace('/(customer)');
    } else if (user?.role === 'provider') {
      router.replace('/(provider)');
    } else {
      router.replace('/(customer)');
    }
  }, [isHydrated, fontsLoaded, isAuthenticated, user?.role]);

  if (!isHydrated || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(provider)" />
        <Stack.Screen name="business/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
