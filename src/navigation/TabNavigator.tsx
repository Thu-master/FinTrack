import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { ReportScreen } from '../screens/ReportScreen';
import { Home, PlusCircle, PieChart as ChartIcon } from 'lucide-react-native';
import { Colors } from '../constants/Colors';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: Colors.text,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTransactionScreen}
        options={{
          title: 'Thêm mới',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          title: 'Báo cáo',
          tabBarIcon: ({ color, size }) => <ChartIcon color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};
