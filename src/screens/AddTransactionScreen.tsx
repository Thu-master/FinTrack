import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactions, TransactionType, Category } from '../context/TransactionContext';

const PremiumColors = {
  bg: '#0A0A0A',
  surface: '#1A1D21',
  textMain: '#FFFFFF',
  textSub: '#A0AEC0',
  income: '#48BB78',
  expense: '#F56565',
  border: 'rgba(255,255,255,0.1)',
};

export const AddTransactionScreen = ({ route, navigation }: any) => {
  const { addTransaction, updateTransaction, categories } = useTransactions();
  const editTx = route.params?.editTx;

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState('');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Load old data if editing
  useEffect(() => {
    if (editTx) {
      setTitle(editTx.title);
      setAmount(editTx.amount.toString());
      setType(editTx.type);
      setCategory(editTx.category);
      setDateStr(editTx.date.split('T')[0]);
    } else {
      // Reset form
      setTitle('');
      setAmount('');
      setType('expense');
      setCategory('');
      setDateStr(new Date().toISOString().split('T')[0]);
    }
  }, [editTx]);

  const handleSave = () => {
    if (!title || !amount || !category || !dateStr) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (editTx) {
      updateTransaction(editTx.id, {
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(dateStr).toISOString()
      });
      // Clear params so it doesn't stay in edit mode
      navigation.setParams({ editTx: null });
    } else {
      addTransaction({
        title,
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(dateStr).toISOString()
      });
    }

    setTitle('');
    setAmount('');
    setCategory('');
    navigation.navigate('Home');
  };

  const isIncome = type === 'income';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
          <Text style={styles.title}>{editTx ? 'Sửa giao dịch' : 'Thêm giao dịch'}</Text>
          <Text style={styles.subtitle}>Ghi chép lại các hoạt động tài chính.</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, type === 'expense' && styles.tabExpenseActive]} 
            onPress={() => setType('expense')}
          >
            <Text style={[styles.tabText, type === 'expense' && { color: '#FFF' }]}>Chi tiêu</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, type === 'income' && styles.tabIncomeActive]} 
            onPress={() => setType('income')}
          >
            <Text style={[styles.tabText, type === 'income' && { color: '#FFF' }]}>Thu nhập</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(300)} style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Tiêu đề giao dịch</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="VD: Cà phê, Lương tháng 4..."
              placeholderTextColor={PremiumColors.textSub}
              style={styles.textInput}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={PremiumColors.textMain}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Số tiền (VNĐ)</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={PremiumColors.textSub}
              style={[styles.textInput, styles.amountInput, { color: isIncome ? PremiumColors.income : PremiumColors.expense }]}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={isIncome ? PremiumColors.income : PremiumColors.expense}
            />
          </View>

          {/* UI for DatePicker */}
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Ngày Giao Dịch {Platform.OS === 'web' && '(YYYY-MM-DD)'}</Text>
            {Platform.OS === 'web' ? (
              <TextInput
                value={dateStr}
                onChangeText={(text) => {
                  setDateStr(text);
                  const parsed = new Date(text);
                  if (!isNaN(parsed.getTime())) {
                     setDate(parsed);
                  }
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={PremiumColors.textSub}
                style={styles.textInput}
                underlineColor="transparent"
                activeUnderlineColor="transparent"
                textColor={PremiumColors.textMain}
              />
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.textInput, { justifyContent: 'center', paddingHorizontal: 16 }]} 
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: PremiumColors.textMain, fontSize: 16, fontFamily: 'Inter_500Medium' }}>
                    {date.toLocaleDateString('vi-VN')}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event: any, selectedDate?: Date) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                        setDateStr(selectedDate.toISOString().split('T')[0]);
                      }
                    }}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.inputWrapper}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
              <Text style={[styles.inputLabel, {marginBottom: 0}]}>Danh mục</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CategoryManager')}>
                <Text style={{color: AppColors.primary, fontSize: 13, fontWeight: 'bold'}}>+ Quản lý danh mục</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={category}
              onChangeText={setCategory}
              placeholder="VD: Ăn uống, Giải trí..."
              placeholderTextColor={PremiumColors.textSub}
              style={styles.textInput}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={PremiumColors.textMain}
            />
          </View>

          {categories && categories.length > 0 && (
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16}}>
               {categories.map((cat, i) => (
                 <TouchableOpacity key={cat.id || i} onPress={() => setCategory(cat.name)} style={{
                   backgroundColor: cat.name === category ? AppColors.primary : PremiumColors.surface,
                   paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: cat.color || PremiumColors.border
                 }}>
                   <Text style={{color: '#FFF'}}>{cat.icon} {cat.name}</Text>
                 </TouchableOpacity>
               ))}
            </View>
          )}

        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(400)}>
          <TouchableOpacity onPress={handleSave} style={styles.touchableSave}>
            <View style={[styles.saveButton, { backgroundColor: isIncome ? PremiumColors.income : PremiumColors.expense }]}>
              <Text style={styles.saveButtonText}>{editTx ? 'Cập nhật' : 'Lưu giao dịch'}</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
};

// ... remaining styles remain very similar except taking into account imports. We need Colors from AppColors inside JSX! We should add it above -> Colors as AppColors is not imported properly if I am not careful! Wait! Let me make sure AppColors is correctly defined!
import { Colors as AppColors } from '../constants/Colors';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumColors.bg },
  scrollContent: { paddingHorizontal: 24, paddingTop: 40, paddingBottom: 80 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontFamily: 'Inter_900Black', color: PremiumColors.textMain, marginBottom: 8 },
  subtitle: { fontSize: 16, color: PremiumColors.textSub },
  
  tabContainer: { flexDirection: 'row', backgroundColor: PremiumColors.surface, borderRadius: 16, padding: 4, marginBottom: 32 },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 12 },
  tabExpenseActive: { backgroundColor: PremiumColors.expense, shadowColor: PremiumColors.expense, elevation: 6, shadowOpacity: 0.4, shadowRadius: 8 },
  tabIncomeActive: { backgroundColor: PremiumColors.income, shadowColor: PremiumColors.income, elevation: 6, shadowOpacity: 0.4, shadowRadius: 8 },
  tabText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: PremiumColors.textSub },

  formContainer: { backgroundColor: PremiumColors.surface, borderRadius: 24, padding: 24, marginBottom: 32, elevation: 4, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10 },
  inputWrapper: { marginBottom: 24 },
  inputLabel: { color: PremiumColors.textSub, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Inter_800ExtraBold', marginBottom: 12 },
  textInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 56, fontSize: 16 },
  amountInput: { fontSize: 24, fontFamily: 'Inter_700Bold' },

  touchableSave: { width: '100%', borderRadius: 16, elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  saveButton: { width: '100%', height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { color: '#FFF', fontSize: 18, fontFamily: 'Inter_800ExtraBold', letterSpacing: 0.5 },
});
