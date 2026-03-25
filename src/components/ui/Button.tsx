import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', icon, isLoading, className = '', ...props }: ButtonProps) {
  const baseStyles = 'w-full rounded-2xl py-4 flex-row justify-center items-center shadow-sm';
  
  const variants = {
    primary: 'bg-button-dark',
    secondary: 'bg-button-light shadow-none',
    accent: 'bg-primary',
    outline: 'bg-transparent border border-gray-300 shadow-none',
  };

  const textVariants = {
    primary: 'text-white font-bold',
    secondary: 'text-text-dark font-bold',
    accent: 'text-white font-bold',
    outline: 'text-text-dark font-bold',
  };

  return (
    <TouchableOpacity
      className={`${baseStyles} ${variants[variant]} ${props.disabled ? 'opacity-50' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#0B2A20' : '#FFFFFF'} />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text className={`text-center text-lg ${textVariants[variant]}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
