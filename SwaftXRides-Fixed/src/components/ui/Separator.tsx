// src/components/ui/Separator.tsx
// React Native port of separator.tsx (Radix SeparatorPrimitive → View)

import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/theme';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
  color?: string;
  thickness?: number;
  style?: StyleProp<ViewStyle>;
}

const Separator = ({
  orientation = 'horizontal',
  color = COLORS.border,
  thickness = 1,
  style,
}: SeparatorProps) => (
  <View
    style={[
      orientation === 'horizontal'
        ? { height: thickness, width: '100%' }
        : { width: thickness, alignSelf: 'stretch' },
      { backgroundColor: color, flexShrink: 0 },
      style,
    ]}
    accessibilityRole="none"
  />
);

export { Separator };
