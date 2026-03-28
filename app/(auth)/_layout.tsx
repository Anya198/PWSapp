import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/hooks/useAuthStore';

export default function AuthLayout() {
  const { session } = useAuthStore();

  // If user is already logged in, redirect them into the app
  if (session) return <Redirect href="/(app)" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
