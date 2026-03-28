import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { supabase } from '../../src/lib/supabase';
import { registerSchema, RegisterFormValues } from '../../src/lib/schemas';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  // Password strength
  const strength = passwordValue.length >= 12
    ? 3
    : passwordValue.length >= 8
    ? 2
    : passwordValue.length >= 4
    ? 1
    : 0;
  const strengthColors = ['#E8EAE8', '#ef4444', '#f59e0b', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Strong'];

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { display_name: '', email: '', password: '' },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { display_name: data.display_name },
      },
    });
    setLoading(false);
    if (error) {
      setAuthError(error.message);
    } else {
      Alert.alert(
        'Account Created!',
        'Please check your email to confirm your account, then log in.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Headline */}
          <AnimatedCard delay={50} style={styles.headlineWrap}>
            <View style={styles.logoBox}>
              <Ionicons name="person-add" size={32} color="#00D09C" />
            </View>
            <Text style={styles.headline}>Create your{'\n'}account.</Text>
            <Text style={styles.sub}>Join PWS and start your transformation.</Text>
          </AnimatedCard>

          {/* Error */}
          {authError ? (
            <AnimatedCard delay={0} style={styles.errorBanner}>
              <Ionicons name="warning-outline" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{authError}</Text>
            </AnimatedCard>
          ) : null}

          {/* Form card */}
          <AnimatedCard delay={150} style={styles.card}>
            <Controller
              control={control}
              name="display_name"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  placeholder="e.g. Alex Johnson"
                  error={errors.display_name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Password"
                  value={value}
                  onChangeText={(v) => { onChange(v); setPasswordValue(v); }}
                  secureTextEntry
                  placeholder="Min. 8 characters"
                  error={errors.password?.message}
                />
              )}
            />

            {/* Password strength bar */}
            {passwordValue.length > 0 && (
              <View style={styles.strengthWrap}>
                <View style={styles.strengthTrack}>
                  {[1, 2, 3].map((level) => (
                    <View
                      key={level}
                      style={[
                        styles.strengthSegment,
                        { backgroundColor: strength >= level ? strengthColors[strength] : '#E8EAE8' },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.strengthLabel, { color: strengthColors[strength] }]}>
                  {strengthLabels[strength]}
                </Text>
              </View>
            )}
          </AnimatedCard>

          {/* CTA */}
          <AnimatedCard delay={280} style={styles.buttonGroup}>
            <Button
              title="Create Account"
              onPress={handleSubmit(onSubmit)}
              isLoading={loading}
            />
          </AnimatedCard>

          {/* Footer */}
          <AnimatedCard delay={380} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" style={styles.footerLink}>Sign in</Link>
          </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#EFF7F3' },
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },

  headlineWrap: { marginTop: 44, marginBottom: 28 },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(0,208,156,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,208,156,0.25)',
    marginBottom: 20,
  },
  headline: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0B2A20',
    lineHeight: 44,
    letterSpacing: -1.2,
    marginBottom: 10,
  },
  sub: { fontSize: 16, color: '#4A7064', lineHeight: 24 },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { color: '#ef4444', fontSize: 14, flex: 1 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0B2A20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },

  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  strengthTrack: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
    width: 44,
    textAlign: 'right',
  },

  buttonGroup: { marginBottom: 8 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingBottom: 16,
  },
  footerText: { color: '#7F918C', fontSize: 15 },
  footerLink: { color: '#118a7e', fontWeight: '700', fontSize: 15 },
});
