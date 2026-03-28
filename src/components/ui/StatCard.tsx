import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';

interface StatCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle | ViewStyle[];
  useSolidBackground?: boolean;
}

export function StatCard({ children, delay = 0, style, useSolidBackground = false }: StatCardProps) {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 9,
        tension: 40,
        delay,
        useNativeDriver: true,
      })
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View style={[
      styles.card, 
      useSolidBackground ? styles.solidCard : styles.glassCard,
      { opacity, transform: [{ translateY }] }, 
      style
    ]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Glassmorphism over deep forest
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  solidCard: {
    backgroundColor: '#0F3B2A', // Using forest.mid for contrast pop
    borderColor: '#1B5E40', // forest.light
  }
});
