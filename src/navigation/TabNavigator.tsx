import React from 'react';
import { Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { Home, PlusCircle, PieChart as ChartIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Bỏ hoàn toàn header cũ cứng nhắc, nhường chỗ cho Custom Header động trong Screen
        tabBarActiveTintColor: '#4FD1C5', // Premium accent color
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          backgroundColor: 'rgba(26, 29, 33, 0.95)', // Glassmorphism Dark
          borderTopWidth: 0,
          elevation: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          height: Platform.OS === 'web' ? 76 : 70,
          paddingBottom: Platform.OS === 'web' ? 16 : 10,
          paddingTop: 10,
          ...(Platform.OS === 'web' && {
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.05)',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }), // Web specific tweaks
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size, focused }) => (
             <Home color={color} size={focused ? size + 4 : size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          title: 'Giao dịch',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={{
               backgroundColor: focused ? 'rgba(79, 209, 197, 0.15)' : 'transparent',
               width: 48,
               height: 48,
               borderRadius: 24,
               justifyContent: 'center',
               alignItems: 'center',
             }}>
               <PlusCircle color={color} size={focused ? size + 6 : size + 2} strokeWidth={focused ? 2.5 : 2} />
             </View>
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color, size, focused }) => (
            <ChartIcon color={color} size={focused ? size + 4 : size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
