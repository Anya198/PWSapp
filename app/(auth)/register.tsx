import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    
    // Step 1: Create auth user
    const { data, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }
    
    // Step 2: Insert into users table
    if (data.user) {
      const { error: dbError } = await supabase.from('users').insert([
        { id: data.user.id, email, full_name: fullName, role: 'client' }
      ]);
      
      if (dbError) {
        console.error("DB Error:", dbError);
      }
    }
    
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-monochrome-900">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-10">
          <Text className="text-white text-4xl font-bold mb-2">Apply</Text>
          <Text className="text-monochrome-100 text-lg">Join the Personal Wellness System</Text>
        </View>

        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

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

        <View className="mt-6">
          <Button title="Submit Application" onPress={handleRegister} isLoading={loading} />
        </View>

        <View className="mt-8 flex-row justify-center">
          <Text className="text-monochrome-100">Already have an account? </Text>
          <Link href="/(auth)/login" className="text-primary font-bold">
            Sign In
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
