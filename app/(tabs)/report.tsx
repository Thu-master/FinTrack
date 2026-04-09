import React from 'react';
import { StyleSheet, View, Dimensions, ScrollView } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function ReportScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? '#0A0A0A' : '#F7F9FC';
  const surfaceColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#8E8E93' : '#8E8E93';

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  const chartData = [
    { name: 'Ăn uống', amount: 4500000, color: '#ff6b6b', legendFontColor: subTextColor, legendFontSize: 13 },
    { name: 'Di chuyển', amount: 1200000, color: '#4dabf7', legendFontColor: subTextColor, legendFontSize: 13 },
    { name: 'Mua sắm', amount: 2500000, color: '#fcc419', legendFontColor: subTextColor, legendFontSize: 13 },
    { name: 'Hóa đơn', amount: 1800000, color: '#20c997', legendFontColor: subTextColor, legendFontSize: 13 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Animated.View entering={FadeInUp.duration(600).delay(100)} style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>Phân Tích & Thống Kê</Text>
          <Text style={[styles.headerSub, { color: subTextColor }]}>Tháng 4, 2026</Text>
        </Animated.View>

        {/* Premium Data Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <View style={[styles.summaryCard, { backgroundColor: '#1565C0' }]}>
            <View style={styles.glassEffect} />
            <Text style={styles.cardTitle}>TỔNG CHI TIÊU</Text>
            <Text style={styles.cardAmount}>{formatCurrency(10000000)}</Text>
            
            <View style={styles.cardStats}>
              <View>
                <Text style={styles.statLabel}>Ngân sách dư</Text>
                <Text style={styles.statValue}>{formatCurrency(5000000)}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.statLabel}>Cảnh báo Mức chi</Text>
                <Text style={[styles.statValue, { color: '#FFE066' }]}>Dưới 70%</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Premium Chart Segment */}
        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={[styles.chartWrapper, { backgroundColor: surfaceColor }]}>
          <Text style={[styles.chartLabel, { color: textColor }]}>Cơ cấu chi tiêu</Text>
          <PieChart
            data={chartData}
            width={width - 72} 
            height={220}
            chartConfig={chartConfig}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"0"}
            center={[15, 0]}
            absolute
          />
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 32 },
  headerTitle: { fontSize: 32, fontWeight: '900', letterSpacing: 0.5 },
  headerSub: { fontSize: 16, fontWeight: '600', marginTop: 4 },
  summaryCard: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  glassEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  cardAmount: { color: '#fff', fontSize: 38, fontWeight: '900', marginBottom: 24 },
  cardStats: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 },
  statValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },
  chartWrapper: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLabel: { fontSize: 18, fontWeight: '800', width: '100%', marginBottom: 16, textAlign: 'left' },
});
