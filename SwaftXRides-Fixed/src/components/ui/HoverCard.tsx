// src/components/ui/HoverCard.tsx
// React Native port of hover-card.tsx
// No hover in RN → long-press reveals popover (Pressable + Modal)

import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../../constants/theme';
import { renderTriggerTouchable } from './triggerUtils';

// ─── Context ──────────────────────────────────────────────────────────────────

interface HoverCardContextType {
  open: boolean;
  setOpen: (v: boolean) => void;
}

const HoverCardContext = React.createContext<HoverCardContextType>({ open: false, setOpen: () => {} });

// ─── HoverCard (Root) ─────────────────────────────────────────────────────────

interface HoverCardProps {
  children: React.ReactNode;
  openDelay?: number;
  closeDelay?: number;
}

const HoverCard = ({ children }: HoverCardProps) => {
  const [open, setOpen] = useState(false);
  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      <View>{children}</View>
    </HoverCardContext.Provider>
  );
};

// ─── HoverCardTrigger ─────────────────────────────────────────────────────────
// Long-press in RN replaces hover-enter on web

const HoverCardTrigger = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const { setOpen } = React.useContext(HoverCardContext);
  return renderTriggerTouchable(children, {
    onLongPress: () => setOpen(true),
    onPress: () => setOpen(true),
    delayLongPress: 300,
    style,
    activeOpacity: 0.85,
  });
};

// ─── HoverCardContent ─────────────────────────────────────────────────────────

interface HoverCardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: 'left' | 'center' | 'right';
}

const HoverCardContent = ({ children, style, align = 'center' }: HoverCardContentProps) => {
  const { open, setOpen } = React.useContext(HoverCardContext);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
      <TouchableWithoutFeedback onPress={() => setOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.content, align === 'right' && styles.alignRight, align === 'left' && styles.alignLeft, style]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  content: {
    width: 256,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  alignRight: { alignSelf: 'flex-end' },
  alignLeft: { alignSelf: 'flex-start' },
});

export { HoverCard, HoverCardTrigger, HoverCardContent };
