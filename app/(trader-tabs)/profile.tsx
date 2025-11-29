import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Briefcase, Star, MapPin, Shield } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function ProfileScreen() {
  const { myTraderProfile, setUserRole } = useApp();

  const handleSignOut = async () => {
    await setUserRole(null);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Briefcase size={32} color={Colors.white} />
          </View>
          <Text style={styles.businessName}>
            {myTraderProfile?.businessName || 'Your Business'}
          </Text>
          <Text style={styles.category}>
            {myTraderProfile?.category || 'General Contractor'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Star size={20} color={Colors.orange} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Rating</Text>
                <Text style={styles.infoValue}>
                  {myTraderProfile?.rating || '4.8'} ({myTraderProfile?.reviewCount || '24'} reviews)
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color={Colors.deepBlue} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Service Cities</Text>
                <Text style={styles.infoValue}>
                  {myTraderProfile?.serviceCities?.join(', ') || 'Not set'}
                </Text>
              </View>
            </View>

            {myTraderProfile?.serviceRegions && (
              <View style={styles.infoRow}>
                <MapPin size={20} color={Colors.gray} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Regions</Text>
                  <Text style={styles.infoValue}>
                    {myTraderProfile.serviceRegions}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.infoRow}>
              <Shield size={20} color={Colors.deepBlue} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={styles.infoValue}>
                  {myTraderProfile?.verified ? 'Verified' : 'Not Verified'} {myTraderProfile?.insured && '• Insured'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>Portfolio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.deepBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  buttonOutline: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  buttonOutlineText: {
    color: Colors.deepBlue,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  signOutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: Colors.orange,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
