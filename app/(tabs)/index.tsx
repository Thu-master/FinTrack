import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Avatar, FAB, useTheme } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const { width } = Dimensions.get('window');

const recentTransactions = [
  { id: '1', title: 'Starbucks Coffee', amount: -65000, type: 'expense', icon: 'cup.and.saucer.fill', date: '08:30 AM', color: '#ff6b6b' },
  { id: '2', title: 'Lương Tháng 4', amount: 18500000, type: 'income', icon: 'briefcase.fill', date: 'Hôm qua', color: '#20c997' },
  { id: '3', title: 'GrabBike', amount: -42000, type: 'expense', icon: 'car.fill', date: 'Hôm qua', color: '#4dabf7' },
  { id: '4', title: 'Shopee Mall', amount: -1250000, type: 'expense', icon: 'bag.fill', date: '05/04', color: '#fcc419' },
];

export default function PremiumHomeScreen() {
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bgColor = isDark ? '#0A0A0A' : '#F7F9FC';
  const surfaceColor = isDark ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDark ? '#8E8E93' : '#8E8E93';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: subTextColor }]}>Chào buổi sáng,</Text>
            <Text style={[styles.userName, { color: textColor }]}>Nguyễn Văn A</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
          </View>
        </Animated.View>

        {/* Premium Balance Card */}
        <Animated.View entering={FadeInUp.duration(600).delay(200)}>
          <View style={[styles.balanceCard, { backgroundColor: '#2E7D32' }]}>
            <View style={styles.cardGlow} />
            <Text style={styles.cardLabel}>TỔNG SỐ DƯ (VND)</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(24500000)}</Text>
            
            <View style={styles.cardFooter}>
              <View style={styles.cardStat}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <IconSymbol name="arrow.down.left" size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Thu nhập</Text>
                  <Text style={styles.statValue}>+18.5M</Text>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.cardStat}>
                <View style={[styles.statIconBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                  <IconSymbol name="arrow.up.right" size={16} color="#fff" />
                </View>
                <View>
                  <Text style={styles.statLabel}>Chi tiêu</Text>
                  <Text style={styles.statValue}>-3.2M</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.duration(600).delay(400)} style={styles.actionRow}>
          {['Gửi tiền', 'Nhận tiền', 'Thống kê', 'Tiện ích'].map((item, index) => {
            const icons = ['paperplane.fill', 'arrow.down.circle.fill', 'chart.bar.fill', 'square.grid.2x2.fill'];
            return (
              <TouchableOpacity key={index} style={styles.actionBtn}>
                <View style={[styles.actionIconContainer, { backgroundColor: surfaceColor }]}>
                  <IconSymbol name={icons[index] as any} size={24} color={isDark ? '#4dabf7' : '#4158D0'} />
                </View>
                <Text style={[styles.actionText, { color: textColor }]}>{item}</Text>
              </TouchableOpacity>
            )
          })}
        </Animated.View>

        {/* Recent Transactions */}
        <Animated.View entering={FadeInUp.duration(600).delay(500)} style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Giao dịch gần đây</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(600)} style={[styles.transactionsContainer, { backgroundColor: surfaceColor }]}>
          {recentTransactions.map((tx, index) => (
            <TouchableOpacity key={tx.id} style={[styles.txItem, index !== recentTransactions.length - 1 && { borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#F0F0F0' }]}>
              <View style={[styles.txIconBg, { backgroundColor: `${tx.color}20` }]}>
                {/* Note: IconSymbol defaults from react-native-paper/expo symbols */}
                <IconSymbol name={tx.icon as any} size={20} color={tx.color} />
              </View>
              <View style={styles.txDetails}>
                <Text style={[styles.txTitle, { color: textColor }]}>{tx.title}</Text>
                <Text style={[styles.txDate, { color: subTextColor }]}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === 'expense' ? textColor : '#20c997' }]}>
                {tx.type === 'expense' ? '' : '+'}{formatCurrency(tx.amount)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
        <View style={{height: 40}}/>
      </ScrollView>

      {/* Floating Modern Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: isDark ? '#4dabf7' : '#4158D0' }]}
        color="#fff"
        onPress={() => console.log('Opens Add Transaction')}
      />
    </View>
  );
}

// Temporary Image import fallback
import { Image } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  greeting: { fontSize: 15, fontWeight: '500', marginBottom: 4 },
  userName: { fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
  avatarContainer: {
    padding: 3,
    borderRadius: 30,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#4158D0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600', letterSpacing: 1, marginBottom: 8 },
  balanceAmount: { color: '#fff', fontSize: 36, fontWeight: '900', letterSpacing: 1, marginBottom: 24 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIconBadge: { width: 32, height: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 2 },
  statValue: { color: '#fff', fontSize: 15, fontWeight: '700' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.2)' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionIconContainer: {
    width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  actionText: { fontSize: 12, fontWeight: '600' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  seeAll: { color: '#4dabf7', fontSize: 14, fontWeight: '600' },
  transactionsContainer: {
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  txItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  txIconBg: { width: 44, height: 44, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  txDetails: { flex: 1, gap: 4 },
  txTitle: { fontSize: 16, fontWeight: '700' },
  txDate: { fontSize: 13, fontWeight: '500' },
  txAmount: { fontSize: 16, fontWeight: '800' },
  fab: { position: 'absolute', margin: 20, right: 0, bottom: 0, borderRadius: 30, width: 60, height: 60, alignItems: 'center', justifyContent: 'center', shadowColor: '#4158D0', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
});
