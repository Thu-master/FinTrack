import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTransactions } from '../context/TransactionContext';
import { Colors as AppColors } from '../constants/Colors';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width;

const PremiumColors = {
  bg: '#0A0A0A',
  surface: '#1A1D21',
  textMain: '#FFFFFF',
  textSub: '#A0AEC0',
  income: '#48BB78',
  expense: '#F56565',
};

// Rich gradients for pie chart
const CHART_COLORS_EXPENSE = [
  '#FF6B6B', '#FF92A9', '#F06595', '#FCC419', '#FFD43B', '#FFA94D', '#B19CD9', '#E599F7'
];

const CHART_COLORS_INCOME = [
  '#48BB78', '#20C997', '#38D9A9', '#12B886', '#A3E635', '#4DABF7', '#3BC9DB', '#66D9E8'
];

export const ReportScreen = () => {
  const { transactions, totalIncome, totalExpense, totalBalance } = useTransactions();
  const [reportType, setReportType] = useState<'expense' | 'income'>('expense');

  const filteredTransactions = transactions.filter(t => t.type === reportType);

  const categoryData = filteredTransactions.reduce((acc: any, curr) => {
    if (!acc[curr.category]) acc[curr.category] = 0;
    acc[curr.category] += curr.amount;
    return acc;
  }, {});

  const currentColors = reportType === 'expense' ? CHART_COLORS_EXPENSE : CHART_COLORS_INCOME;

  const chartData = Object.keys(categoryData).map((key, index) => ({
    name: key,
    population: categoryData[key],
    color: currentColors[index % currentColors.length],
    legendFontColor: PremiumColors.textSub,
    legendFontSize: 13,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.headerTitle}>Báo Cáo Thống Kê</Text>
          <Text style={styles.headerSub}>Tổng quan tình hình tài chính</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(100)}>
          <View style={[styles.summaryCard, { backgroundColor: AppColors.secondary }]}>
            <View style={styles.glassEffect} />
            <Text style={styles.cardTitle}>SỐ DƯ HIỆN TẠI</Text>
            <Text style={styles.cardAmount}>{formatCurrency(totalBalance)}</Text>
            
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 16}}>
               <View>
                 <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4}}>TỔNG THU</Text>
                 <Text style={{color: '#48BB78', fontSize: 16, fontWeight: 'bold'}}>+{formatCurrency(totalIncome)}</Text>
               </View>
               <View style={{alignItems: 'flex-end'}}>
                 <Text style={{color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4}}>TỔNG CHI</Text>
                 <Text style={{color: '#F56565', fontSize: 16, fontWeight: 'bold'}}>-{formatCurrency(totalExpense)}</Text>
               </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(150)} style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, reportType === 'expense' && styles.tabExpenseActive]} 
            onPress={() => setReportType('expense')}
          >
            <Text style={[styles.tabText, reportType === 'expense' && { color: '#FFF' }]}>Cơ cấu Chi Tiêu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, reportType === 'income' && styles.tabIncomeActive]} 
            onPress={() => setReportType('income')}
          >
            <Text style={[styles.tabText, reportType === 'income' && { color: '#FFF' }]}>Cơ cấu Thu Nhập</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.chartWrapper}>
          <Text style={styles.sectionTitle}>Biểu đồ {reportType === 'expense' ? 'chi tiêu' : 'thu nhập'}</Text>
          
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"0"}
              center={[10, 0]}
              absolute
            />
          ) : (
             <Text style={styles.emptyText}>Chưa có dữ liệu giao dịch {reportType === 'expense' ? 'chi tiêu' : 'thu nhập'}.</Text>
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)}>
          <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Chi tiết từng mục</Text>
          <View style={styles.listCard}>
            {chartData.length === 0 && <Text style={{color: PremiumColors.textSub, textAlign: 'center'}}>Không có dữ liệu</Text>}
            {chartData.map((item, index) => (
              <View key={index} style={[styles.listItem, index === chartData.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.rowLeft}>
                  <View style={[styles.colorIndicator, { shadowColor: item.color, backgroundColor: item.color }]} />
                  <Text style={styles.categoryName}>{item.name}</Text>
                </View>
                <Text style={styles.categoryAmount}>{formatCurrency(item.population)}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumColors.bg },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 80 },
  header: { marginBottom: 32 },
  headerTitle: { color: PremiumColors.textMain, fontSize: 32, fontFamily: 'Inter_900Black', letterSpacing: 0.5 },
  headerSub: { color: PremiumColors.textSub, fontSize: 15, fontFamily: 'Inter_600SemiBold', marginTop: 8 },
  
  summaryCard: {
    padding: 24, borderRadius: 24, marginBottom: 24,
    elevation: 12, shadowColor: '#4A00E0', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 24,
    position: 'relative', overflow: 'hidden',
  },
  glassEffect: { position: 'absolute', top: -100, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(255,255,255,0.05)' },
  cardTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5, marginBottom: 12 },
  cardAmount: { color: '#fff', fontSize: 38, fontFamily: 'Inter_900Black', marginBottom: 8 },
  
  tabContainer: { flexDirection: 'row', backgroundColor: PremiumColors.surface, borderRadius: 16, padding: 4, marginBottom: 24 },
  tabButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12 },
  tabExpenseActive: { backgroundColor: PremiumColors.expense, shadowColor: PremiumColors.expense, elevation: 6, shadowOpacity: 0.4, shadowRadius: 8 },
  tabIncomeActive: { backgroundColor: PremiumColors.income, shadowColor: PremiumColors.income, elevation: 6, shadowOpacity: 0.4, shadowRadius: 8 },
  tabText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: PremiumColors.textSub },

  chartWrapper: {
    backgroundColor: PremiumColors.surface, borderRadius: 24, padding: 24, marginBottom: 32,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
    alignItems: 'center',
  },
  sectionTitle: { color: PremiumColors.textMain, fontSize: 18, fontFamily: 'Inter_800ExtraBold', width: '100%', textAlign: 'left', marginBottom: 20 },
  emptyText: { color: PremiumColors.textSub, paddingVertical: 40 },
  
  listCard: {
    backgroundColor: PremiumColors.surface, borderRadius: 24, padding: 16,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8,
  },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  colorIndicator: { width: 14, height: 14, borderRadius: 7, marginRight: 16, elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4 },
  categoryName: { color: PremiumColors.textMain, fontSize: 16, fontWeight: '600' },
  categoryAmount: { color: PremiumColors.textMain, fontSize: 16, fontWeight: '800' },
});
