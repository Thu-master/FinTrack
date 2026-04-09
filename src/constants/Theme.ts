import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { Colors } from './Colors';

const fontConfig = {
  fontFamily: 'Inter_400Regular',
  displayLarge: { fontFamily: 'Inter_900Black' },
  displayMedium: { fontFamily: 'Inter_800ExtraBold' },
  displaySmall: { fontFamily: 'Inter_700Bold' },
  headlineLarge: { fontFamily: 'Inter_800ExtraBold' },
  headlineMedium: { fontFamily: 'Inter_700Bold' },
  headlineSmall: { fontFamily: 'Inter_600SemiBold' },
  titleLarge: { fontFamily: 'Inter_700Bold' },
  titleMedium: { fontFamily: 'Inter_600SemiBold' },
  titleSmall: { fontFamily: 'Inter_500Medium' },
  labelLarge: { fontFamily: 'Inter_600SemiBold' },
  labelMedium: { fontFamily: 'Inter_500Medium' },
  labelSmall: { fontFamily: 'Inter_400Regular' },
  bodyLarge: { fontFamily: 'Inter_400Regular' },
  bodyMedium: { fontFamily: 'Inter_400Regular' },
  bodySmall: { fontFamily: 'Inter_400Regular' },
};

export const theme = {
  ...MD3LightTheme,
  fonts: configureFonts({ config: fontConfig }),
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
