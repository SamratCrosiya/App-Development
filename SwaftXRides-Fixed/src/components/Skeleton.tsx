// src/components/ui/Skeleton.tsx
// React Native port of skeleton.tsx — animated shimmer placeholder

import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  shimmer?: boolean;
}

const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = RADIUS.sm,
  style,
  shimmer = true,
}: SkeletonProps) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!shimmer) return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  return (
    <Animated.View
      style={[
        styles.base,
        { width: width as any, height, borderRadius, opacity: opacityAnim },
        style,
      ]}
    />
  );
};

// ─── Preset variants (bonus) ──────────────────────────────────────────────────

const SkeletonText = ({ lines = 3, style }: { lines?: number; style?: ViewStyle }) => (
  <View style={[{ gap: 8 }, style]}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height={14} width={i === lines - 1 ? '65%' : '100%'} />
    ))}
  </View>
);

const SkeletonCard = ({ style }: { style?: ViewStyle }) => (
  <View style={[styles.card, style]}>
    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
      <Skeleton width={40} height={40} borderRadius={20} />
      <View style={{ flex: 1, gap: 6 }}>
        <Skeleton height={14} width="60%" />
        <Skeleton height={12} width="40%" />
      </View>
    </View>
    <SkeletonText lines={3} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: COLORS.secondary,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
});

export { Skeleton, SkeletonText, SkeletonCard };
