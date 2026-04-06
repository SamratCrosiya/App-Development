// src/components/ui/Drawer.tsx
// React Native port of drawer.tsx (vaul → Animated bottom sheet)

import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Dimensions,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_THRESHOLD = 120;

// ─── Context ──────────────────────────────────────────────────────────────────

interface DrawerContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const DrawerContext = React.createContext<DrawerContextType>({ open: false, setOpen: () => {} });

// ─── Drawer (Root) ────────────────────────────────────────────────────────────

interface DrawerProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  snapPoints?: number[];   // heights in px (bottom-up)
}

const Drawer = ({ children, open: controlledOpen, defaultOpen = false, onOpenChange }: DrawerProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : uncontrolled;

  const setOpen = (val: boolean) => {
    if (!isControlled) setUncontrolled(val);
    onOpenChange?.(val);
  };

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

// ─── DrawerTrigger ────────────────────────────────────────────────────────────

const DrawerTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(DrawerContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(true),
    style,
    activeOpacity: 0.8,
  });
};

// ─── DrawerClose ──────────────────────────────────────────────────────────────

const DrawerClose = ({ children, style }: { children?: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(DrawerContext);
  return (
    <TouchableOpacity onPress={() => setOpen(false)} style={style} activeOpacity={0.7}>
      {children ?? <Text style={closeStyle.text}>Close</Text>}
    </TouchableOpacity>
  );
};
const closeStyle = StyleSheet.create({ text: { color: COLORS.primary, fontSize: 14, fontWeight: '600' } });

// ─── DrawerContent ────────────────────────────────────────────────────────────

interface DrawerContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  maxHeight?: number;
}

const DrawerContent = ({ children, style, maxHeight = SCREEN_HEIGHT * 0.85 }: DrawerContentProps) => {
  const { open, setOpen } = React.useContext(DrawerContext);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const lastDragY = useRef(0);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: open ? 0 : SCREEN_HEIGHT,
      useNativeDriver: true,
      damping: 20,
      stiffness: 180,
    }).start();
  }, [open]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          dragY.setValue(g.dy);
          lastDragY.current = g.dy;
        }
      },
      onPanResponderRelease: () => {
        if (lastDragY.current > SNAP_THRESHOLD) {
          setOpen(false);
        }
        dragY.setValue(0);
        lastDragY.current = 0;
      },
    })
  ).current;

  const combinedTranslate = Animated.add(translateY, dragY);

  return (
    <Modal visible={open} transparent animationType="none"
      statusBarTranslucent onRequestClose={() => setOpen(false)}>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: open ? 1 : 0 }]}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setOpen(false)} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { maxHeight, transform: [{ translateY: combinedTranslate }] },
          style,
        ]}
      >
        {/* Drag handle */}
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

// ─── DrawerHeader / Footer / Title / Description ──────────────────────────────

const DrawerHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const DrawerFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

const DrawerTitle = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.title, style]}>{children}</Text>
);

const DrawerDescription = ({ children, style }: { children: React.ReactNode; style?: TextStyle }) => (
  <Text style={[styles.description, style]}>{children}</Text>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  handleArea: {
    alignItems: 'center',
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.muted,
    opacity: 0.5,
  },
  header: {
    gap: 6,
    padding: SPACING.md,
  },
  footer: {
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.foreground,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
});

export {
  Drawer, DrawerTrigger, DrawerClose, DrawerContent,
  DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
};
