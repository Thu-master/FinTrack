import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Title } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export const LoginScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>💰</Text>
          <Title style={styles.title}>FinTrack</Title>
          <Text style={styles.subtitle}>Quản lý tài chính cá nhân thông minh</Text>
        </View>
        
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Main')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Bắt đầu ngay
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoText: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  button: {
    width: '100%',
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
});
