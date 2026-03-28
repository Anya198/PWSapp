import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PhaseCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  isSelected: boolean;
  onPress: () => void;
  /** Stagger delay in ms (for fan-in entrance animation) */
  entranceDelay?: number;
}

/**
 * Premium phase selection card with gradient-style design and staggered entrance.
 * When selected, the card expands (scale + opacity) with spring physics.
 * Inspired by the Cash App "card fan" animation pattern.
 */
export const PhaseCard = React.memo(function PhaseCard({
  id,
  title,
  subtitle,
  description,
  duration,
  icon,
  accentColor,
  isSelected,
  onPress,
  entranceDelay = 0,
}: PhaseCardProps) {
  const scale = useRef(new Animated.Value(isSelected ? 1 : 0.97)).current;
  const borderOpacity = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Entrance animation — fan in with stagger
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        delay: entranceDelay,
        useNativeDriver: true,
        tension: 70,
        friction: 9,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        delay: entranceDelay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Selection animation
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isSelected ? 1 : 0.97,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(borderOpacity, {
        toValue: isSelected ? 1 : 0,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
    ]).start();
  }, [isSelected]);

  const borderColor = borderOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(11,42,32,0)', accentColor],
  });

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale }, { translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <Animated.View
          style={[
            styles.card,
            { borderColor, borderWidth: 2, backgroundColor: isSelected ? '#0B2A20' : '#FFFFFF' },
          ]}
        >
          {/* Header row */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: `${accentColor}22` }]}>
              <Ionicons name={icon} size={22} color={isSelected ? '#FFFFFF' : accentColor} />
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: isSelected ? '#FFFFFF' : '#0B2A20' }]}>
                {title}
              </Text>
              <Text style={[styles.subtitle, { color: isSelected ? '#94c49e' : '#118a7e' }]}>
                {subtitle}
              </Text>
            </View>
            {isSelected && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#00D09C" />
              </View>
            )}
          </View>

          {/* Body */}
          <Text style={[styles.description, { color: isSelected ? '#b8d0c0' : '#4A7064' }]}>
            {description}
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={[styles.badge, { backgroundColor: isSelected ? 'rgba(255,255,255,0.12)' : '#E8F4EF' }]}>
              <Ionicons
                name="time-outline"
                size={12}
                color={isSelected ? '#94c49e' : '#118a7e'}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.badgeText, { color: isSelected ? '#94c49e' : '#118a7e' }]}>
                {duration}
              </Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  checkmark: {
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
