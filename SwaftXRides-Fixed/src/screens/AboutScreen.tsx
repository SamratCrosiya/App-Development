// src/screens/AboutScreen.tsx
// React Native port of CtaSection + Footer info

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const AboutScreen = ({ navigation }: any) => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Stars + rating row */}
      <View style={styles.ratingRow}>
        <Text style={styles.stars}>★★★★★</Text>
        <Text style={styles.ratingText}>4.8 · 100K+ downloads</Text>
      </View>

      {/* CTA heading */}
      <Text style={styles.headline}>
        Start Saving on{'\n'}
        <Text style={{ color: COLORS.primary }}>Every Ride</Text>
      </Text>

      <Text style={styles.sub}>
        Join lakhs of smart riders across India. Download Swaft X and never overpay for a ride again.
      </Text>

      {/* Download button */}
      <TouchableOpacity
        style={styles.downloadBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Compare')}
      >
        <Text style={styles.downloadBtnText}>Compare Fares Free →</Text>
      </TouchableOpacity>

      {/* Perks */}
      <View style={styles.perks}>
        {['No signup needed', '100% free', 'No data stored'].map((p) => (
          <View key={p} style={styles.perk}>
            <Text style={styles.perkCheck}>✓</Text>
            <Text style={styles.perkText}>{p}</Text>
          </View>
        ))}
      </View>

      {/* About card */}
      <View style={styles.aboutCard}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={{ fontSize: 20 }}>📍</Text>
          </View>
          <Text style={styles.logoText}>
            Swaft <Text style={{ color: COLORS.primary }}>X</Text>
          </Text>
        </View>
        <Text style={styles.aboutDesc}>
          Swaft X is an open-source ride intelligence platform built to bring transparency to fare pricing in India.
          Compare Uber, Ola, Rapido, and Namma Yatri instantly, understand surge pricing, track your carbon footprint, and make smarter decisions every time you ride.
        </Text>
        <View style={styles.divider} />
        <Text style={styles.builtBy}>© 2026 Swaft X · Built by Samrat · MIT License</Text>
      </View>

      {/* Links */}
      <View style={styles.links}>
        {['About', 'Privacy', 'Terms', 'GitHub'].map((link) => (
          <TouchableOpacity key={link} style={styles.linkBtn}>
            <Text style={styles.linkText}>{link}</Text>
          </TouchableOpacity>
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
    gap: SPACING.lg,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stars: {
    fontSize: 18,
    color: COLORS.primary,
    letterSpacing: 2,
  },
  ratingText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.foreground,
    lineHeight: 42,
  },
  sub: {
    fontSize: 15,
    color: COLORS.mutedForeground,
    lineHeight: 24,
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 2,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.primary,
  },
  downloadBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primaryForeground,
  },
  perks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  perkCheck: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '700',
  },
  perkText: {
    color: COLORS.mutedForeground,
    fontSize: 13,
  },
  aboutCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  aboutDesc: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  builtBy: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  linkBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.muted,
  },
});

export default AboutScreen;
