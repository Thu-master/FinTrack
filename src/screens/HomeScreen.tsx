import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Colors as AppColors } from '../constants/Colors';
import { TrendingUp, TrendingDown, ArrowRight, Home, CreditCard, Send, Grid, Plus } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const { width } = Dimensions.get('window');

// Premium Dark Theme Colors
const PremiumColors = {
  bg: '#0A0A0A',
  surface: '#1A1D21',
  textMain: '#FFFFFF',
  textSub: '#A0AEC0',
  accent: '#4FD1C5',
  income: '#48BB78',
  expense: '#F56565',
};

export const HomeScreen = ({ navigation }: any) => {
  const { transactions, totalBalance, totalIncome, totalExpense, deleteTransaction } = useTransactions();
  const recentTransactions = transactions.slice(0, 5);

  const getIconForType = (type: string, color: string) => {
    if (type === 'income') return <TrendingUp color={color} size={20} />;
    return <TrendingDown color={color} size={20} />;
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
          <View>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={styles.userName}>Người Dùng!</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer} 
            onPress={() => {
              Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đăng xuất', onPress: () => signOut(auth), style: 'destructive' }
              ]);
            }}
          >
            <Avatar.Image size={48} source={{ uri: 'https://i.pravatar.cc/150?img=11' }} />
          </TouchableOpacity>
        </Animated.View>

        {/* Premium Balance Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <View style={[styles.balanceCard, { backgroundColor: AppColors.primary }]}>
            <View style={styles.cardGlow} />
            <Text style={styles.cardLabel}>TỔNG SỐ DƯ HIỆN TẠI</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statIconBadge}>
                  <TrendingUp color="#FFF" size={14} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Thu nhập</Text>
                  <Text style={styles.incomeAmount}>+{formatCurrency(totalIncome)}</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.statIconBadge}>
                  <TrendingDown color="#FFF" size={14} />
                </View>
                <View>
                  <Text style={styles.statLabel}>Chi tiêu</Text>
                  <Text style={styles.expenseAmount}>-{formatCurrency(totalExpense)}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.actionRow}>
          {[
            { label: 'Chuyển', icon: <Send size={24} color={PremiumColors.textMain} /> },
            { label: 'Nhận', icon: <Plus size={24} color={PremiumColors.textMain} /> },
            { label: 'Thẻ', icon: <CreditCard size={24} color={PremiumColors.textMain} /> },
            { label: 'Khác', icon: <Grid size={24} color={PremiumColors.textMain} /> },
          ].map((action, index) => (
            <TouchableOpacity key={index} style={styles.actionBtn}>
              <View style={styles.actionIconContainer}>
                {action.icon}
              </View>
              <Text style={styles.actionText}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Transactions Section */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Report')}>
            <Text style={styles.seeAll}>Xem biểu đồ</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={styles.listCard}>
          {recentTransactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Chưa có giao dịch. Bấm (+) để thêm.</Text>
            </View>
          ) : (
            recentTransactions.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.listItem, index === recentTransactions.length - 1 && { borderBottomWidth: 0 }]}
                onPress={() => {
                  Alert.alert('Tùy chọn', 'Bạn muốn làm gì với giao dịch này?', [
                    { text: 'Đóng', style: 'cancel' },
                    { text: 'Chỉnh sửa', onPress: () => navigation.navigate('Add', { editTx: item }) },
                    { text: 'Xoá', onPress: () => {
                        Alert.alert('Xác nhận', 'Bạn chắc chắn muốn xoá giao dịch này?', [
                          { text: 'Hủy', style: 'cancel' },
                          { text: 'Xoá', style: 'destructive', onPress: () => {
                             deleteTransaction(item.id);
                          }}
                        ])
                      }, style: 'destructive' 
                    }
                  ]);
                }}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.type === 'income' ? 'rgba(72,187,120,0.1)' : 'rgba(245,101,101,0.1)' }]}>
                  {getIconForType(item.type, item.type === 'income' ? PremiumColors.income : PremiumColors.expense)}
                </View>
                <View style={styles.txDetailsWrapper}>
                  <Text style={styles.txTitle}>{item.title}</Text>
                  <Text style={styles.txDesc}>{item.category} • {formatDate(item.date)}</Text>
                </View>
                <Text style={[styles.txAmount, { color: item.type === 'income' ? PremiumColors.income : PremiumColors.expense }]}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PremiumColors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  greeting: {
    color: PremiumColors.textSub,
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    color: PremiumColors.textMain,
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  avatarContainer: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: '#fff',
    elevation: 8,
    shadowColor: '#FFF',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 12,
    shadowColor: '#b21f1f',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 12,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 34,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  incomeAmount: { color: '#E6FFFA', fontSize: 15, fontWeight: '700' },
  expenseAmount: { color: '#FFF5F5', fontSize: 15, fontWeight: '700' },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },
  
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  actionBtn: { alignItems: 'center', gap: 10 },
  actionIconContainer: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: PremiumColors.surface,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  actionText: { color: PremiumColors.textSub, fontSize: 13, fontWeight: '600' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  sectionTitle: { color: PremiumColors.textMain, fontSize: 20, fontWeight: '800' },
  seeAll: { color: PremiumColors.accent, fontSize: 14, fontWeight: '700' },

  listCard: {
    backgroundColor: PremiumColors.surface,
    borderRadius: 24,
    padding: 16,
    elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  listItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  iconCircle: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetailsWrapper: { flex: 1, justifyContent: 'center' },
  txTitle: { color: PremiumColors.textMain, fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  txDesc: { color: PremiumColors.textSub, fontSize: 13 },
  txAmount: { fontSize: 17, fontFamily: 'Inter_800ExtraBold' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: PremiumColors.textSub, textAlign: 'center', fontSize: 15 },
});
