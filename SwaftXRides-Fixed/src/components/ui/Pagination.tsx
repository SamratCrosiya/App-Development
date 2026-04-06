// src/components/ui/Pagination.tsx
// React Native port of pagination.tsx (nav/ul/li/a → View/TouchableOpacity/Text)

import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  style?: ViewStyle;
  showEdgeButtons?: boolean;
  siblingCount?: number;    // pages shown around current (default 1)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildPageRange(current: number, total: number, siblings: number): (number | '...')[] {
  const delta = siblings + 2;
  const range: number[] = [];
  for (let i = Math.max(2, current - siblings); i <= Math.min(total - 1, current + siblings); i++) {
    range.push(i);
  }
  const result: (number | '...')[] = [1];
  if (range[0] > 2) result.push('...');
  result.push(...range);
  if (range[range.length - 1] < total - 1) result.push('...');
  if (total > 1) result.push(total);
  return result;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  style,
  siblingCount = 1,
}: PaginationProps) => {
  const pages = buildPageRange(currentPage, totalPages, siblingCount);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <View style={[styles.root, style]}>
      {/* Previous */}
      <TouchableOpacity
        style={[styles.btn, !canPrev && styles.btnDisabled]}
        onPress={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        activeOpacity={0.7}
      >
        <Text style={styles.btnText}>‹</Text>
        <Text style={styles.btnLabel}>Previous</Text>
      </TouchableOpacity>

      {/* Page numbers */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pages}>
        {pages.map((page, i) =>
          page === '...' ? (
            <View key={`ellipsis-${i}`} style={styles.ellipsis}>
              <Text style={styles.ellipsisText}>•••</Text>
            </View>
          ) : (
            <TouchableOpacity
              key={page}
              style={[styles.pageBtn, page === currentPage && styles.pageBtnActive]}
              onPress={() => onPageChange(page as number)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pageBtnText, page === currentPage && styles.pageBtnTextActive]}>
                {page}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {/* Next */}
      <TouchableOpacity
        style={[styles.btn, !canNext && styles.btnDisabled]}
        onPress={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        activeOpacity={0.7}
      >
        <Text style={styles.btnLabel}>Next</Text>
        <Text style={styles.btnText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Sub-components (for manual composition) ──────────────────────────────────

const PaginationPrevious = ({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) => (
  <TouchableOpacity style={[styles.btn, disabled && styles.btnDisabled]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
    <Text style={styles.btnText}>‹</Text>
    <Text style={styles.btnLabel}>Previous</Text>
  </TouchableOpacity>
);

const PaginationNext = ({ onPress, disabled }: { onPress: () => void; disabled?: boolean }) => (
  <TouchableOpacity style={[styles.btn, disabled && styles.btnDisabled]} onPress={onPress} disabled={disabled} activeOpacity={0.7}>
    <Text style={styles.btnLabel}>Next</Text>
    <Text style={styles.btnText}>›</Text>
  </TouchableOpacity>
);

const PaginationLink = ({ page, isActive, onPress }: { page: number; isActive?: boolean; onPress: () => void }) => (
  <TouchableOpacity style={[styles.pageBtn, isActive && styles.pageBtnActive]} onPress={onPress} activeOpacity={0.7}>
    <Text style={[styles.pageBtnText, isActive && styles.pageBtnTextActive]}>{page}</Text>
  </TouchableOpacity>
);

const PaginationEllipsis = () => (
  <View style={styles.ellipsis}><Text style={styles.ellipsisText}>•••</Text></View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const BTN_SIZE = 36;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: SPACING.sm + 2,
    height: BTN_SIZE,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  btnDisabled: { opacity: 0.35 },
  btnText: { fontSize: 18, color: COLORS.foreground, lineHeight: BTN_SIZE },
  btnLabel: { fontSize: 13, color: COLORS.foreground, fontWeight: '500' },
  pages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pageBtn: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  pageBtnActive: {
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  pageBtnText: { fontSize: 13, color: COLORS.foreground },
  pageBtnTextActive: { fontWeight: '700', color: COLORS.foreground },
  ellipsis: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ellipsisText: { fontSize: 10, color: COLORS.muted, letterSpacing: 2 },
});

export { Pagination, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis };
