// src/components/ui/AlertDialog.tsx
// React Native port of alert-dialog.tsx (Radix UI → Modal + TouchableOpacity)

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Context ──────────────────────────────────────────────────────────────────

interface AlertDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextType>({
  open: false,
  setOpen: () => {},
});

// ─── AlertDialog (Root) ───────────────────────────────────────────────────────

interface AlertDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AlertDialog = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange }: AlertDialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (val: boolean) => {
    if (!isControlled) setUncontrolledOpen(val);
    onOpenChange?.(val);
  };

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

// ─── AlertDialogTrigger ───────────────────────────────────────────────────────

interface TriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AlertDialogTrigger = ({ children, style }: TriggerProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── AlertDialogContent ───────────────────────────────────────────────────────

interface ContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AlertDialogContent = ({ children, style }: ContentProps) => {
  const { open } = React.useContext(AlertDialogContext);

  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </Modal>
  );
};

// ─── AlertDialogHeader ────────────────────────────────────────────────────────

const AlertDialogHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);

// ─── AlertDialogFooter ────────────────────────────────────────────────────────

const AlertDialogFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

// ─── AlertDialogTitle ─────────────────────────────────────────────────────────

const AlertDialogTitle = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

// ─── AlertDialogDescription ───────────────────────────────────────────────────

const AlertDialogDescription = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── AlertDialogAction (confirm button) ───────────────────────────────────────

interface ActionProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AlertDialogAction = ({ children, onPress, style, textStyle }: ActionProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  return (
    <TouchableOpacity
      style={[styles.actionBtn, style]}
      onPress={() => { onPress?.(); setOpen(false); }}
      activeOpacity={0.85}
    >
      <Text style={[styles.actionText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

// ─── AlertDialogCancel ────────────────────────────────────────────────────────

const AlertDialogCancel = ({ children, onPress, style, textStyle }: ActionProps) => {
  const { setOpen } = React.useContext(AlertDialogContext);
  return (
    <TouchableOpacity
      style={[styles.cancelBtn, style]}
      onPress={() => { onPress?.(); setOpen(false); }}
      activeOpacity={0.8}
    >
      <Text style={[styles.cancelText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  header: {
    gap: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
  actionBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryForeground,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
