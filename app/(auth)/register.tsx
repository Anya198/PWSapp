import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
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
    if (authError) { setError(authError.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from('users').insert([{ id: data.user.id, email, full_name: fullName, role: 'client' }]);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.iconWrap}>
            <View style={styles.iconBox}>
              <Ionicons name="person-add" size={44} color="#118a7e" />
            </View>
          </View>
          <View style={styles.headlineWrap}>
            <Text style={styles.headline}>Join <Text style={{ color: '#118a7e' }}>PWS</Text></Text>
            <Text style={styles.sub}>Create an account to access exclusive features and track your activity.</Text>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Input label="Full Name" value={fullName} onChangeText={setFullName} autoCapitalize="words" placeholder="Jane Doe" />
          <Input label="Email Address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
          <Input label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="••••••••" />
          <Button title="Create Account" onPress={handleRegister} isLoading={loading} style={{ marginTop: 8 }} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.footerLink}>Sign In</Link>
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
  iconBox: { width: 100, height: 100, borderRadius: 28, backgroundColor: '#e2eedf', alignItems: 'center', justifyContent: 'center' },
  headlineWrap: { alignItems: 'center', marginBottom: 32 },
  headline: { fontSize: 30, fontWeight: '800', color: '#0B2A20', textAlign: 'center', marginBottom: 10 },
  sub: { fontSize: 15, color: '#7F918C', textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#7F918C', fontSize: 15 },
  footerLink: { color: '#118a7e', fontWeight: '700', fontSize: 15 },
});
