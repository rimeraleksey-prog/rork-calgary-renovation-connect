import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Briefcase, ArrowLeft } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

import { handleButtonPress, createBackAction, createNavigateAction } from '@/lib/navigation-handler';

export default function LoginScreen() {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'trader' | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select whether you are a Customer or Professional');
      return;
    }

    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      console.log('Logging in as:', selectedRole, 'with email:', email);
      
      await login(email, password, selectedRole);
      
      if (selectedRole === 'customer') {
        router.replace('/(customer-tabs)/home');
      } else {
        router.replace('/(trader-tabs)/dashboard');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            style={styles.scrollView} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleButtonPress({ action: createBackAction(), label: 'Back' })}
            >
              <ArrowLeft size={24} color={Colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Log in to your account</Text>
            </View>

            <View style={styles.roleSelection}>
              <Text style={styles.roleLabel}>I am a:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    selectedRole === 'customer' && styles.roleButtonActive,
                  ]}
                  onPress={() => setSelectedRole('customer')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.roleIconSmall,
                    { backgroundColor: selectedRole === 'customer' ? '#FF6B35' : Colors.offWhite }
                  ]}>
                    <User 
                      size={20} 
                      color={selectedRole === 'customer' ? Colors.white : Colors.textSecondary} 
                      strokeWidth={2.5} 
                    />
                  </View>
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'customer' && styles.roleButtonTextActive,
                  ]}>
                    Customer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    selectedRole === 'trader' && styles.roleButtonActive,
                  ]}
                  onPress={() => setSelectedRole('trader')}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.roleIconSmall,
                    { backgroundColor: selectedRole === 'trader' ? '#1E3A5F' : Colors.offWhite }
                  ]}>
                    <Briefcase 
                      size={20} 
                      color={selectedRole === 'trader' ? Colors.white : Colors.textSecondary} 
                      strokeWidth={2.5} 
                    />
                  </View>
                  <Text style={[
                    styles.roleButtonText,
                    selectedRole === 'trader' && styles.roleButtonTextActive,
                  ]}>
                    Professional
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  (!selectedRole || !email || !password || loading) && styles.loginButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={!selectedRole || !email || !password || loading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={handleButtonPress({ action: createNavigateAction('/signup'), label: 'Create New Account' })}
                activeOpacity={0.8}
              >
                <Text style={styles.signupButtonText}>Create New Account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  roleSelection: {
    marginBottom: 32,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  roleButtonActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF7F3',
  },
  roleIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  roleButtonTextActive: {
    color: Colors.textPrimary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  input: {
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  loginButton: {
    height: 52,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowOpacity: 0,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
  },
  signupButton: {
    height: 52,
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  signupButtonText: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
});
