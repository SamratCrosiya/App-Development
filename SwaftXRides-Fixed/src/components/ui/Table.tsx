// src/components/ui/Table.tsx
// React Native port of table.tsx
// HTML table/thead/tbody/tr/th/td → ScrollView + View rows

import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, ViewStyle, TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TableProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;     // wraps in horizontal ScrollView
}

interface TableSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface TableRowProps {
  children: React.ReactNode;
  selected?: boolean;
  style?: ViewStyle;
  onPress?: () => void;
}

interface TableCellProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  flex?: number;
  minWidth?: number;
}

interface TableCaptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

// ─── Table (Root) ─────────────────────────────────────────────────────────────

const Table = ({ children, style, scrollable = false }: TableProps) => {
  const inner = (
    <View style={[styles.table, style]}>{children}</View>
  );
  if (scrollable) {
    return <ScrollView horizontal showsHorizontalScrollIndicator={false}>{inner}</ScrollView>;
  }
  return inner;
};

// ─── TableHeader ──────────────────────────────────────────────────────────────

const TableHeader = ({ children, style }: TableSectionProps) => (
  <View style={[styles.thead, style]}>{children}</View>
);

// ─── TableBody ────────────────────────────────────────────────────────────────

const TableBody = ({ children, style }: TableSectionProps) => (
  <View style={style}>{children}</View>
);

// ─── TableFooter ──────────────────────────────────────────────────────────────

const TableFooter = ({ children, style }: TableSectionProps) => (
  <View style={[styles.tfoot, style]}>{children}</View>
);

// ─── TableRow ─────────────────────────────────────────────────────────────────

import { TouchableOpacity } from 'react-native';

const TableRow = ({ children, selected, style, onPress }: TableRowProps) => {
  const inner = (
    <View style={[styles.row, selected && styles.rowSelected, style]}>
      {children}
    </View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
};

// ─── TableHead (header cell) ─────────────────────────────────────────────────

const TableHead = ({ children, style, textStyle, align = 'left', flex = 1, minWidth }: TableCellProps) => (
  <View style={[styles.cell, { flex, minWidth }, style]}>
    {typeof children === 'string' ? (
      <Text
        style={[
          styles.headText,
          align === 'center' && styles.textCenter,
          align === 'right' && styles.textRight,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
    ) : children}
  </View>
);

// ─── TableCell ────────────────────────────────────────────────────────────────

const TableCell = ({ children, style, textStyle, align = 'left', flex = 1, minWidth }: TableCellProps) => (
  <View style={[styles.cell, { flex, minWidth }, style]}>
    {typeof children === 'string' || typeof children === 'number' ? (
      <Text
        style={[
          styles.cellText,
          align === 'center' && styles.textCenter,
          align === 'right' && styles.textRight,
          textStyle,
        ]}
      >
        {children}
      </Text>
    ) : children}
  </View>
);

// ─── TableCaption ─────────────────────────────────────────────────────────────

const TableCaption = ({ children, style }: TableCaptionProps) => (
  <Text style={[styles.caption, style]}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
  },
  thead: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  tfoot: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.secondary + '80',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    minHeight: 48,
  },
  rowSelected: {
    backgroundColor: COLORS.secondary,
  },
  cell: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    justifyContent: 'center',
  },
  headText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.mutedForeground,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cellText: {
    fontSize: 14,
    color: COLORS.foreground,
    lineHeight: 20,
  },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  caption: {
    marginTop: SPACING.sm,
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    paddingBottom: SPACING.sm,
  },
});

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
