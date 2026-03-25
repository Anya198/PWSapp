import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#EFF7F3',
  dark: '#0B2A20',
  muted: '#7F918C',
  primary: '#118a7e',
  card: '#FFFFFF',
  icon: '#e2eedf',
};

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
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Hero Icon */}
          <View style={styles.iconWrap}>
            <View style={styles.iconBox}>
              <Ionicons name="leaf" size={52} color={C.primary} />
            </View>
          </View>

          {/* Headline */}
          <View style={styles.headlineWrap}>
            <Text style={styles.headlineLine1}>
              Welcome to <Text style={{ color: C.primary }}>PWS</Text>
            </Text>
            <Text style={styles.headlineLine2}>Login Now!</Text>
            <Text style={styles.sub}>
              Log in to access exclusive features, track your activity, and stay updated on your wellness journey.
            </Text>
          </View>

          {/* Error */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Form */}
          <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />

          {/* Buttons */}
          <Button title="Continue with Email" onPress={handleLogin} isLoading={loading} style={{ marginTop: 8 }} />
          <Button
            title="  Continue with Google"
            variant="secondary"
            icon={<Ionicons name="logo-google" size={20} color={C.dark} style={{ marginRight: 8 }} />}
            onPress={() => {}}
          />
          <Button
            title="  Continue with Apple"
            variant="primary"
            icon={<Ionicons name="logo-apple" size={22} color="#fff" style={{ marginRight: 8 }} />}
            onPress={() => {}}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" style={styles.footerLink}>Create one</Link>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF7F3' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  iconWrap: { alignItems: 'center', marginTop: 48, marginBottom: 28 },
  iconBox: {
    width: 120, height: 120, borderRadius: 36,
    backgroundColor: '#e2eedf',
    alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '6deg' }],
  },
  headlineWrap: { alignItems: 'center', marginBottom: 32 },
  headlineLine1: { fontSize: 30, fontWeight: '800', color: '#0B2A20', textAlign: 'center' },
  headlineLine2: { fontSize: 30, fontWeight: '800', color: '#0B2A20', textAlign: 'center', marginBottom: 12 },
  sub: { fontSize: 15, color: '#7F918C', textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#7F918C', fontSize: 15 },
  footerLink: { color: '#118a7e', fontWeight: '700', fontSize: 15 },
});
