// src/components/ui/Calendar.tsx
// React Native port of calendar.tsx (react-day-picker → pure RN calendar)

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarProps {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  style?: ViewStyle;
  showOutsideDays?: boolean;
}

// ─── Calendar ─────────────────────────────────────────────────────────────────

const Calendar = ({
  selected,
  onSelect,
  minDate,
  maxDate,
  style,
  showOutsideDays = true,
}: CalendarProps) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const totalDays = daysInMonth(viewYear, viewMonth);
  const firstDay = firstDayOfMonth(viewYear, viewMonth);

  // Build grid: leading blanks + days
  const grid: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    if (showOutsideDays) {
      const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
      const prevTotal = daysInMonth(prevYear, prevMonth);
      grid.push(new Date(prevYear, prevMonth, prevTotal - firstDay + i + 1));
    } else {
      grid.push(null);
    }
  }
  for (let d = 1; d <= totalDays; d++) {
    grid.push(new Date(viewYear, viewMonth, d));
  }
  // Trailing days
  const remaining = 42 - grid.length;
  if (showOutsideDays) {
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    for (let d = 1; d <= remaining; d++) {
      grid.push(new Date(nextYear, nextMonth, d));
    }
  }

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const isDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isOutside = (date: Date) => date.getMonth() !== viewMonth;

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevMonth} style={styles.navBtn} activeOpacity={0.7}>
          <Text style={styles.navText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </Text>
        <TouchableOpacity onPress={nextMonth} style={styles.navBtn} activeOpacity={0.7}>
          <Text style={styles.navText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Day headers */}
      <View style={styles.weekRow}>
        {DAYS.map((d) => (
          <Text key={d} style={styles.dayHeader}>{d}</Text>
        ))}
      </View>

      {/* Day grid */}
      <View style={styles.grid}>
        {grid.map((date, i) => {
          if (!date) return <View key={`blank-${i}`} style={styles.cell} />;
          const outside = isOutside(date);
          const disabled = isDisabled(date);
          const todayDay = isToday(date);
          const sel = selected && isSameDay(date, selected);

          return (
            <TouchableOpacity
              key={i}
              style={[
                styles.cell,
                todayDay && !sel && styles.todayCell,
                sel && styles.selectedCell,
              ]}
              onPress={() => !disabled && onSelect?.(date)}
              activeOpacity={disabled ? 1 : 0.7}
              disabled={disabled}
            >
              <Text
                style={[
                  styles.dayText,
                  outside && styles.outsideText,
                  disabled && styles.disabledText,
                  todayDay && !sel && styles.todayText,
                  sel && styles.selectedText,
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const CELL_SIZE = 38;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    alignSelf: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  navBtn: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  navText: {
    fontSize: 18,
    color: COLORS.foreground,
    lineHeight: 22,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  dayHeader: {
    width: CELL_SIZE,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.full,
    marginVertical: 1,
  },
  todayCell: {
    backgroundColor: COLORS.secondary,
  },
  selectedCell: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '400',
    color: COLORS.foreground,
  },
  outsideText: {
    color: COLORS.muted,
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.muted,
    opacity: 0.35,
  },
  todayText: {
    fontWeight: '700',
    color: COLORS.foreground,
  },
  selectedText: {
    fontWeight: '700',
    color: COLORS.primaryForeground,
  },
});

export { Calendar };
export type { CalendarProps };
