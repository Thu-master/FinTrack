import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInDown, FadeInUp, useSharedValue, withRepeat, withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { Colors as AppColors } from '../constants/Colors';
import { ArrowRight, ArrowLeft } from 'lucide-react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

const { width, height } = Dimensions.get('window');

export const RegisterScreen = ({ navigation }: any) => {

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: withRepeat(withTiming(0.7, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true),
      transform: [{ scale: withRepeat(withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }), -1, true) }]
    };
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Giống như login, sau khi sign up thành công thì state firebase Auth sẽ thay đổi và AppNavigator sẽ tự động navigate sang Main
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      let errMsg = "Đăng ký thất bại. Vui lòng thử lại.";
      if (error.code === 'auth/email-already-in-use') errMsg = "Email này đã được sử dụng.";
      if (error.code === 'auth/weak-password') errMsg = "Mật khẩu quá yếu, cần ít nhất 6 ký tự.";
      if (error.code === 'auth/invalid-email') errMsg = "Email không hợp lệ.";
      Alert.alert("Lỗi", errMsg);
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        {/* Background gradients */}
        <Animated.View style={[styles.backgroundGlow1, glowStyle]} />
        <Animated.View style={[styles.backgroundGlow2, glowStyle]} />
        
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ArrowLeft color="#FFFFFF" size={24} />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(800).delay(200)} style={styles.logoContainer}>
            <Text style={styles.title}>Tạo Tài Khoản</Text>
            <Text style={styles.subtitle}>Bắt đầu hành trình quản lý tài chính thông minh của bạn.</Text>
          </Animated.View>
          
          <Animated.View entering={FadeInUp.duration(800).delay(400)} style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                placeholderTextColor="#A0AEC0"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(800).delay(600)} style={styles.actionContainer}>
            <TouchableOpacity onPress={handleRegister} style={styles.touchableArea} disabled={loading}>
              <View style={[styles.buttonGradient, { backgroundColor: AppColors.primary }]}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Đăng Ký</Text>
                    <View style={styles.arrowIcon}>
                      <ArrowRight size={20} color="#0A0A0A" />
                    </View>
                  </>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.footerLink}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundGlow1: {
    position: 'absolute', top: -100, left: -50, width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(142, 45, 226, 0.4)', filter: 'blur(50px)' as any,
  },
  backgroundGlow2: {
    position: 'absolute', bottom: -100, right: -50, width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(74, 0, 224, 0.3)', filter: 'blur(50px)' as any,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'flex-start'
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 50,
  },
  content: {
    flex: 1, padding: 32, justifyContent: 'space-evenly', minHeight: height * 0.8,
  },
  logoContainer: { alignItems: 'flex-start', marginTop: 10 },
  title: { fontSize: 36, fontFamily: 'Inter_900Black', color: '#FFFFFF', letterSpacing: 0.5, marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#A0AEC0', lineHeight: 24 },
  
  formContainer: { width: '100%', marginTop: 24 },
  inputWrapper: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  actionContainer: { alignItems: 'center', marginTop: 10 },
  touchableArea: { width: '100%', borderRadius: 20 },
  buttonGradient: {
    width: '100%', height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter_700Bold', letterSpacing: 0.5, flex: 1, textAlign: 'center', paddingLeft: 40 },
  arrowIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  
  footerContainer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: '#A0AEC0',
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  footerLink: {
    color: AppColors.primary,
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  }
});
