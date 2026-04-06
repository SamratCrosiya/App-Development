// src/components/ui/Carousel.tsx
// React Native port of carousel.tsx
// embla-carousel-react → ScrollView with manual index tracking

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Context ──────────────────────────────────────────────────────────────────

type Orientation = 'horizontal' | 'vertical';

interface CarouselContextType {
  currentIndex: number;
  total: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: Orientation;
}

const CarouselContext = React.createContext<CarouselContextType>({
  currentIndex: 0,
  total: 0,
  scrollPrev: () => {},
  scrollNext: () => {},
  canScrollPrev: false,
  canScrollNext: false,
  orientation: 'horizontal',
});

// ─── Carousel (Root) ──────────────────────────────────────────────────────────

interface CarouselProps {
  orientation?: Orientation;
  children: React.ReactNode;
  style?: ViewStyle;
  itemWidth?: number;   // defaults to full screen width
  loop?: boolean;
}

const Carousel = ({
  orientation = 'horizontal',
  children,
  style,
  itemWidth,
  loop = false,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Count CarouselItem children
  const items = React.Children.toArray(children).filter(
    (c) => React.isValidElement(c) && (c.type as any).displayName === 'CarouselContent'
  );
  // Flatten: get children of CarouselContent
  const allItems = items.flatMap((item) =>
    React.isValidElement(item) ? React.Children.toArray((item.props as any).children) : []
  );
  const total = allItems.length;

  const scrollTo = useCallback(
    (index: number) => {
      if (!scrollRef.current) return;
      const clamped = loop
        ? ((index % total) + total) % total
        : Math.max(0, Math.min(index, total - 1));
      const size = itemWidth ?? SCREEN_WIDTH;
      if (orientation === 'horizontal') {
        scrollRef.current.scrollTo({ x: clamped * size, animated: true });
      } else {
        scrollRef.current.scrollTo({ y: clamped * size, animated: true });
      }
      setCurrentIndex(clamped);
    },
    [total, itemWidth, orientation, loop]
  );

  const scrollPrev = useCallback(() => scrollTo(currentIndex - 1), [currentIndex, scrollTo]);
  const scrollNext = useCallback(() => scrollTo(currentIndex + 1), [currentIndex, scrollTo]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const size = itemWidth ?? SCREEN_WIDTH;
    const offset =
      orientation === 'horizontal'
        ? e.nativeEvent.contentOffset.x
        : e.nativeEvent.contentOffset.y;
    setCurrentIndex(Math.round(offset / size));
  };

  return (
    <CarouselContext.Provider
      value={{
        currentIndex,
        total,
        scrollPrev,
        scrollNext,
        canScrollPrev: loop || currentIndex > 0,
        canScrollNext: loop || currentIndex < total - 1,
        orientation,
      }}
    >
      <View style={[styles.root, style]} accessibilityRole="none">
        <ScrollView
          ref={scrollRef}
          horizontal={orientation === 'horizontal'}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scroll}
        >
          {children}
        </ScrollView>
      </View>
    </CarouselContext.Provider>
  );
};
Carousel.displayName = 'Carousel';

// ─── CarouselContent ──────────────────────────────────────────────────────────

interface CarouselContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CarouselContent = ({ children, style }: CarouselContentProps) => {
  const { orientation } = React.useContext(CarouselContext);
  return (
    <View style={[orientation === 'horizontal' ? styles.contentH : styles.contentV, style]}>
      {children}
    </View>
  );
};
CarouselContent.displayName = 'CarouselContent';

// ─── CarouselItem ─────────────────────────────────────────────────────────────

interface CarouselItemProps {
  children: React.ReactNode;
  style?: ViewStyle;
  width?: number;
}

const CarouselItem = ({ children, style, width }: CarouselItemProps) => {
  const { orientation } = React.useContext(CarouselContext);
  const size = width ?? SCREEN_WIDTH;
  return (
    <View
      style={[
        orientation === 'horizontal'
          ? { width: size, paddingLeft: SPACING.md }
          : { height: size, paddingTop: SPACING.md },
        style,
      ]}
    >
      {children}
    </View>
  );
};
CarouselItem.displayName = 'CarouselItem';

// ─── CarouselPrevious ─────────────────────────────────────────────────────────

interface NavButtonProps {
  style?: ViewStyle;
  size?: number;
}

const CarouselPrevious = ({ style, size = 36 }: NavButtonProps) => {
  const { scrollPrev, canScrollPrev, orientation } = React.useContext(CarouselContext);
  return (
    <TouchableOpacity
      style={[
        styles.navBtn,
        { width: size, height: size, borderRadius: size / 2 },
        orientation === 'horizontal' ? styles.navBtnLeft : styles.navBtnTop,
        !canScrollPrev && styles.navBtnDisabled,
        style,
      ]}
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      activeOpacity={0.7}
    >
      <Text style={styles.navArrow}>{orientation === 'horizontal' ? '‹' : '∧'}</Text>
    </TouchableOpacity>
  );
};
CarouselPrevious.displayName = 'CarouselPrevious';

// ─── CarouselNext ─────────────────────────────────────────────────────────────

const CarouselNext = ({ style, size = 36 }: NavButtonProps) => {
  const { scrollNext, canScrollNext, orientation } = React.useContext(CarouselContext);
  return (
    <TouchableOpacity
      style={[
        styles.navBtn,
        { width: size, height: size, borderRadius: size / 2 },
        orientation === 'horizontal' ? styles.navBtnRight : styles.navBtnBottom,
        !canScrollNext && styles.navBtnDisabled,
        style,
      ]}
      onPress={scrollNext}
      disabled={!canScrollNext}
      activeOpacity={0.7}
    >
      <Text style={styles.navArrow}>{orientation === 'horizontal' ? '›' : '∨'}</Text>
    </TouchableOpacity>
  );
};
CarouselNext.displayName = 'CarouselNext';

// ─── CarouselDots (bonus — replaces pagination) ───────────────────────────────

const CarouselDots = ({ style }: { style?: ViewStyle }) => {
  const { currentIndex, total } = React.useContext(CarouselContext);
  return (
    <View style={[styles.dots, style]}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === currentIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    position: 'relative',
  },
  scroll: {
    flexGrow: 0,
  },
  contentH: {
    flexDirection: 'row',
  },
  contentV: {
    flexDirection: 'column',
  },
  navBtn: {
    position: 'absolute',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navBtnLeft: {
    left: -SPACING.sm,
    top: '50%',
  },
  navBtnRight: {
    right: -SPACING.sm,
    top: '50%',
  },
  navBtnTop: {
    top: -SPACING.sm,
    left: '50%',
  },
  navBtnBottom: {
    bottom: -SPACING.sm,
    left: '50%',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navArrow: {
    fontSize: 20,
    color: COLORS.foreground,
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 18,
  },
});

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots };
