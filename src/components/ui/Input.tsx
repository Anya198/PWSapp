import React from 'react';
import { TextInput, View, Text, TextInputProps, StyleSheet } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#A0AAB2"
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginBottom: 18 },
  label: { color: '#EFF7F3', fontSize: 14, fontWeight: '700', marginBottom: 8, paddingHorizontal: 4 },
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
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4, paddingHorizontal: 4 },
});
