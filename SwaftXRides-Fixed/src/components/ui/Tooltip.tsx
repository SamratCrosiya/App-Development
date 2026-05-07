// src/components/ui/Tooltip.tsx
// React Native port of tooltip.tsx
// Radix TooltipPrimitive → long-press triggered Animated bubble

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet,
  ViewStyle, TextStyle, Modal, TouchableWithoutFeedback,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Context (TooltipProvider sets default delay) ────────────────────────────

interface TooltipProviderContextType {
  delayDuration: number;
}

const TooltipProviderContext = React.createContext<TooltipProviderContextType>({
  delayDuration: 500,
});

const TooltipProvider = ({
  children,
  delayDuration = 500,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) => (
  <TooltipProviderContext.Provider value={{ delayDuration }}>
    {children}
  </TooltipProviderContext.Provider>
);

// ─── Tooltip (Root) ───────────────────────────────────────────────────────────

interface TooltipContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const TooltipContext = React.createContext<TooltipContextType>({ open: false, setOpen: () => {} });

interface TooltipProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip = ({ children, open: controlled, defaultOpen = false, onOpenChange }: TooltipProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlled !== undefined;
  const open = isControlled ? controlled! : uncontrolled;
  const setOpen = (v: boolean) => { if (!isControlled) setUncontrolled(v); onOpenChange?.(v); };
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <View>{children}</View>
    </TooltipContext.Provider>
  );
};

// ─── TooltipTrigger ───────────────────────────────────────────────────────────

interface TriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const TooltipTrigger = ({ children, style }: TriggerProps) => {
  const { setOpen } = React.useContext(TooltipContext);
  const { delayDuration } = React.useContext(TooltipProviderContext);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return renderTriggerTouchable(children, {
    onLongPress: () => {
      timer.current = setTimeout(() => setOpen(true), 0);
    },
    onPressOut: () => {
      if (timer.current) clearTimeout(timer.current);
      setTimeout(() => setOpen(false), 1200);
    },
    delayLongPress: delayDuration,
    style,
    activeOpacity: 1,
  });
};

// ─── TooltipContent ───────────────────────────────────────────────────────────

interface TooltipContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  side?: 'top' | 'bottom' | 'left' | 'right';
  hidden?: boolean;
}

const TooltipContent = ({ children, style, textStyle, hidden }: TooltipContentProps) => {
  const { open, setOpen } = React.useContext(TooltipContext);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (open && !hidden) {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, damping: 16, stiffness: 250 }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  }, [open, hidden]);

  if (!open || hidden) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => setOpen(false)}>
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <Animated.View
              style={[
                styles.content,
                { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
                style,
              ]}
            >
              {typeof children === 'string' ? (
                <Text style={[styles.text, textStyle]}>{children}</Text>
              ) : children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    backgroundColor: COLORS.foreground,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    maxWidth: 240,
    ...SHADOWS.card,
  },
  text: {
    fontSize: 12,
    color: COLORS.background,
    fontWeight: '500',
    lineHeight: 17,
    textAlign: 'center',
  },
});

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
