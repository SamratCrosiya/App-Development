// src/screens/CompareScreen.tsx
// React Native port of FareComparison.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';
import LocationInput from '../components/LocationInput';
import { Location, calculateFares, getDistance, RideType } from '../lib/locations';

const RIDE_TYPES: { key: RideType; label: string; emoji: string }[] = [
  { key: 'auto', label: 'Auto', emoji: '🛺' },
  { key: 'bike', label: 'Bike', emoji: '🏍️' },
  { key: 'cab', label: 'Cab', emoji: '🚕' },
];

// Service brand colors
const SERVICE_COLORS: Record<string, string> = {
  'Rapido Auto': '#FACC15',
  'Rapido Bike': '#FACC15',
  'Ola Auto': '#F59E0B',
  'Ola Mini': '#F59E0B',
  'Ola Prime': '#F59E0B',
  'Ola Bike': '#F59E0B',
  'Uber Auto': '#1C1C1C',
  'Uber Go': '#1C1C1C',
  'Uber Premier': '#1C1C1C',
  'Uber Moto': '#1C1C1C',
  'Namma Yatri': '#10B981',
};

const CompareScreen = () => {
  const [rideType, setRideType] = useState<RideType>('auto');
  const [pickup, setPickup] = useState<Location | null>(null);
  const [drop, setDrop] = useState<Location | null>(null);

  const distance = useMemo(() => {
    if (!pickup || !drop) return 0;
    return getDistance(pickup, drop);
  }, [pickup, drop]);

  const rides = useMemo(() => {
    if (!pickup || !drop) return [];
    return calculateFares(pickup, drop, rideType).sort((a, b) => a.price - b.price);
  }, [pickup, drop, rideType]);

  const savings = rides.length > 1 ? rides[rides.length - 1].price - rides[0].price : 0;

  const handleSwap = () => {
    const temp = pickup;
    setPickup(drop);
    setDrop(temp);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Page header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Real-Time Fare{' '}
          <Text style={{ color: COLORS.primary }}>Comparison</Text>
        </Text>
        <Text style={styles.headerSub}>
          Enter your pickup and drop locations to see fares across all services instantly.
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>

        {/* Location inputs */}
        <View style={styles.locationBlock}>
          <LocationInput
            label="Pickup"
            value={pickup}
            onChange={setPickup}
            icon="pickup"
            showCurrentLocation
          />

          {/* Swap button */}
          <TouchableOpacity
            style={styles.swapBtn}
            onPress={handleSwap}
            disabled={!pickup && !drop}
            activeOpacity={0.7}
          >
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>

          <LocationInput
            label="Drop"
            value={drop}
            onChange={setDrop}
            icon="drop"
          />
        </View>

        {/* Distance pill */}
        {pickup && drop && (
          <View style={styles.distancePill}>
            <Text style={styles.distanceText}>
              🔍  Distance:{' '}
              <Text style={styles.distanceValue}>{distance.toFixed(1)} km</Text>
            </Text>
          </View>
        )}

        {/* Ride type tabs */}
        <View style={styles.tabs}>
          {RIDE_TYPES.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[styles.tab, rideType === type.key && styles.tabActive]}
              onPress={() => setRideType(type.key)}
              activeOpacity={0.75}
            >
              <Text style={styles.tabEmoji}>{type.emoji}</Text>
              <Text style={[styles.tabLabel, rideType === type.key && styles.tabLabelActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Results */}
        {rides.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>
              Enter pickup & drop locations to compare fares
            </Text>
          </View>
        ) : (
          <View style={styles.rideList}>
            {rides.map((ride, i) => {
              const brandColor = SERVICE_COLORS[ride.service] ?? COLORS.mutedForeground;
              const isBest = i === 0;
              return (
                <View
                  key={ride.service}
                  style={[styles.rideRow, isBest && styles.rideRowBest]}
                >
                  {/* Avatar */}
                  <View style={[styles.rideAvatar, { backgroundColor: brandColor + '22' }]}>
                    <Text style={[styles.rideAvatarLetter, { color: brandColor === '#1C1C1C' ? COLORS.foreground : brandColor }]}>
                      {ride.service.charAt(0)}
                    </Text>
                  </View>

                  {/* Info */}
                  <View style={styles.rideInfo}>
                    <View style={styles.rideNameRow}>
                      <Text style={styles.rideName}>{ride.service}</Text>
                      {isBest && (
                        <View style={styles.bestBadge}>
                          <Text style={styles.bestBadgeText}>BEST</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.rideEta}>{ride.eta} away</Text>
                  </View>

                  {/* Price */}
                  <Text style={[styles.ridePrice, isBest && { color: COLORS.primary }]}>
                    ₹{ride.price}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Savings banner */}
        {rides.length > 0 && savings > 0 && (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>📉  You save up to </Text>
            <Text style={styles.savingsAmount}>₹{savings}</Text>
            <Text style={styles.savingsText}> with Swaft X</Text>
          </View>
        )}
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
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.foreground,
    lineHeight: 34,
  },
  headerSub: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
    ...SHADOWS.card,
  },
  locationBlock: {
    gap: SPACING.xs,
  },
  swapBtn: {
    alignSelf: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginVertical: -4,
  },
  swapIcon: {
    fontSize: 16,
    color: COLORS.mutedForeground,
  },
  distancePill: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  distanceText: {
    fontSize: 13,
    color: COLORS.mutedForeground,
  },
  distanceValue: {
    color: COLORS.foreground,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabEmoji: { fontSize: 14 },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.muted,
  },
  tabLabelActive: {
    color: COLORS.primaryForeground,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyEmoji: { fontSize: 36 },
  emptyText: {
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
  rideList: {
    gap: SPACING.sm,
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rideRowBest: {
    backgroundColor: COLORS.primary + '0D',
    borderColor: COLORS.primary + '44',
  },
  rideAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rideAvatarLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
  rideInfo: {
    flex: 1,
    gap: 3,
  },
  rideNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rideName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.foreground,
  },
  bestBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  bestBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.primaryForeground,
    letterSpacing: 0.5,
  },
  rideEta: {
    fontSize: 12,
    color: COLORS.muted,
  },
  ridePrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.foreground,
  },
  savingsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: COLORS.primary + '0D',
    borderWidth: 1,
    borderColor: COLORS.primary + '22',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  savingsText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
  },
  savingsAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
});

export default CompareScreen;
