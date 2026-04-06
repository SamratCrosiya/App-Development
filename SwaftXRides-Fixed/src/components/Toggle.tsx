// src/components/ui/Toggle.tsx
// React Native port of toggle.tsx (Radix TogglePrimitive + cva → TouchableOpacity with state)

import React, { useState } from 'react';
import {
  TouchableOpacity, Text, View, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToggleVariant = 'default' | 'outline';
type ToggleSize = 'default' | 'sm' | 'lg';

interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  variant?: ToggleVariant;
  size?: ToggleSize;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

// ─── Size & Variant maps ──────────────────────────────────────────────────────

const containerSizes: Record<ToggleSize, ViewStyle> = {
  default: { height: 40, paddingHorizontal: SPACING.sm + 4 },
  sm: { height: 36, paddingHorizontal: SPACING.sm + 2 },
  lg: { height: 44, paddingHorizontal: SPACING.md + 4 },
};

const containerVariants = (pressed: boolean): Record<ToggleVariant, ViewStyle> => ({
  default: {
    backgroundColor: pressed ? COLORS.secondary : 'transparent',
  },
  outline: {
    backgroundColor: pressed ? COLORS.secondary : 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

// ─── Toggle ───────────────────────────────────────────────────────────────────

const Toggle = React.forwardRef<TouchableOpacity, ToggleProps>(
  (
    {
      pressed: controlled,
      defaultPressed = false,
      onPressedChange,
      disabled = false,
      variant = 'default',
      size = 'default',
      children,
      style,
      textStyle,
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = useState(defaultPressed);
    const isControlled = controlled !== undefined;
    const pressed = isControlled ? controlled! : uncontrolled;

    const handlePress = () => {
      if (disabled) return;
      const next = !pressed;
      if (!isControlled) setUncontrolled(next);
      onPressedChange?.(next);
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.75}
        accessibilityRole="togglebutton"
        accessibilityState={{ checked: pressed, disabled }}
        style={[
          styles.base,
          containerSizes[size],
          containerVariants(pressed)[variant],
          disabled && styles.disabled,
          style,
        ]}
      >
        {typeof children === 'string' ? (
          <Text style={[styles.text, pressed && styles.textActive, textStyle]}>{children}</Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

Toggle.displayName = 'Toggle';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  disabled: { opacity: 0.45 },
  text: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.mutedForeground,
  },
  textActive: {
    color: COLORS.foreground,
    fontWeight: '600',
  },
});

export { Toggle };
export type { ToggleProps, ToggleVariant, ToggleSize };
