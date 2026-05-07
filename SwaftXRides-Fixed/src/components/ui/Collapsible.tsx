// src/components/ui/Collapsible.tsx
// React Native port of collapsible.tsx (Radix → pure RN with LayoutAnimation)

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ViewStyle,
} from 'react-native';
import { renderTriggerTouchable } from './triggerUtils';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CollapsibleContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextType>({
  open: false,
  setOpen: () => {},
});

// ─── Collapsible (Root) ───────────────────────────────────────────────────────

interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Collapsible = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
  style,
}: CollapsibleProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen! : uncontrolled;

  const setOpen = (val: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isControlled) setUncontrolled(val);
    onOpenChange?.(val);
  };

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <View style={style}>{children}</View>
    </CollapsibleContext.Provider>
  );
};

// ─── CollapsibleTrigger ───────────────────────────────────────────────────────

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CollapsibleTrigger = ({ children, style }: CollapsibleTriggerProps) => {
  const { open, setOpen } = React.useContext(CollapsibleContext);
  return renderTriggerTouchable(children, {
    onPress: () => setOpen(!open),
    activeOpacity: 0.7,
    style,
  });
};

// ─── CollapsibleContent ───────────────────────────────────────────────────────

interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CollapsibleContent = ({ children, style }: CollapsibleContentProps) => {
  const { open } = React.useContext(CollapsibleContext);
  if (!open) return null;
  return <View style={style}>{children}</View>;
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
