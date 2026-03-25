import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) {
  const baseStyles = 'w-full rounded-lg py-4 flex-row justify-center items-center';
  
  const variants = {
    primary: 'bg-primary',
    secondary: 'bg-monochrome-800',
    outline: 'bg-transparent border border-monochrome-700',
  };

  const textVariants = {
    primary: 'text-monochrome-900 font-bold',
    secondary: 'text-white font-medium',
    outline: 'text-white font-medium',
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'primary' ? '#0D0D0D' : '#FFFFFF'} />
      ) : (
        <Text className={`text-center text-lg ${textVariants[variant]}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
