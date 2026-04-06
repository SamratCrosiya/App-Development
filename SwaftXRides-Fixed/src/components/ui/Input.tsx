// src/components/ui/Input.tsx
// React Native port of input.tsx (HTML input → TextInput)

import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
  disabled?: boolean;
}

// ─── Input ────────────────────────────────────────────────────────────────────

const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      containerStyle,
      inputStyle,
      leftIcon,
      rightIcon,
      error,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);

    return (
      <View
        style={[
          styles.container,
          focused && styles.focused,
          error && styles.error,
          disabled && styles.disabled,
          containerStyle,
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            leftIcon ? styles.inputWithLeft : null,
            rightIcon ? styles.inputWithRight : null,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.muted}
          editable={!disabled}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
    );
  }
);

Input.displayName = 'Input';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  focused: {
    borderColor: COLORS.primary,
  },
  error: {
    borderColor: COLORS.destructive,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    fontSize: 14,
    color: COLORS.foreground,
    height: '100%',
  },
  inputWithLeft: {
    paddingLeft: SPACING.xs,
  },
  inputWithRight: {
    paddingRight: SPACING.xs,
  },
  iconLeft: {
    paddingLeft: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRight: {
    paddingRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { Input };
export type { InputProps };
