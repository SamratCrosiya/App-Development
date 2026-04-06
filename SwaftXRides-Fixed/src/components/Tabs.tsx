// src/components/ui/Tabs.tsx
// React Native port of tabs.tsx (Radix TabsPrimitive → Context + ScrollView list + content swap)

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  ViewStyle, TextStyle, Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextType {
  value: string;
  onValueChange: (v: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({ value: '', onValueChange: () => {} });

// ─── Tabs (Root) ──────────────────────────────────────────────────────────────

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Tabs = ({ defaultValue = '', value: controlled, onValueChange, children, style }: TabsProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled! : uncontrolled;

  const handleChange = (v: string) => {
    if (!isControlled) setUncontrolled(v);
    onValueChange?.(v);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <View style={style}>{children}</View>
    </TabsContext.Provider>
  );
};

// ─── TabsList ─────────────────────────────────────────────────────────────────

interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

const TabsList = ({ children, style, scrollable = false }: TabsListProps) => {
  const inner = (
    <View style={[styles.list, style]}>{children}</View>
  );
  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={[styles.list, style]}>{children}</View>
      </ScrollView>
    );
  }
  return inner;
};

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const TabsTrigger = ({ value, children, disabled, style, textStyle, icon }: TabsTriggerProps) => {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <TouchableOpacity
      style={[
        styles.trigger,
        isActive && styles.triggerActive,
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => !disabled && onValueChange(value)}
      activeOpacity={0.75}
      disabled={disabled}
    >
      {icon && <View style={styles.triggerIcon}>{icon}</View>}
      <Text
        style={[
          styles.triggerText,
          isActive && styles.triggerTextActive,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

// ─── TabsContent ──────────────────────────────────────────────────────────────

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
  keepMounted?: boolean;   // keep rendered but hidden (default: false = unmount)
}

const TabsContent = ({ value, children, style, keepMounted = false }: TabsContentProps) => {
  const { value: activeValue } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  if (!keepMounted) {
    if (!isActive) return null;
    return <View style={[styles.content, style]}>{children}</View>;
  }

  // keepMounted: render always, just hide visually
  return (
    <View style={[styles.content, !isActive && styles.hidden, style]}>
      {children}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 2,
  },
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.sm - 1,
    borderRadius: RADIUS.sm,
    minHeight: 36,
  },
  triggerActive: {
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: { opacity: 0.45 },
  triggerIcon: { flexShrink: 0 },
  triggerText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.muted,
    textAlign: 'center',
  },
  triggerTextActive: {
    color: COLORS.foreground,
    fontWeight: '600',
  },
  content: {
    marginTop: SPACING.sm,
  },
  hidden: {
    display: 'none',
  },
});

export { Tabs, TabsList, TabsTrigger, TabsContent };
