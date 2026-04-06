// src/navigation/RootNavigator.tsx
// Bottom tab navigator — replaces the web Navbar

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CompareScreen from '../screens/CompareScreen';
import FeaturesScreen from '../screens/FeaturesScreen';
import CitiesScreen from '../screens/CitiesScreen';
import AboutScreen from '../screens/AboutScreen';
import UIKitScreen from '../screens/UIKitScreen';
import { COLORS, useAppTheme } from '../constants/theme';

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, string> = {
  Home: '🏠',
  Compare: '↔️',
  Features: '⚡',
  Cities: '🗺️',
  About: '★',
};

const RootNavigator = () => {
  useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: COLORS.card,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: COLORS.foreground,
          fontWeight: '700',
          fontSize: 17,
        },
        headerLeft: () => (
          <View style={styles.logoContainer}>
            <View style={[styles.logoIcon, { backgroundColor: COLORS.primary }]}>
              <Text style={{ fontSize: 14 }}>📍</Text>
            </View>
            <Text style={[styles.logoText, { color: COLORS.foreground }]}>
              Swaft <Text style={{ color: COLORS.primary }}>X</Text>
            </Text>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 60,
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>
            {TAB_ICONS[route.name] ?? 'UI'}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Swaft X' }} />
      <Tab.Screen name="Compare" component={CompareScreen} options={{ title: 'Compare' }} />
      <Tab.Screen name="Features" component={FeaturesScreen} options={{ title: 'Features' }} />
      <Tab.Screen name="Cities" component={CitiesScreen} options={{ title: 'Cities' }} />
      <Tab.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
      <Tab.Screen name="UIKit" component={UIKitScreen} options={{ title: 'UI Kit' }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 16,
  },
  logoIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '800',
  },
});

export default RootNavigator;
