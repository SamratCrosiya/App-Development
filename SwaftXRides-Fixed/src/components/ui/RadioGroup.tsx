// src/components/ui/RadioGroup.tsx
// React Native port of radio-group.tsx (Radix RadioGroupPrimitive → Context + TouchableOpacity)

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Context ──────────────────────────────────────────────────────────────────

const RadioGroupContext = React.createContext<{
  value: string;
  onValueChange: (v: string) => void;
  disabled: boolean;
}>({ value: '', onValueChange: () => {}, disabled: false });

// ─── RadioGroup (Root) ────────────────────────────────────────────────────────

interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const RadioGroup = ({
  value: controlled,
  defaultValue = '',
  onValueChange,
  disabled = false,
  children,
  style,
}: RadioGroupProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled! : uncontrolled;

  const handleChange = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: handleChange, disabled }}>
      <View style={[styles.root, style]}>{children}</View>
    </RadioGroupContext.Provider>
  );
};

// ─── RadioGroupItem ───────────────────────────────────────────────────────────

interface RadioGroupItemProps {
  value: string;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: number;
}

const RadioGroupItem = ({
  value,
  label,
  disabled: itemDisabled,
  style,
  labelStyle,
  size = 20,
}: RadioGroupItemProps) => {
  const { value: groupValue, onValueChange, disabled: groupDisabled } = React.useContext(RadioGroupContext);
  const isChecked = groupValue === value;
  const isDisabled = itemDisabled || groupDisabled;

  return (
    <TouchableOpacity
      style={[styles.itemRow, style]}
      onPress={() => !isDisabled && onValueChange(value)}
      activeOpacity={0.7}
      disabled={isDisabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: isChecked, disabled: isDisabled }}
    >
      {/* Radio circle */}
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          isDisabled && styles.disabled,
        ]}
      >
        {isChecked && (
          <View
            style={[
              styles.dot,
              { width: size * 0.45, height: size * 0.45, borderRadius: (size * 0.45) / 2 },
            ]}
          />
        )}
      </View>
      {label && (
        <Text style={[styles.label, isDisabled && styles.labelDisabled, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { gap: SPACING.sm },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  circle: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dot: {
    backgroundColor: COLORS.primary,
  },
  disabled: { opacity: 0.5 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.foreground,
    flex: 1,
  },
  labelDisabled: { opacity: 0.5 },
});

export { RadioGroup, RadioGroupItem };
