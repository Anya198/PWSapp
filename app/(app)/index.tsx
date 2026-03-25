import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { Button } from '../../src/components/ui/Button';

export default function DashboardScreen() {
  const { session } = useAuthStore();
  
  const handleSignOut = () => {
    supabase.auth.signOut();
  }

  return (
    <SafeAreaView className="flex-1 bg-monochrome-900">
      <View className="flex-1 px-6 justify-center">
        <Text className="text-white text-3xl font-bold mb-4">Dashboard</Text>
        <Text className="text-monochrome-100 mb-8">
          Welcome back to PWS. Your active phase and daily check-ins will appear here.
        </Text>
        <Button title="Sign Out" variant="outline" onPress={handleSignOut} />
      </View>
    </SafeAreaView>
  );
}
