import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator, StyleSheet } from 'react-native';

const COLORS = {
  primary: '#118a7e',
  darkBtn: '#062C22',
  lightBtn: '#E8EAE8',
  white: '#FFFFFF',
  dark: '#0B2A20',
};

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function Button({ title, variant = 'primary', icon, isLoading, style, ...props }: ButtonProps) {
  const bgColor = {
    primary: COLORS.darkBtn,
    secondary: COLORS.lightBtn,
    accent: COLORS.primary,
    outline: 'transparent',
  }[variant];

  const textColor = variant === 'secondary' ? COLORS.dark : COLORS.white;

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: bgColor, borderWidth: variant === 'outline' ? 1 : 0, borderColor: '#ccc' },
        props.disabled ? { opacity: 0.5 } : null,
        style,
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon}
          <Text style={[styles.btnText, { color: textColor }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});
