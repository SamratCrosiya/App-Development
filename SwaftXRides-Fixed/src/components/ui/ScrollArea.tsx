// src/components/ui/ScrollArea.tsx
// React Native port of scroll-area.tsx
// Radix ScrollAreaPrimitive → ScrollView with custom styled scrollbar indicator

import React, { useState, useRef } from 'react';
import {
  ScrollView, View, StyleSheet, ViewStyle, NativeSyntheticEvent,
  NativeScrollEvent, LayoutChangeEvent,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

interface ScrollAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  orientation?: 'vertical' | 'horizontal';
  maxHeight?: number;
  showScrollbar?: boolean;
}

const ScrollArea = ({
  children,
  style,
  contentStyle,
  orientation = 'vertical',
  maxHeight,
  showScrollbar = true,
}: ScrollAreaProps) => {
  const isH = orientation === 'horizontal';
  const [contentSize, setContentSize] = useState(0);
  const [viewSize, setViewSize] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const hasOverflow = contentSize > viewSize;
  const thumbRatio = viewSize > 0 ? viewSize / Math.max(contentSize, 1) : 1;
  const thumbSize = Math.max(thumbRatio * viewSize, 32);
  const thumbPos = contentSize > viewSize
    ? (scrollOffset / (contentSize - viewSize)) * (viewSize - thumbSize)
    : 0;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollOffset(isH ? e.nativeEvent.contentOffset.x : e.nativeEvent.contentOffset.y);
  };

  return (
    <View style={[styles.root, isH ? styles.rootH : styles.rootV, maxHeight ? { maxHeight } : null, style]}>
      <ScrollView
        ref={scrollRef}
        horizontal={isH}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={contentStyle}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w, h) => setContentSize(isH ? w : h)}
        onLayout={(e: LayoutChangeEvent) =>
          setViewSize(isH ? e.nativeEvent.layout.width : e.nativeEvent.layout.height)
        }
      >
        {children}
      </ScrollView>

      {/* Custom scrollbar */}
      {showScrollbar && hasOverflow && (
        <View style={isH ? styles.trackH : styles.trackV}>
          <View
            style={[
              styles.thumb,
              isH
                ? { width: thumbSize, height: '100%', left: thumbPos }
                : { height: thumbSize, width: '100%', top: thumbPos },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: { position: 'relative', overflow: 'hidden' },
  rootV: { flexDirection: 'row' },
  rootH: { flexDirection: 'column' },
  scroll: { flex: 1 },
  trackV: {
    width: 6,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginVertical: 2,
    position: 'relative',
  },
  trackH: {
    height: 6,
    backgroundColor: 'transparent',
    borderRadius: 3,
    marginHorizontal: 2,
    position: 'relative',
  },
  thumb: {
    position: 'absolute',
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
  },
});

export { ScrollArea };
