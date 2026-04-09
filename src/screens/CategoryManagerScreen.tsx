import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTransactions } from '../context/TransactionContext';

const PremiumColors = {
  bg: '#0A0A0A',
  surface: '#1A1D21',
  textMain: '#FFFFFF',
  textSub: '#A0AEC0',
  accent: '#4FD1C5',
  border: 'rgba(255,255,255,0.1)',
};

const SUGGESTED_ICONS = ['🍔', '☕', '🚗', '🛍️', '🎬', '📚', '💊', '🏠', '🎁', '💸', '🐶', '✈️'];
const SUGGESTED_COLORS = ['#FF6B6B', '#4DABF7', '#FCC419', '#20C997', '#B19CD9', '#FF92A9'];

export const CategoryManagerScreen = ({ navigation }: any) => {
  const { categories, addCategory, deleteCategory } = useTransactions();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🍔');
  const [color, setColor] = useState('#4FD1C5');

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên danh mục');
      return;
    }
    await addCategory({ name, icon, color });
    setName('');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa danh mục này?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteCategory(id) }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#FFF" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý danh mục</Text>
        <View style={{width: 48}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.formCard}>
          <Text style={styles.sectionTitle}>Tạo danh mục mới</Text>
          
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tên danh mục mới..."
            placeholderTextColor={PremiumColors.textSub}
            style={styles.textInput}
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            textColor={PremiumColors.textMain}
          />
          
          <Text style={styles.label}>Chọn màu sắc</Text>
          <View style={styles.colorRow}>
            {SUGGESTED_COLORS.map(c => (
              <TouchableOpacity key={c} onPress={() => setColor(c)} style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.selectedRing]} />
            ))}
          </View>

          <Text style={styles.label}>Chọn Icon</Text>
          <View style={styles.iconRow}>
            {SUGGESTED_ICONS.map(i => (
              <TouchableOpacity key={i} onPress={() => setIcon(i)} style={[styles.iconCircle, icon === i && {backgroundColor: 'rgba(255,255,255,0.2)'}]}>
                <Text style={styles.iconText}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Thêm Danh Mục</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.listCard}>
          <Text style={styles.sectionTitle}>Danh mục hiện tại</Text>
          {categories.length === 0 ? (
             <Text style={styles.emptyText}>Chưa có danh mục tùy chỉnh nào.</Text>
          ) : (
             categories.map((cat, idx) => (
                <View key={cat.id || idx} style={styles.catItem}>
                   <View style={styles.catLeft}>
                     <View style={[styles.catIconWrap, { borderColor: cat.color }]}>
                        <Text style={styles.catIcon}>{cat.icon}</Text>
                     </View>
                     <Text style={styles.catName}>{cat.name}</Text>
                   </View>
                   <TouchableOpacity onPress={() => handleDelete(cat.id)}>
                     <Trash2 color="#F56565" size={20} />
                   </TouchableOpacity>
                </View>
             ))
          )}
        </Animated.View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PremiumColors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  backBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: PremiumColors.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: PremiumColors.textMain, fontSize: 20, fontFamily: 'Inter_700Bold' },
  
  content: { paddingHorizontal: 20, paddingBottom: 60 },
  formCard: { backgroundColor: PremiumColors.surface, padding: 20, borderRadius: 24, marginBottom: 24 },
  sectionTitle: { color: PremiumColors.textMain, fontSize: 18, fontFamily: 'Inter_700Bold', marginBottom: 16 },
  textInput: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 56, fontSize: 16, marginBottom: 20 },
  label: { color: PremiumColors.textSub, fontSize: 13, marginBottom: 12 },
  
  colorRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  colorCircle: { width: 32, height: 32, borderRadius: 16 },
  selectedRing: { borderWidth: 2, borderColor: '#FFF' },
  
  iconRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
  iconText: { fontSize: 20 },
  
  saveBtn: { backgroundColor: '#4FD1C5', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#000', fontSize: 16, fontFamily: 'Inter_700Bold' },
  
  listCard: { backgroundColor: PremiumColors.surface, padding: 20, borderRadius: 24 },
  emptyText: { color: PremiumColors.textSub },
  catItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: PremiumColors.border },
  catLeft: { flexDirection: 'row', alignItems: 'center' },
  catIconWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  catIcon: { fontSize: 18 },
  catName: { color: PremiumColors.textMain, fontSize: 16, fontFamily: 'Inter_500Medium' }
});
