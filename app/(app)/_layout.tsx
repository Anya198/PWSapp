import { Stack, Redirect } from 'expo-router';
import { useAuthStore } from '../../src/hooks/useAuthStore';

export default function AppLayout() {
  const { session } = useAuthStore();

  // If user is NOT logged in, redirect them to login
  if (!session) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
