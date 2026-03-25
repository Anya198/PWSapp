import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

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
    <SafeAreaView className="flex-1 bg-surface">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-8"
      >
        <View className="items-center mb-10 mt-10">
          <View className="w-32 h-32 bg-[#e2eedf] rounded-[40px] mb-8 items-center justify-center transform rotate-6">
            <Ionicons name="leaf" size={48} color="#118a7e" className="transform -rotate-6" />
          </View>
          <Text className="text-text-dark text-3xl font-bold mb-1 text-center">
            Welcome to <Text className="text-primary">PWS</Text>
          </Text>
          <Text className="text-text-dark text-3xl font-bold mb-4">Login Now!</Text>
          <Text className="text-text-light text-center px-4 leading-6">
            Log in to access exclusive features, track your activity, and stay updated on your wellness journey.
          </Text>
        </View>

        {error ? <Text className="text-red-500 mb-4 text-center px-4">{error}</Text> : null}

        <Input
          label="Email"
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

        <View className="mt-2 space-y-4">
          <Button title="Continue with Email" onPress={handleLogin} isLoading={loading} className="mb-4" />
          
          <Button 
            title="Continue with Google" 
            variant="secondary"
            icon={<Ionicons name="logo-google" size={20} color="#0B2A20" style={{ position: 'absolute', left: 24 }} />}
            onPress={() => {}}
            className="mb-4"
          />
          
          <Button 
            title="Continue with Apple" 
            variant="primary"
            icon={<Ionicons name="logo-apple" size={24} color="#FFFFFF" style={{ position: 'absolute', left: 24 }} />}
            onPress={() => {}} 
          />
        </View>

        <View className="mt-8 flex-row justify-center pb-8">
          <Text className="text-text-light font-medium">Don't have an account? </Text>
          <Link href="/(auth)/register" className="text-primary font-bold">
            Create one
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
