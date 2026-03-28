import { Redirect } from 'expo-router';

export default function Index() {
  // Routes users hitting the naked URL (/) straight into the Auth pipeline.
  // The (auth)/_layout.tsx will automatically forward them to /(app) if they already have an active session!
  return <Redirect href="/(auth)/login" />;
}
