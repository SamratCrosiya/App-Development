// src/components/ui/Sidebar.tsx
// React Native port of sidebar.tsx
// Web sidebar → Animated slide-in drawer panel (left/right) + collapsible icon rail

import React, { useState, useRef, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, Animated, StyleSheet,
  Dimensions, ScrollView, ViewStyle, Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { Skeleton } from './Skeleton';
import { Separator } from './Separator';

const { width: W } = Dimensions.get('window');
const SIDEBAR_WIDTH = 256;
const SIDEBAR_ICON_WIDTH = 52;

// ─── Context ──────────────────────────────────────────────────────────────────

interface SidebarContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
  collapsed: boolean;         // icon-only mode
  setCollapsed: (v: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarCtx = React.createContext<SidebarContextType>({
  open: true, setOpen: () => {}, collapsed: false,
  setCollapsed: () => {}, toggleSidebar: () => {},
});

export function useSidebar() { return useContext(SidebarCtx); }

// ─── SidebarProvider ──────────────────────────────────────────────────────────

interface ProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = ({ children, defaultOpen = true, open: ctrl, onOpenChange }: ProviderProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isCtrl = ctrl !== undefined;
  const open = isCtrl ? ctrl! : uncontrolled;
  const [collapsed, setCollapsed] = useState(false);

  const setOpen = (v: boolean) => { if (!isCtrl) setUncontrolled(v); onOpenChange?.(v); };
  const toggleSidebar = useCallback(() => setOpen(!open), [open]);

  const ctx = useMemo(() => ({ open, setOpen, collapsed, setCollapsed, toggleSidebar }), [open, collapsed]);
  return <SidebarCtx.Provider value={ctx}>{children}</SidebarCtx.Provider>;
};

// ─── SidebarTrigger ───────────────────────────────────────────────────────────

const SidebarTrigger = ({ style }: { style?: ViewStyle }) => {
  const { toggleSidebar } = useSidebar();
  return (
    <TouchableOpacity style={[styles.trigger, style]} onPress={toggleSidebar} activeOpacity={0.7}>
      <Text style={styles.triggerIcon}>☰</Text>
    </TouchableOpacity>
  );
};

// ─── Sidebar (main panel) ─────────────────────────────────────────────────────

interface SidebarProps {
  children: React.ReactNode;
  side?: 'left' | 'right';
  style?: ViewStyle;
}

const Sidebar = ({ children, side = 'left', style }: SidebarProps) => {
  const { open, setOpen, collapsed } = useSidebar();
  const width = collapsed ? SIDEBAR_ICON_WIDTH : SIDEBAR_WIDTH;
  const slideAnim = useRef(new Animated.Value(open ? 0 : (side === 'left' ? -width : width))).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: open ? 0 : (side === 'left' ? -width : width),
      useNativeDriver: true,
      damping: 22,
      stiffness: 220,
    }).start();
  }, [open, width]);

  return (
    <>
      {/* Dim overlay on mobile when open */}
      {open && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        />
      )}
      <Animated.View
        style={[
          styles.sidebar,
          { width, [side]: 0, transform: [{ translateX: slideAnim }] },
          style,
        ]}
      >
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </>
  );
};

// ─── SidebarInset (main content area) ────────────────────────────────────────

const SidebarInset = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.inset, style]}>{children}</View>
);

// ─── SidebarHeader / Footer / Content ────────────────────────────────────────

const SidebarHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.section, style]}>{children}</View>
);
const SidebarFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.section, style]}>{children}</View>
);
const SidebarContent = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flex: 1 }, style]}>{children}</View>
);
const SidebarSeparator = ({ style }: { style?: ViewStyle }) => (
  <Separator style={[{ marginHorizontal: SPACING.sm }, style]} />
);

// ─── SidebarGroup ─────────────────────────────────────────────────────────────

const SidebarGroup = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.group, style]}>{children}</View>
);
const SidebarGroupLabel = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { collapsed } = useSidebar();
  if (collapsed) return null;
  return <Text style={[styles.groupLabel, style as any]}>{children}</Text>;
};
const SidebarGroupContent = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={style}>{children}</View>
);

// ─── SidebarMenu ──────────────────────────────────────────────────────────────

const SidebarMenu = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.menu, style]}>{children}</View>
);
const SidebarMenuItem = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={style}>{children}</View>
);

// ─── SidebarMenuButton ────────────────────────────────────────────────────────

interface MenuButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'default' | 'lg';
  style?: ViewStyle;
  icon?: React.ReactNode;
  tooltip?: string;
}

const SidebarMenuButton = ({
  children,
  isActive,
  onPress,
  size = 'default',
  style,
  icon,
}: MenuButtonProps) => {
  const { collapsed } = useSidebar();
  const height = size === 'sm' ? 30 : size === 'lg' ? 48 : 36;
  return (
    <TouchableOpacity
      style={[
        styles.menuBtn,
        { height },
        isActive && styles.menuBtnActive,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.menuBtnIcon}>{icon}</View>}
      {!collapsed && (
        typeof children === 'string'
          ? <Text style={[styles.menuBtnText, isActive && styles.menuBtnTextActive]}>{children}</Text>
          : <View style={{ flex: 1 }}>{children}</View>
      )}
    </TouchableOpacity>
  );
};

// ─── SidebarMenuBadge ─────────────────────────────────────────────────────────

const SidebarMenuBadge = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.badge, style]}>
    <Text style={styles.badgeText}>{children}</Text>
  </View>
);

// ─── SidebarMenuSkeleton ──────────────────────────────────────────────────────

const SidebarMenuSkeleton = ({ showIcon = false }: { showIcon?: boolean }) => (
  <View style={styles.skeleton}>
    {showIcon && <Skeleton width={20} height={20} borderRadius={4} />}
    <Skeleton height={14} style={{ flex: 1 }} />
  </View>
);

// ─── SidebarMenuSub ───────────────────────────────────────────────────────────

const SidebarMenuSub = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.menuSub, style]}>{children}</View>
);
const SidebarMenuSubItem = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={style}>{children}</View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 9,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.card,
    borderRightWidth: 1,
    borderColor: COLORS.border,
    zIndex: 10,
    ...SHADOWS.card,
  },
  inset: { flex: 1, backgroundColor: COLORS.background },
  section: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  group: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  menu: { gap: 2 },
  menuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  menuBtnActive: { backgroundColor: COLORS.secondary },
  menuBtnIcon: { width: 20, alignItems: 'center' },
  menuBtnText: { flex: 1, fontSize: 13, color: COLORS.foreground, fontWeight: '500' },
  menuBtnTextActive: { fontWeight: '700', color: COLORS.primary },
  badge: {
    position: 'absolute',
    right: SPACING.xs,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  skeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    height: 36,
  },
  menuSub: {
    marginLeft: SPACING.xl,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
    paddingLeft: SPACING.sm + 4,
    gap: 2,
  },
  trigger: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerIcon: { fontSize: 18, color: COLORS.foreground },
});

export {
  SidebarProvider, Sidebar, SidebarTrigger, SidebarInset,
  SidebarHeader, SidebarFooter, SidebarContent, SidebarSeparator,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge,
  SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubItem,
};
