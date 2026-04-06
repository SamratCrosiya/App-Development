import React from 'react';

export type AppThemeName = 'black' | 'green' | 'white';

type ThemePalette = {
  primary: string;
  primaryDark: string;
  primaryForeground: string;
  accent: string;
  secondary: string;
  destructive: string;
  warning: string;
  background: string;
  card: string;
  cardAlt: string;
  border: string;
  borderLight: string;
  foreground: string;
  mutedForeground: string;
  muted: string;
  glassBackground: string;
  glassBorder: string;
  white: string;
  black: string;
};

const THEME_PALETTES: Record<AppThemeName, ThemePalette> = {
  black: {
    primary: '#00D9FF',
    primaryDark: '#0099CC',
    primaryForeground: '#000000',
    accent: '#10B981',
    secondary: '#1E293B',
    destructive: '#EF4444',
    warning: '#F59E0B',
    background: '#060A12',
    card: '#0D1525',
    cardAlt: '#111827',
    border: '#1E2D45',
    borderLight: '#243447',
    foreground: '#F1F5F9',
    mutedForeground: '#94A3B8',
    muted: '#64748B',
    glassBackground: 'rgba(13, 21, 37, 0.8)',
    glassBorder: 'rgba(30, 45, 69, 0.8)',
    white: '#FFFFFF',
    black: '#000000',
  },
  green: {
    primary: '#22C55E',
    primaryDark: '#15803D',
    primaryForeground: '#052E16',
    accent: '#86EFAC',
    secondary: '#123524',
    destructive: '#EF4444',
    warning: '#F59E0B',
    background: '#05140C',
    card: '#0B2014',
    cardAlt: '#113524',
    border: '#1F4D35',
    borderLight: '#2E6B4A',
    foreground: '#ECFDF5',
    mutedForeground: '#A7F3D0',
    muted: '#6EE7B7',
    glassBackground: 'rgba(11, 32, 20, 0.82)',
    glassBorder: 'rgba(31, 77, 53, 0.82)',
    white: '#FFFFFF',
    black: '#000000',
  },
  white: {
    primary: '#111827',
    primaryDark: '#0F172A',
    primaryForeground: '#FFFFFF',
    accent: '#16A34A',
    secondary: '#E2E8F0',
    destructive: '#DC2626',
    warning: '#D97706',
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardAlt: '#F1F5F9',
    border: '#CBD5E1',
    borderLight: '#E2E8F0',
    foreground: '#0F172A',
    mutedForeground: '#475569',
    muted: '#64748B',
    glassBackground: 'rgba(255, 255, 255, 0.86)',
    glassBorder: 'rgba(203, 213, 225, 0.86)',
    white: '#FFFFFF',
    black: '#000000',
  },
};

const DEFAULT_THEME: AppThemeName = 'black';

export const THEME_OPTIONS: Array<{ value: AppThemeName; label: string }> = [
  { value: 'black', label: 'Black' },
  { value: 'green', label: 'Green' },
  { value: 'white', label: 'White' },
];

export const COLORS: ThemePalette = { ...THEME_PALETTES[DEFAULT_THEME] };

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 999,
};

export const SHADOWS = {
  primary: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

const applyTheme = (themeName: AppThemeName) => {
  Object.assign(COLORS, THEME_PALETTES[themeName]);
  SHADOWS.primary.shadowColor = COLORS.primary;
};

interface ThemeContextValue {
  colors: ThemePalette;
  isLight: boolean;
  themeName: AppThemeName;
  setThemeName: React.Dispatch<React.SetStateAction<AppThemeName>>;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  colors: COLORS,
  isLight: false,
  themeName: DEFAULT_THEME,
  setThemeName: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [themeName, setThemeName] = React.useState<AppThemeName>(DEFAULT_THEME);

  React.useEffect(() => {
    applyTheme(themeName);
  }, [themeName]);

  const value = React.useMemo(
    () => ({
      colors: COLORS,
      isLight: themeName === 'white',
      themeName,
      setThemeName,
    }),
    [themeName]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useAppTheme = () => React.useContext(ThemeContext);
