// src/components/ui/Resizable.tsx
// React Native port of resizable.tsx
// react-resizable-panels → PanResponder-based split view

import React, { useState, useRef, useCallback } from 'react';
import {
  View, PanResponder, StyleSheet, ViewStyle, LayoutChangeEvent,
} from 'react-native';
import { COLORS } from '../../constants/theme';

type Direction = 'horizontal' | 'vertical';

// ─── ResizablePanelGroup ──────────────────────────────────────────────────────

interface PanelGroupProps {
  direction?: Direction;
  children: React.ReactNode;
  style?: ViewStyle;
  defaultSplit?: number; // 0-1, fraction for first panel (default 0.5)
}

const ResizablePanelGroup = ({
  direction = 'horizontal',
  children,
  style,
  defaultSplit = 0.5,
}: PanelGroupProps) => {
  const [split, setSplit] = useState(defaultSplit);
  const containerSize = useRef(0);
  const isH = direction === 'horizontal';

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        const delta = isH ? g.dx : g.dy;
        if (containerSize.current === 0) return;
        setSplit((prev) => Math.min(0.9, Math.max(0.1, prev + delta / containerSize.current)));
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    containerSize.current = isH ? e.nativeEvent.layout.width : e.nativeEvent.layout.height;
  };

  const childArray = React.Children.toArray(children);
  const panelA = childArray[0];
  const panelB = childArray[childArray.length - 1];

  return (
    <View
      style={[styles.group, isH ? styles.groupH : styles.groupV, style]}
      onLayout={onLayout}
    >
      {/* Panel A */}
      <View style={isH ? { flex: split } : { flex: split }}>{panelA}</View>

      {/* Resize handle */}
      <View
        style={isH ? styles.handleH : styles.handleV}
        {...panResponder.panHandlers}
      >
        <View style={isH ? styles.gripH : styles.gripV}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={isH ? styles.dotH : styles.dotV} />
          ))}
        </View>
      </View>

      {/* Panel B */}
      <View style={{ flex: 1 - split }}>{panelB}</View>
    </View>
  );
};

// ─── ResizablePanel (thin wrapper, for API compat) ────────────────────────────

const ResizablePanel = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flex: 1 }, style]}>{children}</View>
);

// ─── ResizableHandle (standalone, for manual use) ─────────────────────────────

const ResizableHandle = ({
  withHandle = true,
  direction = 'horizontal',
  style,
}: {
  withHandle?: boolean;
  direction?: Direction;
  style?: ViewStyle;
}) => {
  const isH = direction === 'horizontal';
  return (
    <View style={[isH ? styles.handleH : styles.handleV, style]}>
      {withHandle && (
        <View style={isH ? styles.gripH : styles.gripV}>
          {[0, 1, 2].map((i) => <View key={i} style={isH ? styles.dotH : styles.dotV} />)}
        </View>
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  group: { overflow: 'hidden' },
  groupH: { flexDirection: 'row', flex: 1 },
  groupV: { flexDirection: 'column', flex: 1 },
  handleH: {
    width: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.border,
    cursor: 'col-resize' as any,
  },
  handleV: {
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.border,
  },
  gripH: {
    width: 14,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 3,
  },
  gripV: {
    height: 14,
    width: 24,
    borderRadius: 4,
    backgroundColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 3,
  },
  dotH: { width: 2, height: 2, borderRadius: 1, backgroundColor: COLORS.mutedForeground },
  dotV: { width: 2, height: 2, borderRadius: 1, backgroundColor: COLORS.mutedForeground },
});

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
