import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Bell, Globe, Shield, LogOut } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { handleButtonPress, createBackAction, createCustomAction } from '@/lib/navigation-handler';

export default function SettingsScreen() {
  const { logout, userRole } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            console.log('Logging out...');
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={handleButtonPress({
              action: createBackAction(userRole),
              label: 'Back',
            })} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={Colors.deepBlue} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive notifications on your device</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: Colors.grayLight, true: Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Email Notifications</Text>
                <Text style={styles.settingDescription}>Receive updates via email</Text>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{ false: Colors.grayLight, true: Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>SMS Notifications</Text>
                <Text style={styles.settingDescription}>Receive text message alerts</Text>
              </View>
              <Switch
                value={smsNotifications}
                onValueChange={setSmsNotifications}
                trackColor={{ false: Colors.grayLight, true: Colors.deepBlue }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color={Colors.deepBlue} />
              <Text style={styles.sectionTitle}>Preferences</Text>
            </View>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleButtonPress({
                label: 'Language Settings',
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDescription}>English (Canada)</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleButtonPress({
                label: 'Region Settings',
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Region</Text>
                <Text style={styles.settingDescription}>Alberta, Canada</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={Colors.deepBlue} />
              <Text style={styles.sectionTitle}>Security</Text>
            </View>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleButtonPress({
                label: 'Change Password',
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your password</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.settingRow}
              onPress={handleButtonPress({
                label: 'Privacy Settings',
              })}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Privacy Settings</Text>
                <Text style={styles.settingDescription}>Manage your privacy preferences</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={handleButtonPress({
                action: createCustomAction(handleLogout),
                label: 'Log Out',
              })}
            >
              <LogOut size={20} color={Colors.orange} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.orange,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.orange,
  },
});
