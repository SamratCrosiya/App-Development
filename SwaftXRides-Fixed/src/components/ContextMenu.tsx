// src/components/ui/ContextMenu.tsx
// React Native port of context-menu.tsx
// Right-click/long-press → Modal action sheet

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContextMenuItem {
  id: string;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;         // for checkbox items
  shortcut?: string;
  type?: 'item' | 'separator' | 'label' | 'checkbox' | 'radio';
  icon?: React.ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ContextMenuContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const ContextMenuContext = React.createContext<ContextMenuContextType>({
  open: false,
  setOpen: () => {},
});

// ─── ContextMenu (Root) ───────────────────────────────────────────────────────

interface ContextMenuProps {
  children: React.ReactNode;
}

const ContextMenu = ({ children }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  return (
    <ContextMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

// ─── ContextMenuTrigger ───────────────────────────────────────────────────────

interface TriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const ContextMenuTrigger = ({ children, style }: TriggerProps) => {
  const { setOpen } = React.useContext(ContextMenuContext);
  return renderTriggerTouchable(children, {
    onLongPress: () => setOpen(true),
    delayLongPress: 400,
    style,
    activeOpacity: 0.9,
  });
};

// ─── ContextMenuContent ───────────────────────────────────────────────────────

interface ContentProps {
  items: ContextMenuItem[];
  style?: ViewStyle;
  title?: string;
}

const ContextMenuContent = ({ items, style, title }: ContentProps) => {
  const { open, setOpen } = React.useContext(ContextMenuContext);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={[styles.menu, style]} onPress={() => {}}>
          {title && <Text style={styles.menuTitle}>{title}</Text>}
          <ScrollView bounces={false}>
            {items.map((item, i) => {
              if (item.type === 'separator') {
                return <View key={item.id} style={styles.sep} />;
              }
              if (item.type === 'label') {
                return <Text key={item.id} style={styles.groupLabel}>{item.label}</Text>;
              }
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, item.disabled && styles.disabled]}
                  onPress={() => {
                    if (!item.disabled) {
                      setOpen(false);
                      item.onPress?.();
                    }
                  }}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
                  <Text
                    style={[
                      styles.itemLabel,
                      item.destructive && styles.destructive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.checked && <Text style={styles.checkmark}>✓</Text>}
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

// ─── Individual item exports (for direct use without items array) ──────────────

const ContextMenuItem = ({
  label,
  onPress,
  disabled,
  destructive,
  icon,
  shortcut,
  style,
}: Omit<ContextMenuItem, 'id'> & { style?: ViewStyle }) => {
  const { setOpen } = React.useContext(ContextMenuContext);
  return (
    <TouchableOpacity
      style={[styles.item, disabled && styles.disabled, style]}
      onPress={() => { setOpen(false); onPress?.(); }}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon && <View style={styles.itemIcon}>{icon}</View>}
      <Text style={[styles.itemLabel, destructive && styles.destructive]}>{label}</Text>
      {shortcut && <Text style={styles.shortcut}>{shortcut}</Text>}
    </TouchableOpacity>
  );
};

const ContextMenuSeparator = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.sep, style]} />
);

const ContextMenuLabel = ({ label, style }: { label: string; style?: TextStyle }) => (
  <Text style={[styles.groupLabel, style]}>{label}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  menu: {
    minWidth: 200,
    maxWidth: 320,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
  },
  itemIcon: {
    width: 20,
    alignItems: 'center',
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    color: COLORS.foreground,
  },
  destructive: {
    color: COLORS.destructive,
  },
  disabled: {
    opacity: 0.4,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  shortcut: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  sep: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    marginHorizontal: SPACING.sm,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
});

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
};
