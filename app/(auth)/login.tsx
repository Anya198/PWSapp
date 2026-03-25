import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-monochrome-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-10">
          <Text className="text-white text-4xl font-bold mb-2">PWS</Text>
          <Text className="text-monochrome-100 text-lg">Sign in to your account</Text>
        </View>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

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

        <View className="mt-6">
          <Button title="Sign In" onPress={handleLogin} isLoading={loading} />
        </View>

        <View className="mt-8 flex-row justify-center">
          <Text className="text-monochrome-100">Don't have an account? </Text>
          <Link href="/(auth)/register" className="text-primary font-bold">
            Apply Here
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
