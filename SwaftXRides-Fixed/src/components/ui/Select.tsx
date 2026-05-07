// src/components/ui/Select.tsx
// React Native port of select.tsx (Radix SelectPrimitive → Modal picker)

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal, FlatList,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  triggerStyle?: ViewStyle;
  triggerTextStyle?: TextStyle;
}

// ─── Select ───────────────────────────────────────────────────────────────────

const Select = ({
  options,
  value: controlled,
  defaultValue = '',
  onValueChange,
  placeholder = 'Select…',
  disabled = false,
  style,
  triggerStyle,
  triggerTextStyle,
}: SelectProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled! : uncontrolled;
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((o) => o.value === value);

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isControlled) setUncontrolled(opt.value);
    onValueChange?.(opt.value);
    setOpen(false);
  };

  // Group options
  const groups: Record<string, SelectOption[]> = {};
  options.forEach((opt) => {
    const g = opt.group ?? '';
    if (!groups[g]) groups[g] = [];
    groups[g].push(opt);
  });
  const groupEntries = Object.entries(groups);

  return (
    <View style={style}>
      {/* Trigger */}
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.disabled, triggerStyle]}
        onPress={() => !disabled && setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.triggerText, !value && styles.placeholder, triggerTextStyle]} numberOfLines={1}>
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={styles.chevron}>⌄</Text>
      </TouchableOpacity>

      {/* Picker modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
            <FlatList
              data={groupEntries}
              keyExtractor={([group]) => group}
              showsVerticalScrollIndicator={false}
              renderItem={({ item: [group, groupOptions] }) => (
                <View>
                  {group !== '' && <Text style={styles.groupLabel}>{group}</Text>}
                  {groupOptions.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      style={[styles.option, opt.disabled && styles.optionDisabled]}
                      onPress={() => handleSelect(opt)}
                      disabled={opt.disabled}
                      activeOpacity={0.7}
                    >
                      <View style={styles.checkSlot}>
                        {opt.value === value && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                      <Text style={[styles.optionText, opt.disabled && styles.optionTextDisabled]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm + 4,
  },
  disabled: { opacity: 0.5 },
  triggerText: { flex: 1, fontSize: 14, color: COLORS.foreground, fontWeight: '400' },
  placeholder: { color: COLORS.muted },
  chevron: { fontSize: 16, color: COLORS.muted, marginLeft: SPACING.sm },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '60%',
    backgroundColor: COLORS.card,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xs,
    ...SHADOWS.card,
  },
  groupLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 0.8,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs + 2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.sm,
  },
  optionDisabled: { opacity: 0.4 },
  checkSlot: { width: 24, alignItems: 'center' },
  checkmark: { fontSize: 14, color: COLORS.primary, fontWeight: '800' },
  optionText: { flex: 1, fontSize: 14, color: COLORS.foreground },
  optionTextDisabled: { color: COLORS.muted },
});

export { Select };
