// src/components/ui/Menubar.tsx
// React Native port of menubar.tsx
// Radix MenubarPrimitive → horizontal ScrollView of TouchableOpacity triggers + Modal menus

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal,
  StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenubarItemDef {
  id: string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  shortcut?: string;
  type?: 'item' | 'separator' | 'label' | 'checkbox' | 'radio';
  inset?: boolean;
  icon?: React.ReactNode;
}

interface MenuDef {
  id: string;
  trigger: string;
  items: MenubarItemDef[];
}

interface MenubarProps {
  menus: MenuDef[];
  style?: ViewStyle;
}

// ─── Menubar ──────────────────────────────────────────────────────────────────

const Menubar = ({ menus, style }: MenubarProps) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const active = menus.find((m) => m.id === openMenu);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.bar, style]}
        contentContainerStyle={styles.barContent}
      >
        {menus.map((menu) => (
          <TouchableOpacity
            key={menu.id}
            style={[styles.trigger, openMenu === menu.id && styles.triggerActive]}
            onPress={() => setOpenMenu(openMenu === menu.id ? null : menu.id)}
            activeOpacity={0.75}
          >
            <Text style={[styles.triggerText, openMenu === menu.id && styles.triggerTextActive]}>
              {menu.trigger}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dropdown modal */}
      <Modal visible={!!openMenu} transparent animationType="fade" onRequestClose={() => setOpenMenu(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpenMenu(null)}>
          <TouchableOpacity activeOpacity={1} style={styles.menu} onPress={() => {}}>
            {active?.items.map((item) => {
              if (item.type === 'separator') return <View key={item.id} style={styles.sep} />;
              if (item.type === 'label') return <Text key={item.id} style={styles.groupLabel}>{item.label}</Text>;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, item.inset && styles.inset, item.disabled && styles.disabled]}
                  onPress={() => { if (!item.disabled) { setOpenMenu(null); item.onPress?.(); } }}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {(item.type === 'checkbox' || item.type === 'radio') && (
                    <View style={styles.indicatorSlot}>
                      {item.checked && <Text style={styles.checkmark}>{item.type === 'radio' ? '●' : '✓'}</Text>}
                    </View>
                  )}
                  {item.icon && <View style={styles.iconSlot}>{item.icon}</View>}
                  <Text style={[styles.itemLabel, item.destructive && styles.destructive]}>{item.label}</Text>
                  {item.shortcut && <Text style={styles.shortcut}>{item.shortcut}</Text>}
                </TouchableOpacity>
              );
            })}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: { flexGrow: 0 },
  barContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 4,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    minHeight: 44,
  },
  trigger: {
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.sm,
  },
  triggerActive: { backgroundColor: COLORS.secondary },
  triggerText: { fontSize: 13, fontWeight: '500', color: COLORS.foreground },
  triggerTextActive: { color: COLORS.primary },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingTop: 56,
    paddingHorizontal: SPACING.md,
  },
  menu: {
    minWidth: 192,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    ...SHADOWS.card,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  inset: { paddingLeft: SPACING.xl + 4 },
  disabled: { opacity: 0.4 },
  indicatorSlot: { width: 20, alignItems: 'center' },
  iconSlot: { width: 20, alignItems: 'center' },
  itemLabel: { flex: 1, fontSize: 13, color: COLORS.foreground },
  destructive: { color: COLORS.destructive },
  checkmark: { fontSize: 13, color: COLORS.primary, fontWeight: '800' },
  shortcut: { fontSize: 11, color: COLORS.muted, letterSpacing: 1 },
  sep: { height: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  groupLabel: {
    fontSize: 11, fontWeight: '700', color: COLORS.muted,
    textTransform: 'uppercase', letterSpacing: 0.8,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs + 2,
  },
});

export { Menubar };
export type { MenuDef, MenubarItemDef as MenubarItem };
