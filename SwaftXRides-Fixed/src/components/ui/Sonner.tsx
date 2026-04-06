// src/components/ui/Sonner.tsx
// React Native port of sonner.tsx
// sonner/next-themes → custom toast system with Animated slide-in from top

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet,
  Dimensions, Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

const { width: W } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastItem {
  id: string;
  message: string;
  description?: string;
  type?: ToastType;
  duration?: number;     // ms, 0 = persistent
  action?: { label: string; onPress: () => void };
}

// ─── Toast store (singleton) ──────────────────────────────────────────────────

type Listener = (toasts: ToastItem[]) => void;
const listeners: Set<Listener> = new Set();
let toasts: ToastItem[] = [];

function notify(listeners: Set<Listener>, items: ToastItem[]) {
  listeners.forEach((l) => l(items));
}

// ─── toast() API  (matches sonner's API) ──────────────────────────────────────

let _id = 0;
const makeId = () => `toast-${++_id}`;

function addToast(item: Omit<ToastItem, 'id'>) {
  const t: ToastItem = { id: makeId(), duration: 4000, type: 'default', ...item };
  toasts = [t, ...toasts].slice(0, 5);
  notify(listeners, toasts);
  if (t.duration && t.duration > 0) {
    setTimeout(() => removeToast(t.id), t.duration);
  }
}

function removeToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify(listeners, toasts);
}

export const toast = Object.assign(
  (message: string, opts?: Partial<ToastItem>) => addToast({ message, ...opts }),
  {
    success: (message: string, opts?: Partial<ToastItem>) => addToast({ message, type: 'success', ...opts }),
    error: (message: string, opts?: Partial<ToastItem>) => addToast({ message, type: 'error', ...opts }),
    warning: (message: string, opts?: Partial<ToastItem>) => addToast({ message, type: 'warning', ...opts }),
    info: (message: string, opts?: Partial<ToastItem>) => addToast({ message, type: 'info', ...opts }),
    loading: (message: string, opts?: Partial<ToastItem>) => addToast({ message, type: 'loading', duration: 0, ...opts }),
    dismiss: (id?: string) => { if (id) removeToast(id); else { toasts = []; notify(listeners, []); } },
  }
);

// ─── Single toast item ────────────────────────────────────────────────────────

const ICONS: Record<ToastType, string> = {
  default: '💬', success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️', loading: '⏳',
};

const BORDER_COLORS: Record<ToastType, string> = {
  default: COLORS.border,
  success: '#10B981',
  error: COLORS.destructive,
  warning: '#F59E0B',
  info: COLORS.primary,
  loading: COLORS.border,
};

const ToastItemView = ({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) => {
  const slideY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 18, stiffness: 200 }),
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, []);

  const type = item.type ?? 'default';

  return (
    <Animated.View style={[styles.toast, { borderLeftColor: BORDER_COLORS[type], opacity, transform: [{ translateY: slideY }] }]}>
      <View style={styles.toastMain}>
        <Text style={styles.toastIcon}>{ICONS[type]}</Text>
        <View style={styles.toastBody}>
          <Text style={styles.toastMessage} numberOfLines={2}>{item.message}</Text>
          {item.description && <Text style={styles.toastDesc} numberOfLines={2}>{item.description}</Text>}
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.dismiss}>✕</Text>
        </TouchableOpacity>
      </View>
      {item.action && (
        <TouchableOpacity style={styles.actionBtn} onPress={() => { item.action?.onPress(); onDismiss(); }}>
          <Text style={styles.actionText}>{item.action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

// ─── Toaster (mount once at app root) ────────────────────────────────────────

export const Toaster = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem[]) => setItems([...t]);
    listeners.add(handler);
    return () => { listeners.delete(handler); };
  }, []);

  if (items.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {items.map((item) => (
        <ToastItemView key={item.id} item={item} onDismiss={() => removeToast(item.id)} />
      ))}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 56 : 40,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
    gap: SPACING.xs,
    pointerEvents: 'box-none',
  },
  toast: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    padding: SPACING.sm + 4,
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  toastMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  toastIcon: { fontSize: 16, lineHeight: 22 },
  toastBody: { flex: 1, gap: 3 },
  toastMessage: { fontSize: 14, fontWeight: '600', color: COLORS.foreground },
  toastDesc: { fontSize: 12, color: COLORS.mutedForeground },
  dismiss: { fontSize: 13, color: COLORS.muted, fontWeight: '700', paddingLeft: 4 },
  actionBtn: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    marginLeft: 28,
  },
  actionText: { fontSize: 12, fontWeight: '700', color: COLORS.primaryForeground },
});
