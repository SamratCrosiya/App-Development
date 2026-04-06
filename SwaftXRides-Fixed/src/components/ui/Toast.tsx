// src/components/ui/Toast.tsx
// React Native port of toast.tsx + toaster.tsx
// Radix ToastPrimitives → Animated slide-in toasts using the useToast hook store

import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet,
  Dimensions, Platform, ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { useToast, ToastItem } from '../../hooks/use-toast';

const { width: W } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'default' | 'destructive';

// ─── Single Toast Item View ───────────────────────────────────────────────────

interface ToastViewProps {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastItemView = ({ item, onDismiss }: ToastViewProps) => {
  const slideAnim = useRef(new Animated.Value(W)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enter animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Exit animation when open becomes false
    if (item.open === false) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: W, duration: 250, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [item.open]);

  const isDestructive = item.variant === 'destructive';

  return (
    <Animated.View
      style={[
        styles.toast,
        isDestructive && styles.toastDestructive,
        { opacity: opacityAnim, transform: [{ translateX: slideAnim }] },
      ]}
    >
      <View style={styles.toastContent}>
        <View style={styles.toastText}>
          {item.title && (
            <Text style={[styles.toastTitle, isDestructive && styles.toastTitleDestructive]}>
              {item.title}
            </Text>
          )}
          {item.description && (
            <Text style={[styles.toastDesc, isDestructive && styles.toastDescDestructive]}>
              {item.description}
            </Text>
          )}
        </View>

        {item.action && (
          <TouchableOpacity
            style={[styles.actionBtn, isDestructive && styles.actionBtnDestructive]}
            onPress={() => { item.action?.onPress(); onDismiss(item.id); }}
            activeOpacity={0.8}
          >
            <Text style={[styles.actionText, isDestructive && styles.actionTextDestructive]}>
              {item.action.label}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Close button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => onDismiss(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.closeIcon, isDestructive && styles.closeIconDestructive]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Toast (individual, for manual use) ──────────────────────────────────────

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  action?: { label: string; onPress: () => void };
  onClose?: () => void;
  style?: ViewStyle;
}

const Toast = ({ title, description, variant = 'default', action, onClose, style }: ToastProps) => {
  const isDestructive = variant === 'destructive';
  return (
    <View style={[styles.toast, isDestructive && styles.toastDestructive, style]}>
      <View style={styles.toastContent}>
        <View style={styles.toastText}>
          {title && <Text style={[styles.toastTitle, isDestructive && styles.toastTitleDestructive]}>{title}</Text>}
          {description && <Text style={[styles.toastDesc, isDestructive && styles.toastDescDestructive]}>{description}</Text>}
        </View>
        {action && (
          <TouchableOpacity style={[styles.actionBtn, isDestructive && styles.actionBtnDestructive]} onPress={action.onPress} activeOpacity={0.8}>
            <Text style={[styles.actionText, isDestructive && styles.actionTextDestructive]}>{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      {onClose && (
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={[styles.closeIcon, isDestructive && styles.closeIconDestructive]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── ToastTitle / ToastDescription (standalone) ───────────────────────────────

const ToastTitle = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <Text style={[styles.toastTitle, style as any]}>{children}</Text>
);
const ToastDescription = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <Text style={[styles.toastDesc, style as any]}>{children}</Text>
);

// ─── Toaster (mount once at App root) ────────────────────────────────────────

export const Toaster = () => {
  const { toasts, dismiss } = useToast();
  const visible = toasts.filter((t) => t.open !== false);
  if (visible.length === 0) return null;

  return (
    <View style={styles.viewport} pointerEvents="box-none">
      {visible.map((item) => (
        <ToastItemView key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 36,
    right: SPACING.md,
    left: SPACING.md,
    zIndex: 9999,
    gap: SPACING.xs,
    pointerEvents: 'box-none',
  },
  toast: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    paddingRight: SPACING.xl + SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  toastDestructive: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderColor: 'rgba(239,68,68,0.4)',
  },
  toastContent: {
    flex: 1,
    gap: SPACING.sm,
  },
  toastText: {
    gap: 4,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
    lineHeight: 20,
  },
  toastTitleDestructive: {
    color: COLORS.destructive,
  },
  toastDesc: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    lineHeight: 18,
    opacity: 0.9,
  },
  toastDescDestructive: {
    color: COLORS.destructive,
    opacity: 0.8,
  },
  actionBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'transparent',
  },
  actionBtnDestructive: {
    borderColor: 'rgba(239,68,68,0.4)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  actionTextDestructive: {
    color: COLORS.destructive,
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: '700',
  },
  closeIconDestructive: {
    color: COLORS.destructive,
    opacity: 0.7,
  },
});

export { Toast, ToastTitle, ToastDescription };
export type { ToastProps, ToastVariant };
