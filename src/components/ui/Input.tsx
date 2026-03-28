import React from 'react';
import { TextInput, View, Text, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  variant?: 'light' | 'dark';
}

export function Input({ label, error, variant = 'dark', style, ...props }: InputProps) {
  const isLight = variant === 'light';
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, isLight && styles.labelLight]}>{label}</Text>
      <TextInput
        placeholderTextColor={isLight ? '#9EA8A3' : '#A0AAB2'}
        style={[styles.input, isLight && styles.inputLight, error && styles.inputError, style]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 18 },
  label: { color: '#EFF7F3', fontSize: 14, fontWeight: '700', marginBottom: 8, paddingHorizontal: 4 },
  labelLight: { color: '#0B2A20' }, // Dark label for light backgrounds
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputLight: {
    backgroundColor: '#F5F9F7',
    color: '#0B2A20',
    borderColor: '#E8F4EF',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, paddingHorizontal: 4 },
});
