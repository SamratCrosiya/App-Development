// src/components/ui/NavigationMenu.tsx
// React Native port of navigation-menu.tsx
// Radix NavigationMenuPrimitive → horizontal tab-bar with expandable content panels

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Animated,
  StyleSheet, ViewStyle, LayoutAnimation, Platform, UIManager,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  id: string;
  label: string;
  href?: string;
  onPress?: () => void;
  content?: React.ReactNode;  // expanded panel content
}

interface NavigationMenuProps {
  items: NavItem[];
  style?: ViewStyle;
  horizontal?: boolean; // false = stacked list (mobile default)
}

// ─── NavigationMenu ───────────────────────────────────────────────────────────

const NavigationMenu = ({ items, style, horizontal = true }: NavigationMenuProps) => {
  const [active, setActive] = useState<string | null>(null);

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActive((prev) => (prev === id ? null : id));
  };

  return (
    <View style={style}>
      {/* Tab list */}
      <ScrollView
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.list, !horizontal && styles.listVertical]}
      >
        {items.map((item) => {
          const isActive = active === item.id;
          const hasContent = !!item.content;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.trigger, isActive && styles.triggerActive]}
              onPress={() => (hasContent ? toggle(item.id) : item.onPress?.())}
              activeOpacity={0.75}
            >
              <Text style={[styles.triggerText, isActive && styles.triggerTextActive]}>
                {item.label}
              </Text>
              {hasContent && (
                <Text style={[styles.chevron, isActive && styles.chevronOpen]}>⌄</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Expanded content panel */}
      {items.map((item) =>
        item.content && active === item.id ? (
          <View key={`${item.id}-content`} style={styles.content}>
            {item.content}
          </View>
        ) : null
      )}
    </View>
  );
};

// ─── NavigationMenuLink (standalone pressable link) ───────────────────────────

interface NavLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  active?: boolean;
  style?: ViewStyle;
}

const NavigationMenuLink = ({ children, onPress, active, style }: NavLinkProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.link, active && styles.linkActive, style]}
    activeOpacity={0.7}
  >
    {typeof children === 'string' ? (
      <Text style={[styles.linkText, active && styles.linkTextActive]}>{children}</Text>
    ) : children}
  </TouchableOpacity>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  listVertical: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    height: 40,
  },
  triggerActive: { backgroundColor: COLORS.secondary },
  triggerText: { fontSize: 13, fontWeight: '500', color: COLORS.foreground },
  triggerTextActive: { color: COLORS.primary },
  chevron: { fontSize: 14, color: COLORS.muted },
  chevronOpen: { transform: [{ rotate: '180deg' }], color: COLORS.primary },
  content: {
    marginTop: 6,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  link: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
  },
  linkActive: { backgroundColor: COLORS.secondary },
  linkText: { fontSize: 13, fontWeight: '500', color: COLORS.foreground },
  linkTextActive: { color: COLORS.primary },
});

export { NavigationMenu, NavigationMenuLink };
export type { NavItem };
