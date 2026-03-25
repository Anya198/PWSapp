import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className={`w-full mb-5 ${className}`}>
      <Text className="text-text-dark text-sm mb-2 font-bold px-2">{label}</Text>
      <TextInput
        placeholderTextColor="#A0AAB2"
        className={`w-full bg-white text-text-dark rounded-2xl px-5 py-4 shadow-sm border ${
          error ? 'border-red-500' : 'border-transparent'
        } focus:border-primary`}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-2 px-2">{error}</Text>}
    </View>
  );
}
