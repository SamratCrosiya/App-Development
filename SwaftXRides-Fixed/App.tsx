import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { Toaster } from './src/components/ui/Toast';
import { COLORS, ThemeProvider, useAppTheme } from './src/constants/theme';

function AppShell() {
  const { isLight } = useAppTheme();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style={isLight ? 'dark' : 'light'} backgroundColor={COLORS.background} />
        <RootNavigator />
        <Toaster />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
