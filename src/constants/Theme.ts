import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Colors } from './Colors';

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 57,
    fontWeight: '400',
    letterSpacing: 0,
    lineHeight: 64,
  },
  // Add other font styles as needed
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    error: Colors.error,
    background: Colors.background,
    surface: Colors.surface,
    onSurface: Colors.text,
    outline: Colors.border,
  },
  roundness: 12,
};
