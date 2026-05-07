// src/screens/FeaturesScreen.tsx
// React Native port of FeaturesSection.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const FEATURES = [
  {
    emoji: '↔️',
    title: 'Compare All Services',
    description: 'Side-by-side fares from Uber, Ola, Rapido & Namma Yatri in one view.',
  },
  {
    emoji: '🚶',
    title: 'Smart Pickup',
    description: 'Walk to a nearby spot, cut wait time, burn calories & save even more money.',
  },
  {
    emoji: '⚡',
    title: 'Instant Booking',
    description: 'Book directly from the app — no switching between multiple ride apps.',
  },
  {
    emoji: '🔒',
    title: '100% Privacy',
    description: 'No login stored, no data sold. Your ride history stays yours.',
  },
  {
    emoji: '🕐',
    title: 'Real-Time Pricing',
    description: 'Live fare data that updates every few seconds for accurate comparisons.',
  },
  {
    emoji: '🗺️',
    title: '50+ Cities',
    description: 'Available wherever Uber, Ola, Rapido or Namma Yatri operates in India.',
  },
];

const FeaturesScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          Why Riders <Text style={{ color: COLORS.primary }}>Love</Text> Swaft X
        </Text>
        <Text style={styles.subtitle}>
          Every feature designed to save you time, money, and hassle on every ride.
        </Text>
      </View>

      {/* Feature grid - two columns */}
      <View style={styles.grid}>
        {FEATURES.map((feature, i) => (
          <View key={feature.title} style={styles.card}>
            <View style={styles.iconBox}>
              <Text style={styles.emoji}>{feature.emoji}</Text>
            </View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardDesc}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.foreground,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  card: {
    width: '48.5%',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.sm,
    ...SHADOWS.card,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
    lineHeight: 20,
  },
  cardDesc: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    lineHeight: 18,
  },
});

export default FeaturesScreen;
