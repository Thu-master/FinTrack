import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { TransactionProvider } from './context/TransactionContext';
import { AppNavigator } from './navigation/AppNavigator';
import { theme } from './constants/Theme';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="auto" />
          <AppNavigator />
        </PaperProvider>
      </TransactionProvider>
    </SafeAreaProvider>
  );
}
