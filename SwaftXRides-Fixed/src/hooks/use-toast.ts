// src/hooks/use-toast.ts
// React Native port of use-toast.ts + the toast.tsx + toaster.tsx system
// Radix ToastPrimitives → pure RN hook-based toast store

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'default' | 'destructive';

export interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: { label: string; onPress: () => void };
  open?: boolean;
}

type ToastInput = Omit<ToastItem, 'id' | 'open'>;

// ─── Singleton store ──────────────────────────────────────────────────────────

type Listener = () => void;
let _toasts: ToastItem[] = [];
const _listeners = new Set<Listener>();
let _id = 0;
const genId = () => `t-${++_id}`;

function dispatch() { _listeners.forEach((l) => l()); }

function addToast(input: ToastInput): string {
  const id = genId();
  const item: ToastItem = { id, open: true, duration: 5000, variant: 'default', ...input };
  _toasts = [item, ..._toasts].slice(0, 5);
  dispatch();
  if (item.duration && item.duration > 0) {
    setTimeout(() => dismissToast(id), item.duration);
  }
  return id;
}

function dismissToast(id: string) {
  _toasts = _toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  dispatch();
  setTimeout(() => { _toasts = _toasts.filter((t) => t.id !== id); dispatch(); }, 300);
}

function updateToast(id: string, updates: Partial<ToastInput>) {
  _toasts = _toasts.map((t) => (t.id === id ? { ...t, ...updates } : t));
  dispatch();
}

// ─── toast() API ──────────────────────────────────────────────────────────────

export function toast(input: ToastInput) {
  const id = addToast(input);
  return {
    id,
    dismiss: () => dismissToast(id),
    update: (u: Partial<ToastInput>) => updateToast(id, u),
  };
}
toast.success = (title: string, opts?: Partial<ToastInput>) => toast({ title, variant: 'default', ...opts });
toast.error   = (title: string, opts?: Partial<ToastInput>) => toast({ title, variant: 'destructive', ...opts });
toast.dismiss = (id?: string) => { id ? dismissToast(id) : _toasts.forEach((t) => dismissToast(t.id)); };

// ─── useToast hook ────────────────────────────────────────────────────────────

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>(_toasts);
  useEffect(() => {
    const handler = () => setToasts([..._toasts]);
    _listeners.add(handler);
    return () => { _listeners.delete(handler); };
  }, []);
  const dismiss = useCallback((id?: string) => toast.dismiss(id), []);
  return { toasts, toast, dismiss };
}
