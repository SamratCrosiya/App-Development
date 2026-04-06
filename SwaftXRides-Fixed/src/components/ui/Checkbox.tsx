// src/components/ui/Checkbox.tsx
// React Native port of checkbox.tsx (Radix CheckboxPrimitive → TouchableOpacity)

import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: number;
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

const Checkbox = React.forwardRef<TouchableOpacity, CheckboxProps>(
  ({ checked: controlledChecked, defaultChecked = false, onCheckedChange, disabled, style, size = 20 }, ref) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolled;

    const toggle = () => {
      if (disabled) return;
      const next = !checked;
      if (!isControlled) setUncontrolled(next);
      onCheckedChange?.(next);
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={toggle}
        activeOpacity={0.7}
        disabled={disabled}
        style={[
          styles.root,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.2),
          },
          checked && styles.checked,
          disabled && styles.disabled,
          style,
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
      >
        {checked && (
          <Text style={[styles.check, { fontSize: size * 0.65 }]}>✓</Text>
        )}
      </TouchableOpacity>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ─── CheckboxWithLabel (bonus helper) ────────────────────────────────────────

interface CheckboxWithLabelProps extends CheckboxProps {
  label: string;
  labelStyle?: object;
}

const CheckboxWithLabel = ({ label, labelStyle, ...props }: CheckboxWithLabelProps) => (
  <TouchableOpacity
    style={styles.labelRow}
    onPress={() => !props.disabled && props.onCheckedChange?.(!props.checked)}
    activeOpacity={0.7}
  >
    <Checkbox {...props} />
    <Text style={[styles.label, props.disabled && styles.labelDisabled, labelStyle]}>{label}</Text>
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    flexShrink: 0,
  },
  checked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.5,
  },
  check: {
    color: COLORS.primaryForeground,
    fontWeight: '800',
    lineHeight: undefined,
    includeFontPadding: false,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  label: {
    fontSize: 14,
    color: COLORS.foreground,
    fontWeight: '500',
    flexShrink: 1,
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

export { Checkbox, CheckboxWithLabel };
