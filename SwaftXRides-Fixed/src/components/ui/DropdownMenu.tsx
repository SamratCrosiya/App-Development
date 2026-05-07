// src/components/ui/DropdownMenu.tsx
// React Native port of dropdown-menu.tsx (Radix → Modal popover)

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DropdownMenuItem {
  id: string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  shortcut?: string;
  type?: 'item' | 'separator' | 'label' | 'checkbox' | 'radio';
  icon?: React.ReactNode;
  inset?: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface DropdownContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextType>({ open: false, setOpen: () => {} });

// ─── DropdownMenu (Root) ──────────────────────────────────────────────────────

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <View>{children}</View>
    </DropdownContext.Provider>
  );
};

// ─── DropdownMenuTrigger ──────────────────────────────────────────────────────

const DropdownMenuTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(DropdownContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── DropdownMenuContent ──────────────────────────────────────────────────────

interface ContentProps {
  items: DropdownMenuItem[];
  style?: ViewStyle;
  align?: 'left' | 'right' | 'center';
}

const DropdownMenuContent = ({ items, style, align = 'left' }: ContentProps) => {
  const { open, setOpen } = React.useContext(DropdownContext);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.menu, align === 'right' && styles.menuRight, align === 'center' && styles.menuCenter, style]}
          onPress={() => {}}
        >
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            {items.map((item) => {
              if (item.type === 'separator') {
                return <View key={item.id} style={styles.sep} />;
              }
              if (item.type === 'label') {
                return <Text key={item.id} style={styles.groupLabel}>{item.label}</Text>;
              }
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.item,
                    item.inset && styles.itemInset,
                    item.disabled && styles.disabled,
                  ]}
                  onPress={() => {
                    if (!item.disabled) { setOpen(false); item.onPress?.(); }
                  }}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {item.icon && <View style={styles.iconSlot}>{item.icon}</View>}
                  {(item.type === 'checkbox' || item.type === 'radio') && (
                    <View style={styles.iconSlot}>
                      {item.checked && (
                        <Text style={[styles.checkmark, { fontSize: item.type === 'radio' ? 8 : 14 }]}>
                          {item.type === 'radio' ? '●' : '✓'}
                        </Text>
                      )}
                    </View>
                  )}
                  <Text style={[styles.itemLabel, item.destructive && styles.destructive]}>
                    {item.label}
                  </Text>
                  {item.shortcut && <Text style={styles.shortcut}>{item.shortcut}</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ─── Individual sub-components ────────────────────────────────────────────────

const DropdownMenuLabel = ({ children, style }: { children: React.ReactNode; style?: object }) => (
  <Text style={[styles.groupLabel, style]}>{children as string}</Text>
);

const DropdownMenuSeparator = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sep, style]} />
);

const DropdownMenuShortcut = ({ children }: { children: string }) => (
  <Text style={styles.shortcut}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: SPACING.md,
    paddingTop: 100,
  },
  menu: {
    minWidth: 180,
    maxWidth: 280,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    padding: 4,
    ...SHADOWS.card,
  },
  menuRight: { alignSelf: 'flex-end' },
  menuCenter: { alignSelf: 'center' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  itemInset: {
    paddingLeft: SPACING.xl + SPACING.sm,
  },
  iconSlot: {
    width: 20,
    alignItems: 'center',
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
  },
  destructive: { color: COLORS.destructive },
  disabled: { opacity: 0.4 },
  checkmark: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  shortcut: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1,
    opacity: 0.7,
  },
  sep: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginHorizontal: -4,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
  },
});

export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut,
};
