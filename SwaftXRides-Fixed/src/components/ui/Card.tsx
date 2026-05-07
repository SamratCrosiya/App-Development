// src/components/ui/Card.tsx
// React Native port of card.tsx (div → View, h3/p → Text)

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Card = ({ children, style }: CardProps) => (
  <View style={[styles.card, style]}>{children}</View>
);

// ─── CardHeader ───────────────────────────────────────────────────────────────

const CardHeader = ({ children, style }: CardProps) => (
  <View style={[styles.header, style]}>{children}</View>
);

// ─── CardTitle ────────────────────────────────────────────────────────────────

interface CardTextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const CardTitle = ({ children, style }: CardTextProps) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

// ─── CardDescription ──────────────────────────────────────────────────────────

const CardDescription = ({ children, style }: CardTextProps) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── CardContent ──────────────────────────────────────────────────────────────

const CardContent = ({ children, style }: CardProps) => (
  <View style={[styles.content, style]}>{children}</View>
);

// ─── CardFooter ───────────────────────────────────────────────────────────────

const CardFooter = ({ children, style }: CardProps) => (
  <View style={[styles.footer, style]}>{children}</View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  header: {
    padding: SPACING.lg,
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.foreground,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 13,
    color: COLORS.mutedForeground,
    lineHeight: 20,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
});

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
