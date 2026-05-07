// src/components/ui/Sheet.tsx
// React Native port of sheet.tsx (Radix Dialog with side variants → Animated slide-in panels)

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Modal, TouchableOpacity, Animated, StyleSheet,
  Dimensions, ScrollView, ViewStyle, TextStyle, PanResponder,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

const { width: W, height: H } = Dimensions.get('window');
type Side = 'left' | 'right' | 'top' | 'bottom';

// ─── Context ──────────────────────────────────────────────────────────────────

const SheetContext = React.createContext<{ open: boolean; setOpen: (v: boolean) => void }>({
  open: false, setOpen: () => {},
});

// ─── Sheet (Root) ─────────────────────────────────────────────────────────────

interface SheetProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = ({ children, open: ctrl, defaultOpen = false, onOpenChange }: SheetProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = ctrl !== undefined;
  const open = isControlled ? ctrl! : uncontrolled;
  const setOpen = (val: boolean) => { if (!isControlled) setUncontrolled(val); onOpenChange?.(val); };
  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
};

// ─── SheetTrigger ─────────────────────────────────────────────────────────────

const SheetTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(SheetContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── SheetClose ───────────────────────────────────────────────────────────────

const SheetClose = ({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <TouchableOpacity onPress={() => setOpen(false)} style={style} activeOpacity={0.7}>
      {children ?? <Text style={closeStyle.x}>✕</Text>}
    </TouchableOpacity>
  );
};
const closeStyle = StyleSheet.create({ x: { fontSize: 16, color: COLORS.mutedForeground, fontWeight: '700' } });

// ─── SheetContent ─────────────────────────────────────────────────────────────

interface SheetContentProps {
  children: React.ReactNode;
  side?: Side;
  style?: ViewStyle;
  size?: number; // width for left/right, height for top/bottom (default 75% of screen)
}

const SheetContent = ({ children, side = 'right', style, size }: SheetContentProps) => {
  const { open, setOpen } = React.useContext(SheetContext);
  const isH = side === 'left' || side === 'right';
  const sheetSize = size ?? (isH ? W * 0.78 : H * 0.5);

  const translateAnim = useRef(
    new Animated.Value(side === 'left' ? -sheetSize : side === 'right' ? sheetSize : side === 'top' ? -sheetSize : sheetSize)
  ).current;

  useEffect(() => {
    Animated.spring(translateAnim, {
      toValue: open ? 0 : (side === 'left' ? -sheetSize : side === 'right' ? sheetSize : side === 'top' ? -sheetSize : sheetSize),
      useNativeDriver: true,
      damping: 22,
      stiffness: 200,
    }).start();
  }, [open]);

  const positionStyle: ViewStyle = {
    position: 'absolute',
    ...(isH
      ? { top: 0, bottom: 0, width: sheetSize, [side]: 0 }
      : { left: 0, right: 0, height: sheetSize, [side]: 0 }),
  };

  const transform = isH
    ? [{ translateX: translateAnim }]
    : [{ translateY: translateAnim }];

  return (
    <Modal visible={open} transparent animationType="none" statusBarTranslucent onRequestClose={() => setOpen(false)}>
      {/* Dim overlay */}
      <Animated.View style={[styles.overlay, { opacity: open ? 1 : 0 }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setOpen(false)} />
      </Animated.View>

      {/* Sheet panel */}
      <Animated.View style={[styles.panel, positionStyle, { transform }, style]}>
        {/* Auto close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

// ─── SheetHeader / Footer / Title / Description ───────────────────────────────

const SheetHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);
const SheetFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);
const SheetTitle = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);
const SheetDescription = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  panel: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 28, height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeBtnText: { fontSize: 12, color: COLORS.mutedForeground, fontWeight: '700' },
  header: { gap: 6, marginBottom: SPACING.md, paddingTop: SPACING.lg },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.sm, marginTop: SPACING.md },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.foreground },
  description: { fontSize: 13, color: COLORS.mutedForeground, lineHeight: 20 },
});

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
