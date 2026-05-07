// src/components/ui/Badge.tsx
// React Native port of badge.tsx (cva variants → StyleSheet)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ─── Variant style maps ───────────────────────────────────────────────────────

const containerVariants: Record<BadgeVariant, ViewStyle> = {
  default: {
    backgroundColor: COLORS.primary,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  destructive: {
    backgroundColor: COLORS.destructive,
    borderColor: 'transparent',
    borderWidth: 1,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: COLORS.border,
    borderWidth: 1,
  },
};

const textVariants: Record<BadgeVariant, TextStyle> = {
  default: { color: COLORS.primaryForeground },
  secondary: { color: COLORS.foreground },
  destructive: { color: '#fff' },
  outline: { color: COLORS.foreground },
};

// ─── Badge ────────────────────────────────────────────────────────────────────

const Badge = ({ variant = 'default', children, style, textStyle }: BadgeProps) => {
  return (
    <View style={[styles.base, containerVariants[variant], style]}>
      <Text style={[styles.text, textVariants[variant], textStyle]}>
        {children}
      </Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export { Badge };
export type { BadgeProps };
