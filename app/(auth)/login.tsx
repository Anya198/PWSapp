import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { AnimatedCard } from '../../src/components/ui/AnimatedCard';
import { supabase } from '../../src/lib/supabase';
import { loginSchema, LoginFormValues } from '../../src/lib/schemas';
import { Ionicons } from '@expo/vector-icons';

const C = {
  bg: '#EFF7F3',
  dark: '#0B2A20',
  muted: '#4A7064',
  light: '#7F918C',
  primary: '#118a7e',
  accent: '#00D09C',
};

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Hero parallax
  const scrollY = useRef(new Animated.Value(0)).current;
  const heroScale = scrollY.interpolate({
    inputRange: [-50, 0, 80],
    outputRange: [1.1, 1, 0.85],
    extrapolate: 'clamp',
  });
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setLoading(false);
    if (error) setAuthError(error.message);
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Animated.ScrollView
          contentContainerStyle={styles.scroll}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section — parallax shrink on scroll */}
          <Animated.View
            style={[styles.heroWrap, { transform: [{ scale: heroScale }], opacity: heroOpacity }]}
          >
            <View style={styles.logoBox}>
              <Ionicons name="leaf" size={42} color={C.accent} />
            </View>
            <Text style={styles.logoText}>PWS</Text>
          </Animated.View>

          {/* Headline */}
          <AnimatedCard delay={100} style={styles.headlineWrap}>
            <Text style={styles.headline}>
              Welcome{'\n'}back.
            </Text>
            <Text style={styles.sub}>
              Sign in to continue your wellness journey.
            </Text>
          </AnimatedCard>

          {/* Error banner */}
          {authError ? (
            <AnimatedCard delay={0} style={styles.errorBanner}>
              <Ionicons name="warning-outline" size={16} color="#ef4444" />
              <Text style={styles.errorText}>{authError}</Text>
            </AnimatedCard>
          ) : null}

          {/* Glassmorphism form card */}
          <AnimatedCard delay={200} style={styles.card}>
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
                  onChangeText={onChange}
                  secureTextEntry
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              )}
            />
          </AnimatedCard>

          {/* CTA buttons */}
          <AnimatedCard delay={320} style={styles.buttonGroup}>
            <Button
              title="Sign In  →  Demo"
              onPress={() => router.replace('/')}
              isLoading={loading}
            />
            <Button
              title="  Continue with Google"
              variant="secondary"
              icon={<Ionicons name="logo-google" size={20} color={C.dark} style={{ marginRight: 8 }} />}
              onPress={() => Alert.alert('Coming Soon', 'Google OAuth will be enabled in production.')}
            />
            <Button
              title="  Continue with Apple"
              variant="primary"
              icon={<Ionicons name="logo-apple" size={22} color="#fff" style={{ marginRight: 8 }} />}
              onPress={() => Alert.alert('Coming Soon', 'Apple SSO will be enabled in production.')}
            />
          </AnimatedCard>

          {/* Footer */}
          <AnimatedCard delay={400} style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" style={styles.footerLink}>
              Create one
            </Link>
          </AnimatedCard>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0B2A20' }, // Dark Background
  scroll: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },

  heroWrap: {
    alignItems: 'center',
    marginTop: 44,
    marginBottom: 24,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: 'rgba(0,208,156,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,208,156,0.25)',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#EFF7F3', // Light text
    letterSpacing: -0.5,
  },

  headlineWrap: { marginBottom: 28 },
  headline: {
    fontSize: 40,
    fontWeight: '900',
    color: '#EFF7F3', // Light text
    lineHeight: 46,
    letterSpacing: -1.2,
    marginBottom: 10,
  },
  sub: {
    fontSize: 16,
    color: '#4A7064', // Muted text
    lineHeight: 24,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorText: { color: '#ef4444', fontSize: 14, flex: 1 },

  card: {
    backgroundColor: '#0F3B2A', // Darker card background
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  buttonGroup: { marginBottom: 8 },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingBottom: 16,
  },
  footerText: { color: '#7F918C', fontSize: 15 },
  footerLink: { color: '#00D09C', fontWeight: '700', fontSize: 15 },
});
