// src/components/ui/ToggleGroup.tsx
// React Native port of toggle-group.tsx (Radix ToggleGroupPrimitive → Context + Toggle row)

import React, { useState } from 'react';
import {
  View, StyleSheet, ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { Toggle } from './Toggle';
import type { ToggleVariant, ToggleSize } from './Toggle';

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToggleGroupContextType {
  value: string[];
  type: 'single' | 'multiple';
  onValueChange: (v: string) => void;
  variant: ToggleVariant;
  size: ToggleSize;
  disabled: boolean;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextType>({
  value: [],
  type: 'single',
  onValueChange: () => {},
  variant: 'default',
  size: 'default',
  disabled: false,
});

// ─── ToggleGroup (Root) ───────────────────────────────────────────────────────

interface ToggleGroupProps {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const ToggleGroup = ({
  type = 'single',
  value: controlled,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  style,
}: ToggleGroupProps) => {
  const normalize = (v?: string | string[]): string[] =>
    v === undefined ? [] : Array.isArray(v) ? v : [v];

  const [uncontrolled, setUncontrolled] = useState<string[]>(normalize(defaultValue));
  const isControlled = controlled !== undefined;
  const valueArr = isControlled ? normalize(controlled) : uncontrolled;

  const handleToggle = (item: string) => {
    let next: string[];
    if (type === 'single') {
      next = valueArr.includes(item) ? [] : [item];
    } else {
      next = valueArr.includes(item)
        ? valueArr.filter((v) => v !== item)
        : [...valueArr, item];
    }
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(type === 'single' ? next[0] ?? '' : next);
  };

  return (
    <ToggleGroupContext.Provider
      value={{ value: valueArr, type, onValueChange: handleToggle, variant, size, disabled }}
    >
      <View style={[styles.root, style]}>{children}</View>
    </ToggleGroupContext.Provider>
  );
};

// ─── ToggleGroupItem ──────────────────────────────────────────────────────────

interface ToggleGroupItemProps {
  value: string;
  children?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  variant?: ToggleVariant;
  size?: ToggleSize;
}

const ToggleGroupItem = ({
  value,
  children,
  disabled: itemDisabled,
  style,
  variant: itemVariant,
  size: itemSize,
}: ToggleGroupItemProps) => {
  const ctx = React.useContext(ToggleGroupContext);
  const pressed = ctx.value.includes(value);
  const isDisabled = itemDisabled || ctx.disabled;

  return (
    <Toggle
      pressed={pressed}
      onPressedChange={() => ctx.onValueChange(value)}
      disabled={isDisabled}
      variant={itemVariant ?? ctx.variant}
      size={itemSize ?? ctx.size}
      style={style}
    >
      {children}
    </Toggle>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
});

export { ToggleGroup, ToggleGroupItem };
