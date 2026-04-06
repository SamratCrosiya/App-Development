// src/screens/HomeScreen.tsx
// React Native port of HeroSection + landing page

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Linking,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Avg Saved', value: '₹45/ride' },
  { label: 'Cities', value: '50+' },
  { label: 'Data Safety', value: '100%' },
];

const HomeScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();

    // Floating animation for the phone mockup card
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 1800, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Ambient glow blobs */}
      <View style={styles.glowBlob1} />
      <View style={styles.glowBlob2} />

      {/* Hero section */}
      <Animated.View
        style={[styles.hero, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>⚡</Text>
          <Text style={styles.badgeText}>Trusted by 100K+ riders across India</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Compare.{'\n'}
          <Text style={styles.headlinePrimary}>Save.</Text>
          {'\n'}Ride Smarter.
        </Text>

        {/* Subtext */}
        <Text style={styles.subtext}>
          Instantly compare fares across Uber, Ola, Rapido & Namma Yatri.
          Save{' '}
          <Text style={styles.subtextHighlight}>25% or more</Text>
          {' '}on every ride with real-time pricing.
        </Text>

        {/* CTA Buttons */}
        <View style={styles.ctaRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Compare')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Compare Fares Now →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Features')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>How It Works</Text>
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((stat, i) => (
            <React.Fragment key={stat.label}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              {i < STATS.length - 1 && <View style={styles.statDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Phone mockup card */}
        <Animated.View style={[styles.mockupCard, { transform: [{ translateY: floatAnim }] }]}>
          <View style={styles.mockupHeader}>
            <View style={[styles.mockupDot, { backgroundColor: COLORS.destructive }]} />
            <View style={[styles.mockupDot, { backgroundColor: COLORS.warning }]} />
            <View style={[styles.mockupDot, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.mockupTitle}>Swaft X · Live Fares</Text>
          </View>

          {[
            { name: 'Rapido Auto', price: '₹87', eta: '3 min', best: true },
            { name: 'Ola Auto', price: '₹102', eta: '5 min', best: false },
            { name: 'Uber Auto', price: '₹118', eta: '4 min', best: false },
          ].map((item) => (
            <View
              key={item.name}
              style={[styles.mockupRow, item.best && styles.mockupRowBest]}
            >
              <View style={styles.mockupLeft}>
                <View style={[styles.mockupAvatar, { backgroundColor: item.best ? COLORS.primary + '22' : COLORS.border }]}>
                  <Text style={{ fontSize: 12 }}>🚗</Text>
                </View>
                <View>
                  <Text style={styles.mockupName}>{item.name}</Text>
                  <Text style={styles.mockupEta}>{item.eta} away</Text>
                </View>
              </View>
              <View style={styles.mockupRight}>
                <Text style={[styles.mockupPrice, item.best && { color: COLORS.primary }]}>
                  {item.price}
                </Text>
                {item.best && <Text style={styles.mockupBestBadge}>Best</Text>}
              </View>
            </View>
          ))}

          <View style={styles.mockupSavings}>
            <Text style={styles.mockupSavingsText}>📉  You save up to </Text>
            <Text style={styles.mockupSavingsAmount}>₹31</Text>
            <Text style={styles.mockupSavingsText}> with Swaft X</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Bottom spacer */}
      <View style={{ height: SPACING.xxl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + SPACING.md,
    paddingBottom: SPACING.xl,
  },
  glowBlob1: {
    position: 'absolute',
    top: 80,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: COLORS.primary,
    opacity: 0.04,
  },
  glowBlob2: {
    position: 'absolute',
    top: 300,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.accent,
    opacity: 0.04,
  },
  hero: {
    gap: SPACING.lg,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
    backgroundColor: COLORS.primary + '0D',
  },
  badgeIcon: { fontSize: 13 },
  badgeText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  headline: {
    fontSize: 44,
    fontWeight: '800',
    color: COLORS.foreground,
    lineHeight: 52,
    letterSpacing: -0.5,
  },
  headlinePrimary: {
    color: COLORS.primary,
  },
  subtext: {
    fontSize: 16,
    color: COLORS.mutedForeground,
    lineHeight: 26,
  },
  subtextHighlight: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  ctaRow: {
    gap: SPACING.sm,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.primary,
  },
  primaryBtnText: {
    color: COLORS.primaryForeground,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  // Mockup card
  mockupCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  mockupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mockupDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mockupTitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  mockupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mockupRowBest: {
    backgroundColor: COLORS.primary + '0D',
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  mockupLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  mockupAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.foreground,
  },
  mockupEta: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 1,
  },
  mockupRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  mockupPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  mockupBestBadge: {
    fontSize: 10,
    color: COLORS.primary,
    backgroundColor: COLORS.primary + '22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mockupSavings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primary + '0D',
  },
  mockupSavingsText: {
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  mockupSavingsAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default HomeScreen;
