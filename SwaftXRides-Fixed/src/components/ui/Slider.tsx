// src/components/ui/Slider.tsx
// React Native port of slider.tsx (Radix SliderPrimitive → PanResponder track+thumb)

import React, { useState, useRef, useCallback } from 'react';
import {
  View, PanResponder, Animated, StyleSheet, ViewStyle,
  LayoutChangeEvent, Text,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  style?: ViewStyle;
  trackColor?: string;
  rangeColor?: string;
  thumbColor?: string;
  showValue?: boolean;
  height?: number;
  thumbSize?: number;
}

const Slider = ({
  value: controlled,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled = false,
  style,
  trackColor = COLORS.secondary,
  rangeColor = COLORS.primary,
  thumbColor = COLORS.primary,
  showValue = false,
  height = 6,
  thumbSize = 20,
}: SliderProps) => {
  const isControlled = controlled !== undefined;
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = isControlled ? controlled! : uncontrolled;

  const trackWidth = useRef(0);
  const thumbAnim = useRef(new Animated.Value(0)).current;

  const pct = (value - min) / (max - min);

  const snapToStep = useCallback(
    (rawValue: number) => {
      const stepped = Math.round((rawValue - min) / step) * step + min;
      return Math.min(max, Math.max(min, stepped));
    },
    [min, max, step]
  );

  const setValue = useCallback(
    (px: number) => {
      if (trackWidth.current === 0 || disabled) return;
      const ratio = Math.min(1, Math.max(0, px / trackWidth.current));
      const raw = min + ratio * (max - min);
      const snapped = snapToStep(raw);
      if (!isControlled) setUncontrolled(snapped);
      onValueChange?.(snapped);
    },
    [min, max, disabled, isControlled, snapToStep, onValueChange]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (e) => setValue(e.nativeEvent.locationX),
      onPanResponderMove: (e) => setValue(e.nativeEvent.locationX),
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  };

  const thumbLeft = pct * (trackWidth.current > 0 ? trackWidth.current : 280) - thumbSize / 2;

  return (
    <View style={[styles.root, style]}>
      {showValue && <Text style={styles.valueLabel}>{value}</Text>}
      <View
        style={[styles.wrapper, { opacity: disabled ? 0.4 : 1 }]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        {/* Track */}
        <View style={[styles.track, { backgroundColor: trackColor, height }]}>
          {/* Range fill */}
          <View
            style={[
              styles.range,
              { backgroundColor: rangeColor, width: `${pct * 100}%`, height },
            ]}
          />
        </View>
        {/* Thumb */}
        <View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              left: thumbLeft,
              borderColor: thumbColor,
              top: -(thumbSize - height) / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { gap: 4 },
  wrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    paddingVertical: 12, // hit area
  },
  track: {
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    position: 'relative',
  },
  range: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    backgroundColor: COLORS.background,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  valueLabel: {
    fontSize: 12,
    color: COLORS.mutedForeground,
    textAlign: 'right',
  },
});

export { Slider };
