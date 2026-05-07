// src/components/ui/Breadcrumb.tsx
// React Native port of breadcrumb.tsx
// No DOM nav/ol/li → View + Text + TouchableOpacity

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

// ─── Breadcrumb (Root) ────────────────────────────────────────────────────────

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;   // wrap in ScrollView for long paths
}

const Breadcrumb = ({ children, style, scrollable = false }: BreadcrumbProps) => {
  const inner = (
    <View style={[styles.root, style]} accessibilityRole="none">
      {children}
    </View>
  );
  if (scrollable) {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {inner}
      </ScrollView>
    );
  }
  return inner;
};

// ─── BreadcrumbList ───────────────────────────────────────────────────────────

const BreadcrumbList = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.list, style]}>{children}</View>
);

// ─── BreadcrumbItem ───────────────────────────────────────────────────────────

const BreadcrumbItem = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.item, style]}>{children}</View>
);

// ─── BreadcrumbLink ───────────────────────────────────────────────────────────

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: TextStyle;
}

const BreadcrumbLink = ({ children, onPress, style }: BreadcrumbLinkProps) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Text style={[styles.link, style]}>{children}</Text>
  </TouchableOpacity>
);

// ─── BreadcrumbPage (current, non-interactive) ────────────────────────────────

const BreadcrumbPage = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.page, style]} accessibilityRole="text">
    {children}
  </Text>
);

// ─── BreadcrumbSeparator ──────────────────────────────────────────────────────

const BreadcrumbSeparator = ({ children }: { children?: React.ReactNode }) => (
  <View style={styles.separator} accessibilityElementsHidden>
    {children ?? <Text style={styles.separatorText}>›</Text>}
  </View>
);

// ─── BreadcrumbEllipsis ───────────────────────────────────────────────────────

const BreadcrumbEllipsis = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.ellipsis, style]} accessibilityElementsHidden>
    <Text style={styles.ellipsisText}>•••</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {},
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  link: {
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  page: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.foreground,
  },
  separator: {
    paddingHorizontal: 2,
  },
  separatorText: {
    fontSize: 14,
    color: COLORS.muted,
  },
  ellipsis: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: {
    fontSize: 12,
    color: COLORS.muted,
    letterSpacing: 1,
  },
});

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
