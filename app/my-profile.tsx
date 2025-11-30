import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Customer, City } from '@/types';
import Colors from '@/constants/colors';
import { handleButtonPress, createBackAction, createCustomAction } from '@/lib/navigation-handler';

const CITIES: City[] = [
  'Calgary',
  'Edmonton',
  'Red Deer',
  'Lethbridge',
  'Medicine Hat',
  'Grande Prairie',
  'Airdrie',
  'Spruce Grove',
  'Leduc',
  'Fort McMurray',
];

export default function MyProfileScreen() {
  const { myCustomerProfile, updateCustomerProfile, userRole } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState<City | null>(null);
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (myCustomerProfile) {
      setName(myCustomerProfile.name || '');
      setEmail(myCustomerProfile.email || '');
      setPhone(myCustomerProfile.phone || '');
      setCity(myCustomerProfile.city || null);
      setRegion(myCustomerProfile.region || '');
      setAddress(myCustomerProfile.address || '');
    }
  }, [myCustomerProfile]);

  const handleSave = () => {
    if (!name || !email || !phone || !city) {
      Alert.alert('Missing Information', 'Please fill in all required fields: name, email, phone, and city');
      return;
    }

    const profile: Customer = {
      id: myCustomerProfile?.id || `customer-${Date.now()}`,
      name,
      email,
      phone,
      city,
      region: region || undefined,
      address: address || undefined,
    };

    updateCustomerProfile(profile);
    Alert.alert('Success', 'Your profile has been updated!');
  };

  if (userRole === 'trader') {
    router.replace('/(trader)/profile');
    return null;
  }

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
              action: createBackAction(),
              label: 'Back',
            })} 
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity 
            onPress={handleButtonPress({
              action: createCustomAction(handleSave),
              label: 'Save',
            })} 
            style={styles.saveButton}
          >
            <Save size={20} color={Colors.deepBlue} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="(403) 555-0123"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>City *</Text>
            <View style={styles.communityGrid}>
              {CITIES.map((cityOption) => (
                <TouchableOpacity
                  key={cityOption}
                  style={[styles.communityItem, city === cityOption && styles.communityItemActive]}
                  onPress={() => setCity(cityOption)}
                >
                  <Text style={[styles.communityItemText, city === cityOption && styles.communityItemTextActive]}>
                    {cityOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Region / Neighborhood (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Downtown, North Hill"
              value={region}
              onChangeText={setRegion}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Address (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Your street address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleButtonPress({
              action: createCustomAction(handleSave),
              label: 'Save Profile',
            })}
          >
            <Text style={styles.submitButtonText}>Save Profile</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  saveButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  communityItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.offWhite,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  communityItemActive: {
    backgroundColor: Colors.deepBlue,
  },
  communityItemText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  communityItemTextActive: {
    color: Colors.white,
  },
  submitButton: {
    backgroundColor: Colors.deepBlue,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
