import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, SegmentedButtons, Title, Card, Text } from 'react-native-paper';
import { useTransactions, TransactionType } from '../context/TransactionContext';
import { Colors } from '../constants/Colors';

export const AddTransactionScreen = ({ navigation }: any) => {
  const { addTransaction } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!title || !amount || !category) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    addTransaction({
      title,
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString(),
    });

    // Reset and navigate
    setTitle('');
    setAmount('');
    setCategory('');
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Thêm giao dịch mới</Title>
          
          <SegmentedButtons
            value={type}
            onValueChange={value => setType(value as TransactionType)}
            buttons={[
              { value: 'expense', label: 'Chi tiêu', checkedColor: Colors.expense },
              { value: 'income', label: 'Thu nhập', checkedColor: Colors.income },
            ]}
            style={styles.segmentedButtons}
          />

          <TextInput
            label="Tiêu đề"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Ví dụ: Ăn trưa, Lương..."
          />

          <TextInput
            label="Số tiền"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            left={<TextInput.Affix text="₫" />}
          />

          <TextInput
            label="Danh mục"
            value={category}
            onChangeText={setCategory}
            mode="outlined"
            style={styles.input}
            placeholder="Ví dụ: Ăn uống, Giải trí..."
          />

          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.button}
            buttonColor={type === 'income' ? Colors.income : Colors.expense}
          >
            Lưu giao dịch
          </Button>
        </Card.Content>
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
    padding: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: Colors.white,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
