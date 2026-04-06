// src/components/ui/Alert.tsx
// React Native port of alert.tsx (Radix UI cva variants → StyleSheet)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

// ─── Alert ────────────────────────────────────────────────────────────────────

const Alert = ({ variant = 'default', children, style }: AlertProps) => {
  return (
    <View
      style={[
        styles.base,
        variant === 'destructive' ? styles.destructive : styles.default,
        style,
      ]}
      accessibilityRole="alert"
    >
      {children}
    </View>
  );
};

// ─── AlertTitle ───────────────────────────────────────────────────────────────

const AlertTitle = ({ children, style }: AlertTitleProps) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

// ─── AlertDescription ─────────────────────────────────────────────────────────

const AlertDescription = ({ children, style }: AlertDescriptionProps) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    padding: SPACING.md,
  },
  default: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.border,
  },
  destructive: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.foreground,
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    lineHeight: 20,
  },
});

export { Alert, AlertTitle, AlertDescription };
