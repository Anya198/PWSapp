import React, { useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface PillOption {
  label: string;
  value: string;
  icon?: string;
}

interface SelectPillProps {
  options: PillOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  label?: string;
}

interface SinglePillProps {
  option: PillOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

function SinglePill({ option, isSelected, onPress, index }: SinglePillProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const bgOpacity = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(bgOpacity, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
    if (isSelected) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, tension: 200, friction: 7 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 200, friction: 7 }),
      ]).start();
    }
  }, [isSelected]);

  const bg = bgOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E8F4EF', '#0B2A20'],
  });

  const textColor = isSelected ? '#FFFFFF' : '#0B2A20';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.pill, { transform: [{ scale }], backgroundColor: bg }]}>
        {option.icon ? <Text style={{ marginRight: 4, fontSize: 14 }}>{option.icon}</Text> : null}
        <Text style={[styles.pillText, { color: textColor }]}>{option.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * A row of animated pill/chip buttons for single-select options.
 * Each pill scales and transitions background on selection.
 */
export function SelectPill({ options, value, onChange, label }: SelectPillProps) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {options.map((opt, i) => (
          <SinglePill
            key={opt.value}
            option={opt}
            isSelected={value === opt.value}
            onPress={() => onChange(opt.value)}
            index={i}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A7064',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
