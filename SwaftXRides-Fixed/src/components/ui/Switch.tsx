// src/components/ui/Switch.tsx
// React Native port of switch.tsx (Radix SwitchPrimitives → Animated thumb)

import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity, Animated, StyleSheet, ViewStyle,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  trackWidth?: number;
  trackHeight?: number;
  thumbSize?: number;
  activeColor?: string;
  inactiveColor?: string;
}

const Switch = React.forwardRef<TouchableOpacity, SwitchProps>(
  (
    {
      checked: controlled,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      style,
      trackWidth = 44,
      trackHeight = 24,
      thumbSize = 20,
      activeColor = COLORS.primary,
      inactiveColor = COLORS.secondary,
    },
    ref
  ) => {
    const isControlled = controlled !== undefined;
    const [uncontrolled, setUncontrolled] = useState(defaultChecked);
    const checked = isControlled ? controlled! : uncontrolled;

    const translateX = useRef(new Animated.Value(checked ? trackWidth - thumbSize - 2 : 2)).current;
    const trackColor = useRef(new Animated.Value(checked ? 1 : 0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: checked ? trackWidth - thumbSize - 2 : 2,
          useNativeDriver: true,
          damping: 18,
          stiffness: 250,
        }),
        Animated.timing(trackColor, {
          toValue: checked ? 1 : 0,
          duration: 180,
          useNativeDriver: false,
        }),
      ]).start();
    }, [checked]);

    const animatedBg = trackColor.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveColor, activeColor],
    });

    const toggle = () => {
      if (disabled) return;
      const next = !checked;
      if (!isControlled) setUncontrolled(next);
      onCheckedChange?.(next);
    };

    return (
      <TouchableOpacity
        ref={ref}
        onPress={toggle}
        activeOpacity={0.8}
        disabled={disabled}
        accessibilityRole="switch"
        accessibilityState={{ checked, disabled }}
        style={style}
      >
        <Animated.View
          style={[
            styles.track,
            {
              width: trackWidth,
              height: trackHeight,
              borderRadius: trackHeight / 2,
              backgroundColor: animatedBg,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              {
                width: thumbSize,
                height: thumbSize,
                borderRadius: thumbSize / 2,
                transform: [{ translateX }],
              },
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
);

Switch.displayName = 'Switch';

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
    position: 'absolute',
  },
});

export { Switch };
