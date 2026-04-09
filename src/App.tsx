import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { TransactionProvider } from './context/TransactionContext';
import { AppNavigator } from './navigation/AppNavigator';
import { theme } from './constants/Theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { View, ActivityIndicator } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4FD1C5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" backgroundColor="#0A0A0A" />
          <AppNavigator />
        </PaperProvider>
      </TransactionProvider>
    </SafeAreaProvider>
  );
}
