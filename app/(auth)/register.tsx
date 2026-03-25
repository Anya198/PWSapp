import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    const { data, error: authError } = await supabase.auth.signUp({ email, password });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    
    if (data.user) {
      await supabase.from('users').insert([
        { id: data.user.id, email, full_name: fullName, role: 'client' }
      ]);
    }
    
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32, paddingVertical: 40 }}>
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-[#e2eedf] rounded-3xl mb-4 items-center justify-center transform rotate-3">
              <Ionicons name="person-add" size={32} color="#118a7e" className="transform -rotate-3" />
            </View>
            <Text className="text-text-dark text-3xl font-bold mb-2 text-center">
              Join <Text className="text-primary">PWS</Text>
            </Text>
            <Text className="text-text-light text-center leading-5 px-4">
              Create an account in minutes to access exclusive features and track your activity.
            </Text>
          </View>

          {error ? <Text className="text-red-500 mb-4 text-center">{error}</Text> : null}

          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            placeholder="Jane Doe"
          />

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          <View className="mt-6 space-y-4">
            <Button title="Create Account" onPress={handleRegister} isLoading={loading} className="mb-4" />
          </View>

          <View className="mt-8 flex-row justify-center">
            <Text className="text-text-light font-medium">Already have an account? </Text>
            <Link href="/(auth)/login" className="text-primary font-bold">
              Sign In
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
