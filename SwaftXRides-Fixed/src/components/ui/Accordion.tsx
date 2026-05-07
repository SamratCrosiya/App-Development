// src/components/ui/Accordion.tsx
// React Native port of accordion.tsx (Radix UI → pure RN)

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccordionProps {
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  children: React.ReactNode;
  style?: object;
}

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: object;
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: object;
  textStyle?: object;
}

interface AccordionContentProps {
  children: React.ReactNode;
  style?: object;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AccordionContext = React.createContext<{
  openItems: string[];
  toggle: (value: string) => void;
  type: 'single' | 'multiple';
}>({ openItems: [], toggle: () => {}, type: 'single' });

const AccordionItemContext = React.createContext<{
  value: string;
  isOpen: boolean;
}>({ value: '', isOpen: false });

// ─── Accordion (Root) ─────────────────────────────────────────────────────────

const Accordion = ({ type = 'single', defaultValue, children, style }: AccordionProps) => {
  const initial = defaultValue
    ? Array.isArray(defaultValue)
      ? defaultValue
      : [defaultValue]
    : [];
  const [openItems, setOpenItems] = useState<string[]>(initial);

  const toggle = (value: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (type === 'single') {
      setOpenItems((prev) => (prev.includes(value) ? [] : [value]));
    } else {
      setOpenItems((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, type }}>
      <View style={style}>{children}</View>
    </AccordionContext.Provider>
  );
};

// ─── AccordionItem ────────────────────────────────────────────────────────────

const AccordionItem = ({ value, children, style }: AccordionItemProps) => {
  const { openItems } = React.useContext(AccordionContext);
  const isOpen = openItems.includes(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <View style={[styles.item, style]}>{children}</View>
    </AccordionItemContext.Provider>
  );
};

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

const AccordionTrigger = ({ children, style, textStyle }: AccordionTriggerProps) => {
  const { toggle } = React.useContext(AccordionContext);
  const { value, isOpen } = React.useContext(AccordionItemContext);
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={() => toggle(value)}
      activeOpacity={0.7}
    >
      <Text style={[styles.triggerText, textStyle]}>{children}</Text>
      <Animated.Text style={[styles.chevron, { transform: [{ rotate }] }]}>⌄</Animated.Text>
    </TouchableOpacity>
  );
};

// ─── AccordionContent ─────────────────────────────────────────────────────────

const AccordionContent = ({ children, style }: AccordionContentProps) => {
  const { isOpen } = React.useContext(AccordionItemContext);

  if (!isOpen) return null;

  return (
    <View style={[styles.content, style]}>
      {typeof children === 'string' ? (
        <Text style={styles.contentText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.foreground,
  },
  chevron: {
    fontSize: 18,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
  content: {
    paddingBottom: SPACING.md,
  },
  contentText: {
    fontSize: 14,
    color: COLORS.mutedForeground,
    lineHeight: 22,
  },
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
