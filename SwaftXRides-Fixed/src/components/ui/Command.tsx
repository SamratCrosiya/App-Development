// src/components/ui/Command.tsx
// React Native port of command.tsx
// cmdk → FlatList-based command palette with Modal dialog variant

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  onSelect?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface CommandProps {
  items: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  style?: ViewStyle;
  onSelect?: (item: CommandItem) => void;
}

// ─── Command (inline palette) ─────────────────────────────────────────────────

const Command = ({ items, placeholder = 'Search…', emptyText = 'No results found.', style, onSelect }: CommandProps) => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [query, items]);

  // Group items
  const groups = useMemo(() => {
    const map: Record<string, CommandItem[]> = {};
    filtered.forEach((item) => {
      const g = item.group ?? '';
      if (!map[g]) map[g] = [];
      map[g].push(item);
    });
    return Object.entries(map);
  }, [filtered]);

  return (
    <View style={[styles.root, style]}>
      {/* Input */}
      <View style={styles.inputRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder={placeholder}
          placeholderTextColor={COLORS.muted}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <View style={styles.separator} />

      {/* Results */}
      {groups.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={([group]) => group}
          renderItem={({ item: [group, groupItems] }) => (
            <View>
              {group !== '' && (
                <Text style={styles.groupLabel}>{group}</Text>
              )}
              {groupItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, item.disabled && styles.itemDisabled]}
                  onPress={() => { onSelect?.(item); item.onSelect?.(); }}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  {item.icon && <View style={styles.itemIcon}>{item.icon}</View>}
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  {item.shortcut && (
                    <Text style={styles.shortcut}>{item.shortcut}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

// ─── CommandDialog ────────────────────────────────────────────────────────────

interface CommandDialogProps extends CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

const CommandDialog = ({ open, onOpenChange, title = 'Command', ...commandProps }: CommandDialogProps) => (
  <Modal visible={open} transparent animationType="fade" onRequestClose={() => onOpenChange(false)}>
    <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => onOpenChange(false)}>
      <TouchableOpacity activeOpacity={1} style={styles.dialogBox} onPress={() => {}}>
        <Command {...commandProps} onSelect={(item) => { commandProps.onSelect?.(item); onOpenChange(false); }} />
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 14,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.foreground,
    height: 40,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  list: {
    maxHeight: 300,
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
    marginHorizontal: 4,
  },
  itemDisabled: {
    opacity: 0.4,
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
  shortcut: {
    fontSize: 11,
    color: COLORS.muted,
    letterSpacing: 1,
  },
  empty: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: SPACING.md,
  },
  dialogBox: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
});

export { Command, CommandDialog };
export type { CommandItem };
