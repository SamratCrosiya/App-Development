// src/components/ui/Avatar.tsx
// React Native port of avatar.tsx (Radix AvatarPrimitive → Image + Text fallback)

import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  TextStyle,
  ImageSourcePropType,
} from 'react-native';
import { COLORS, RADIUS } from '../../constants/theme';

// ─── Context ──────────────────────────────────────────────────────────────────

const AvatarContext = React.createContext<{
  imageLoaded: boolean;
  setImageLoaded: (v: boolean) => void;
}>({ imageLoaded: false, setImageLoaded: () => {} });

// ─── Avatar (Root) ────────────────────────────────────────────────────────────

interface AvatarProps {
  children: React.ReactNode;
  style?: ViewStyle;
  size?: number;
}

const Avatar = ({ children, style, size = 40 }: AvatarProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <AvatarContext.Provider value={{ imageLoaded, setImageLoaded }}>
      <View
        style={[
          styles.root,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
      >
        {children}
      </View>
    </AvatarContext.Provider>
  );
};

// ─── AvatarImage ──────────────────────────────────────────────────────────────

interface AvatarImageProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
}

const AvatarImage = ({ source, style }: AvatarImageProps) => {
  const { setImageLoaded } = React.useContext(AvatarContext);
  return (
    <Image
      source={source}
      style={[StyleSheet.absoluteFillObject, styles.image, style]}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageLoaded(false)}
      resizeMode="cover"
    />
  );
};

// ─── AvatarFallback ───────────────────────────────────────────────────────────

interface AvatarFallbackProps {
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AvatarFallback = ({ children, style, textStyle }: AvatarFallbackProps) => {
  const { imageLoaded } = React.useContext(AvatarContext);
  if (imageLoaded) return null;
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.fallback, style]}>
      {typeof children === 'string' ? (
        <Text style={[styles.fallbackText, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    backgroundColor: COLORS.secondary,
    flexShrink: 0,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
  },
  fallbackText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.mutedForeground,
    textTransform: 'uppercase',
  },
});

export { Avatar, AvatarImage, AvatarFallback };
