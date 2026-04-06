// src/components/ui/Button.tsx
// React Native port of button.tsx (cva variants → StyleSheet, Slot → children clone)

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { COLORS, SPACING, RADIUS, useAppTheme } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// ─── Variant & size style maps ────────────────────────────────────────────────

const containerSizes: Record<ButtonSize, ViewStyle> = {
  default: { height: 42, paddingHorizontal: SPACING.md },
  sm: { height: 36, paddingHorizontal: SPACING.sm + 4, borderRadius: RADIUS.md },
  lg: { height: 46, paddingHorizontal: SPACING.xl },
  icon: { height: 42, width: 42, paddingHorizontal: 0 },
};

const textSizes: Record<ButtonSize, TextStyle> = {
  default: { fontSize: 14 },
  sm: { fontSize: 13 },
  lg: { fontSize: 16 },
  icon: { fontSize: 14 },
};

// ─── Button ───────────────────────────────────────────────────────────────────

const Button = React.forwardRef<TouchableOpacity, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      children,
      loading = false,
      disabled,
      style,
      textStyle,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    useAppTheme();
    const isDisabled = disabled || loading;
    const containerVariants: Record<ButtonVariant, ViewStyle> = {
      default: { backgroundColor: COLORS.primary },
      destructive: { backgroundColor: COLORS.destructive },
      outline: {
        backgroundColor: COLORS.background,
        borderWidth: 1,
        borderColor: COLORS.border,
      },
      secondary: { backgroundColor: COLORS.secondary },
      ghost: { backgroundColor: 'transparent' },
      link: { backgroundColor: 'transparent' },
    };
    const textVariants: Record<ButtonVariant, TextStyle> = {
      default: { color: COLORS.primaryForeground },
      destructive: { color: COLORS.white },
      outline: { color: COLORS.foreground },
      secondary: { color: COLORS.foreground },
      ghost: { color: COLORS.foreground },
      link: { color: COLORS.primary, textDecorationLine: 'underline' },
    };

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.82}
        disabled={isDisabled}
        style={[
          styles.base,
          containerVariants[variant],
          containerSizes[size],
          isDisabled && styles.disabled,
          style,
        ]}
        {...props}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'default' ? COLORS.primaryForeground : COLORS.foreground}
          />
        ) : (
          <>
            {leftIcon}
            {typeof children === 'string' ? (
              <Text style={[styles.text, textVariants[variant], textSizes[size], textStyle]}>
                {children}
              </Text>
            ) : (
              children
            )}
            {rightIcon}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
