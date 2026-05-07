// src/components/ui/Progress.tsx
// React Native port of progress.tsx (Radix ProgressPrimitive → Animated.View)

import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, Text } from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface ProgressProps {
  value?: number;          // 0-100
  max?: number;
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  style?: ViewStyle;
  animated?: boolean;
}

const Progress = ({
  value = 0,
  max = 100,
  color = COLORS.primary,
  trackColor = COLORS.secondary,
  height = 8,
  showLabel = false,
  style,
  animated = true,
}: ProgressProps) => {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(widthAnim, {
        toValue: pct,
        duration: 400,
        useNativeDriver: false,
      }).start();
    } else {
      widthAnim.setValue(pct);
    }
  }, [pct]);

  const animatedWidth = widthAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={style}>
      <View style={[styles.track, { backgroundColor: trackColor, height, borderRadius: height / 2 }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: animatedWidth,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {showLabel && (
        <Text style={styles.label}>{Math.round(pct * 100)}%</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    color: COLORS.mutedForeground,
    textAlign: 'right',
  },
});

export { Progress };
