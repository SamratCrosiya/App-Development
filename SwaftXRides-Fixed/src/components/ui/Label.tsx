// src/components/ui/Label.tsx
// React Native port of label.tsx (Radix LabelPrimitive → Text)

import React from 'react';
import { Text, StyleSheet, TextStyle, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LabelProps {
  children: React.ReactNode;
  style?: TextStyle;
  disabled?: boolean;
  required?: boolean;
  onPress?: () => void;   // for associating with a form field
}

// ─── Label ────────────────────────────────────────────────────────────────────

const Label = ({ children, style, disabled, required, onPress }: LabelProps) => {
  const inner = (
    <Text
      style={[
        styles.label,
        disabled && styles.disabled,
        style,
      ]}
    >
      {children}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.foreground,
    lineHeight: 18,
  },
  disabled: {
    opacity: 0.7,
  },
  required: {
    color: COLORS.destructive,
    fontSize: 14,
  },
});

export { Label };
