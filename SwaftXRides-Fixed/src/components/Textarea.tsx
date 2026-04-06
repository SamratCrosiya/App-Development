// src/components/ui/Textarea.tsx
// React Native port of textarea.tsx (HTML textarea → multiline TextInput)

import React, { useState } from 'react';
import {
  TextInput, View, StyleSheet, TextInputProps, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

interface TextareaProps extends TextInputProps {
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  error?: boolean;
  minHeight?: number;
  maxHeight?: number;
}

const Textarea = React.forwardRef<TextInput, TextareaProps>(
  (
    {
      containerStyle,
      inputStyle,
      error,
      editable = true,
      minHeight = 80,
      maxHeight,
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
          { minHeight },
          maxHeight ? { maxHeight } : null,
          focused && styles.focused,
          error && styles.error,
          !editable && styles.disabled,
          containerStyle,
        ]}
      >
        <TextInput
          ref={ref}
          multiline
          textAlignVertical="top"
          style={[styles.input, inputStyle]}
          placeholderTextColor={COLORS.muted}
          editable={editable}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          {...props}
        />
      </View>
    );
  }
);

Textarea.displayName = 'Textarea';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm,
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
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 22,
    padding: 0,      // remove default TextInput padding
  },
});

export { Textarea };
export type { TextareaProps };
