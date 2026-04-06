// src/components/ui/AspectRatio.tsx
// React Native port of aspect-ratio.tsx
// Radix AspectRatio → View with paddingTop trick (native approach)

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface AspectRatioProps {
  ratio?: number;       // width / height, e.g. 16/9
  children: React.ReactNode;
  style?: ViewStyle;
}

const AspectRatio = ({ ratio = 1, children, style }: AspectRatioProps) => {
  return (
    <View style={[styles.container, style]}>
      {/* Inner view uses paddingTop % trick for aspect ratio */}
      <View style={[styles.inner, { paddingTop: `${(1 / ratio) * 100}%` as any }]}>
        <View style={StyleSheet.absoluteFillObject}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  inner: {
    width: '100%',
    position: 'relative',
  },
});

export { AspectRatio };
