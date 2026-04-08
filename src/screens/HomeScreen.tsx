import React from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Card, Text, Title, Paragraph, List, IconButton } from 'react-native-paper';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Colors } from '../constants/Colors';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react-native';

export const HomeScreen = () => {
  const { transactions, totalBalance, totalIncome, totalExpense } = useTransactions();

  // Get last 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const renderTransactionItem = ({ item }: { item: any }) => (
    <List.Item
      title={item.title}
      description={`${item.category} • ${formatDate(item.date)}`}
      left={props => (
        <View style={styles.iconCircle}>
          {item.type === 'income' ? (
            <TrendingUp color={Colors.income} size={20} />
          ) : (
            <TrendingDown color={Colors.expense} size={20} />
          )}
        </View>
      )}
      right={props => (
        <Text style={[
          styles.amount,
          { color: item.type === 'income' ? Colors.income : Colors.expense }
        ]}>
          {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
        </Text>
      )}
      style={styles.listItem}
    />
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance Card */}
        <Card style={styles.balanceCard}>
          <Card.Content>
            <Text style={styles.balanceLabel}>Tổng số dư</Text>
            <Title style={styles.balanceAmount}>{formatCurrency(totalBalance)}</Title>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <TrendingUp color={Colors.income} size={16} />
                  <Text style={styles.statLabel}>Thu nhập</Text>
                </View>
                <Text style={styles.incomeAmount}>{formatCurrency(totalIncome)}</Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.statItem}>
                <View style={styles.statHeader}>
                  <TrendingDown color={Colors.expense} size={16} />
                  <Text style={styles.statLabel}>Chi tiêu</Text>
                </View>
                <Text style={styles.expenseAmount}>{formatCurrency(totalExpense)}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Transactions Section */}
        <View style={styles.sectionHeader}>
          <Title style={styles.sectionTitle}>Giao dịch gần đây</Title>
          <IconButton icon={() => <ArrowRight size={20} color={Colors.primary} />} onPress={() => {}} />
        </View>

        <Card style={styles.listCard}>
          {recentTransactions.map((item) => (
            <React.Fragment key={item.id}>
              {renderTransactionItem({ item })}
            </React.Fragment>
          ))}
          {recentTransactions.length === 0 && (
            <Paragraph style={styles.emptyText}>Chưa có giao dịch nào.</Paragraph>
          )}
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  balanceCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    marginBottom: 24,
    elevation: 4,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  statItem: {
    flex: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginLeft: 4,
  },
  incomeAmount: {
    color: '#A5D6A7',
    fontWeight: '600',
    fontSize: 16,
  },
  expenseAmount: {
    color: '#EF9A9A',
    fontWeight: '600',
    fontSize: 16,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: Colors.textSecondary,
  },
});
