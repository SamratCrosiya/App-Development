// src/components/ui/Dialog.tsx
// React Native port of dialog.tsx (Radix DialogPrimitive → Modal)
// Shares the same pattern as AlertDialog but with a close X button

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextType>({ open: false, setOpen: () => {} });

// ─── Dialog (Root) ────────────────────────────────────────────────────────────

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Dialog = ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DialogProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : uncontrolled;

  const setOpen = (val: boolean) => {
    if (!isControlled) setUncontrolled(val);
    onOpenChange?.(val);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// ─── DialogTrigger ────────────────────────────────────────────────────────────

const DialogTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(DialogContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── DialogClose ──────────────────────────────────────────────────────────────

const DialogClose = ({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(DialogContext);
  return (
    <TouchableOpacity onPress={() => setOpen(false)} style={style} activeOpacity={0.7}>
      {children ?? <Text style={styles.closeIcon}>✕</Text>}
    </TouchableOpacity>
  );
};

// ─── DialogContent ────────────────────────────────────────────────────────────

interface ContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

const DialogContent = ({ children, style, scrollable = false }: ContentProps) => {
  const { open, setOpen } = React.useContext(DialogContext);
  const Inner = scrollable ? ScrollView : View;

  return (
    <Modal visible={open} transparent animationType="fade"
      statusBarTranslucent onRequestClose={() => setOpen(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={[styles.content, style]} onPress={() => {}}>
          {/* Auto close button */}
          <TouchableOpacity style={styles.closeBtn} onPress={() => setOpen(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          {scrollable ? (
            <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
          ) : (
            children
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── DialogHeader / Footer / Title / Description ──────────────────────────────

const DialogHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const DialogFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const DialogTitle = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const DialogDescription = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.secondary,
  },
  closeIcon: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    fontWeight: '700',
  },
  header: {
    gap: SPACING.xs,
    paddingRight: SPACING.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
});

export {
  Dialog, DialogTrigger, DialogClose, DialogContent,
  DialogHeader, DialogFooter, DialogTitle, DialogDescription,
};
