import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

interface ProgressBarProps {
  /** Current step (1-indexed) */
  step: number;
  /** Total number of steps */
  totalSteps: number;
  color?: string;
  trackColor?: string;
}

/**
 * Animated thin progress bar for multi-step onboarding.
 * The filled width transitions smoothly via spring when step changes.
 */
export function ProgressBar({
  step,
  totalSteps,
  color = '#0B2A20',
  trackColor = '#E8F4EF',
}: ProgressBarProps) {
  const progress = useRef(new Animated.Value((step - 1) / totalSteps)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: step / totalSteps,
      useNativeDriver: false,
      tension: 80,
      friction: 10,
    }).start();
  }, [step, totalSteps]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { backgroundColor: trackColor }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, width }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: 2,
  },
});
