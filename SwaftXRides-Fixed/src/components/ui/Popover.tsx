// src/components/ui/Popover.tsx
// React Native port of popover.tsx (Radix → Modal centered or anchored popover)

import React, { useState } from 'react';
import {
  View, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Context ──────────────────────────────────────────────────────────────────

const PopoverContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void }>({
  open: false, setOpen: () => {},
});

// ─── Popover (Root) ───────────────────────────────────────────────────────────

interface PopoverProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = ({ children, open: ctrl, defaultOpen = false, onOpenChange }: PopoverProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = ctrl !== undefined;
  const open = isControlled ? ctrl! : uncontrolled;
  const setOpen = (val: boolean) => { if (!isControlled) setUncontrolled(val); onOpenChange?.(val); };
  return <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>;
};

// ─── PopoverTrigger ───────────────────────────────────────────────────────────

const PopoverTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(PopoverContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── PopoverContent ───────────────────────────────────────────────────────────

interface PopoverContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: 'left' | 'center' | 'right';
  width?: number;
}

const PopoverContent = ({ children, style, align = 'center', width = 288 }: PopoverContentProps) => {
  const { open, setOpen } = React.useContext(PopoverContext);
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[
              styles.content,
              { width },
              align === 'right' && styles.alignRight,
              align === 'left' && styles.alignLeft,
              style,
            ]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ─── PopoverClose (bonus) ─────────────────────────────────────────────────────

const PopoverClose = ({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(PopoverContext);
  return <TouchableOpacity onPress={() => setOpen(false)} style={style} activeOpacity={0.7}>{children}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  alignRight: { alignSelf: 'flex-end' },
  alignLeft: { alignSelf: 'flex-start' },
});

export { Popover, PopoverTrigger, PopoverContent, PopoverClose };
