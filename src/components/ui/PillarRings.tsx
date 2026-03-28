import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface PillarRingsProps {
  size: number;
  strokeWidth: number;
  pillars: {
    fuel: number;
    strength: number;
    recovery: number;
    focus: number;
    discipline: number;
  };
}

export function PillarRings({ size, strokeWidth, pillars }: PillarRingsProps) {
  const center = size / 2;

  const data = [
    { key: 'fuel', color: '#00D09C', value: pillars.fuel },
    { key: 'strength', color: '#F59E0B', value: pillars.strength }, 
    { key: 'recovery', color: '#8B5CF6', value: pillars.recovery }, 
    { key: 'focus', color: '#3B82F6', value: pillars.focus },       
    { key: 'discipline', color: '#E11D48', value: pillars.discipline }, 
  ];

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {data.map((item, index) => {
            // Tighter radius spacing: strokeWidth + 2 instead of + 4
            const radius = (size / 2) - (strokeWidth / 2) - (index * (strokeWidth + 2));
            return (
              <Ring
                key={item.key}
                radius={radius}
                strokeWidth={strokeWidth}
                color={item.color}
                percentage={item.value}
                center={center}
                delay={index * 150} 
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
}

function Ring({ radius, strokeWidth, color, percentage, center, delay }: any) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(animatedValue, {
        toValue: percentage,
        friction: 6,
        tension: 40,
        useNativeDriver: false, // Must be false for SVG attributes
      })
    ]).start();
  }, [percentage, delay]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
    extrapolate: 'clamp'
  });

  return (
    <>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={0.15}
        fill="transparent"
      />
      <AnimatedCircle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        fill="transparent"
      />
    </>
  );
}
