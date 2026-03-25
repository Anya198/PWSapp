import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <View className={`w-full mb-4 ${className}`}>
      <Text className="text-monochrome-100 text-sm mb-2 font-medium">{label}</Text>
      <TextInput
        placeholderTextColor="#555"
        className={`w-full bg-monochrome-800 text-white rounded-lg px-4 py-4 border ${
          error ? 'border-red-500' : 'border-monochrome-700'
        } focus:border-primary`}
        {...props}
      />
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
