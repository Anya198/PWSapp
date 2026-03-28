import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TAGLINES = [
  'Fuel your body.',
  'Train your strength.',
  'Own your performance.',
];

/**
 * Cinematic splash screen — inspired by Cash App's full-screen hero animation.
 * Shows PWS logo with a pulsing radial glow, then types out a tagline,
 * then transitions to the login screen.
 */
export default function SplashScreen() {
  const router = useRouter();

  // Logo animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  // Tagline fade
  const taglineOpacity = useRef(new Animated.Value(0)).current;

  // Pulse ring
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Pulse loop
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 2.2,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 1600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );
    pulse.start();

    // Logo entrance
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }),
    ]).start();

    // Tagline fade in after logo
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 600,
      delay: 900,
      useNativeDriver: true,
    }).start();

    // Navigate to login after 2.8s
    const timer = setTimeout(() => {
      pulse.stop();
      router.replace('/(auth)/login');
    }, 2800);

    return () => {
      clearTimeout(timer);
      pulse.stop();
    };
  }, []);

  return (
    <View style={styles.root}>
      {/* Background gradient overlay */}
      <View style={styles.bgGradient} />

      {/* Pulse ring — the "radial glow" */}
      <View style={styles.pulseContainer}>
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseScale }], opacity: pulseOpacity },
          ]}
        />
      </View>

      {/* Logo lockup */}
      <Animated.View
        style={[
          styles.logoWrap,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
      >
        <View style={styles.logoBox}>
          <Ionicons name="leaf" size={52} color="#00D09C" />
        </View>
        <Text style={styles.logoText}>PWS</Text>
        <Text style={styles.logoSub}>Personal Wellness System</Text>
      </Animated.View>

      {/* Animated tagline */}
      <Animated.View style={[styles.taglineWrap, { opacity: taglineOpacity }]}>
        <Text style={styles.tagline}>
          {TAGLINES.join('  ·  ')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0B2A20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0B2A20',
  },
  pulseContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 208, 156, 0.4)',
    backgroundColor: 'rgba(0, 208, 156, 0.06)',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoBox: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 208, 156, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 208, 156, 0.3)',
  },
  logoText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  logoSub: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  taglineWrap: {
    position: 'absolute',
    bottom: 80,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});
