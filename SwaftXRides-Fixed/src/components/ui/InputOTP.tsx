// src/components/ui/InputOTP.tsx
// React Native port of input-otp.tsx
// input-otp library → custom RN OTP with individual digit boxes

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface InputOTPProps {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  slotStyle?: ViewStyle;
  slotTextStyle?: TextStyle;
  separator?: boolean;        // show a dot between groups
  groupSize?: number;         // digits per group (default 3 for 6-digit OTP)
}

// ─── InputOTP ─────────────────────────────────────────────────────────────────

const InputOTP = ({
  maxLength = 6,
  value: controlledValue,
  onChange,
  disabled = false,
  containerStyle,
  slotStyle,
  slotTextStyle,
  separator = true,
  groupSize = 3,
}: InputOTPProps) => {
  const [uncontrolled, setUncontrolled] = useState('');
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue! : uncontrolled;

  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, maxLength);
    if (!isControlled) setUncontrolled(digits);
    onChange?.(digits);
  };

  const slots = Array.from({ length: maxLength }, (_, i) => ({
    char: value[i] ?? '',
    isActive: focused && value.length === i,
    isFilled: i < value.length,
  }));

  // Group slots
  const groups: typeof slots[] = [];
  for (let i = 0; i < slots.length; i += groupSize) {
    groups.push(slots.slice(i, i + groupSize));
  }

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => inputRef.current?.focus()}
      activeOpacity={1}
    >
      {/* Hidden real input */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        keyboardType="numeric"
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.hiddenInput}
        editable={!disabled}
        caretHidden
      />

      {/* Visual slots */}
      <View style={styles.slotsRow}>
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && separator && <Text style={styles.separator}>·</Text>}
            <View style={styles.group}>
              {group.map((slot, si) => {
                const globalIdx = gi * groupSize + si;
                return (
                  <View
                    key={si}
                    style={[
                      styles.slot,
                      slot.isActive && styles.slotActive,
                      slot.isFilled && styles.slotFilled,
                      slotStyle,
                    ]}
                  >
                    {slot.isActive && !slot.char ? (
                      // Blinking caret
                      <View style={styles.caret} />
                    ) : (
                      <Text style={[styles.slotText, slotTextStyle]}>{slot.char}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </React.Fragment>
        ))}
      </View>
    </TouchableOpacity>
  );
};

// ─── InputOTPGroup (for layout grouping) ──────────────────────────────────────

const InputOTPGroup = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row' }, style]}>{children}</View>
);

// ─── InputOTPSlot (individual slot, standalone use) ───────────────────────────

interface InputOTPSlotProps {
  char?: string;
  isActive?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const InputOTPSlot = ({ char, isActive, style, textStyle }: InputOTPSlotProps) => (
  <View style={[styles.slot, isActive && styles.slotActive, style]}>
    <Text style={[styles.slotText, textStyle]}>{char ?? ''}</Text>
  </View>
);

// ─── InputOTPSeparator ────────────────────────────────────────────────────────

const InputOTPSeparator = () => <Text style={styles.separator}>·</Text>;

// ─── Styles ───────────────────────────────────────────────────────────────────

const SLOT_SIZE = 44;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  slotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  group: {
    flexDirection: 'row',
  },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  slotActive: {
    borderColor: COLORS.primary,
    zIndex: 1,
  },
  slotFilled: {
    borderColor: COLORS.borderLight,
  },
  slotText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  caret: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.foreground,
    borderRadius: 1,
  },
  separator: {
    fontSize: 20,
    color: COLORS.muted,
    lineHeight: SLOT_SIZE,
  },
});

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
