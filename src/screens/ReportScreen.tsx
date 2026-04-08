import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Title, Card, Text, List, Surface } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../context/TransactionContext';
import { Colors } from '../constants/Colors';
import { formatCurrency } from '../utils/formatters';

const screenWidth = Dimensions.get('window').width;

export const ReportScreen = () => {
  const { transactions } = useTransactions();

  // Filter only expenses
  const expenses = transactions.filter(t => t.type === 'expense');

  // Group by category
  const categoryData = expenses.reduce((acc: any, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {});

  // Convert to chart format
  const chartData = Object.keys(categoryData).map((key, index) => ({
    name: key,
    population: categoryData[key],
    color: Colors.chartColors[index % Colors.chartColors.length],
    legendFontColor: Colors.text,
    legendFontSize: 12,
  }));

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Phân bổ chi tiêu</Title>
          
          {chartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={chartData}
                width={screenWidth - 64}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[10, 0]}
                absolute
              />
            </View>
          ) : (
            <Text style={styles.emptyText}>Chưa có dữ liệu chi tiêu để hiển thị biểu đồ.</Text>
          )}
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Chi tiết theo danh mục</Title>
      <Card style={styles.listCard}>
        {chartData.map((item, index) => (
          <List.Item
            key={index}
            title={item.name}
            right={() => <Text style={styles.categoryAmount}>{formatCurrency(item.population)}</Text>}
            left={() => <View style={[styles.colorIndicator, { backgroundColor: item.color }]} />}
            style={styles.listItem}
          />
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  card: {
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignSelf: 'center',
    marginLeft: 8,
  },
  categoryAmount: {
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  emptyText: {
    textAlign: 'center',
    padding: 40,
    color: Colors.textSecondary,
  },
});
