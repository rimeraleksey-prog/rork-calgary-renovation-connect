import { StyleSheet, Text, View, TouchableOpacity, Platform, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Save, Crown, Zap, Star, Settings } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { TradeCategory, ExperienceLevel, PriceRating, City, Trader } from '@/types';
import Colors from '@/constants/colors';

const TRADE_CATEGORIES: TradeCategory[] = [
  'General Contractor',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Painter',
  'Roofer',
  'HVAC',
  'Flooring',
  'Landscaping',
  'Kitchen & Bath',
];

const EXPERIENCE_LEVELS: ExperienceLevel[] = ['Entry', 'Intermediate', 'Expert'];
const PRICE_RATINGS: PriceRating[] = ['$', '$$', '$$$'];
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

export default function ProfileScreen() {
  const { myTraderProfile, updateTraderProfile } = useApp();
  const { currentPlan } = useSubscription();

  const tier = myTraderProfile?.subscriptionTier || 'basic';

  const [businessName, setBusinessName] = useState(myTraderProfile?.businessName || '');
  const [ownerName, setOwnerName] = useState(myTraderProfile?.ownerName || '');
  const [category, setCategory] = useState<TradeCategory>(myTraderProfile?.category || 'General Contractor');
  const [experience, setExperience] = useState<ExperienceLevel>(myTraderProfile?.experience || 'Intermediate');
  const [priceRating, setPriceRating] = useState<PriceRating>(myTraderProfile?.priceRating || '$$');
  const [serviceCities, setServiceCities] = useState<City[]>(myTraderProfile?.serviceCities || []);
  const [serviceRegions, setServiceRegions] = useState(myTraderProfile?.serviceRegions || '');
  const [description, setDescription] = useState(myTraderProfile?.description || '');
  const [phone, setPhone] = useState(myTraderProfile?.phone || '');
  const [email, setEmail] = useState(myTraderProfile?.email || '');
  const [yearsInBusiness, setYearsInBusiness] = useState(myTraderProfile?.yearsInBusiness?.toString() || '');

  const toggleServiceCity = (city: City) => {
    setServiceCities((prev) => 
      prev.includes(city)
        ? prev.filter((c) => c !== city)
        : [...prev, city]
    );
  };

  const handleSave = () => {
    if (!businessName || !ownerName || !description || !phone || !email || !yearsInBusiness || serviceCities.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields including at least one service city');
      return;
    }

    const profile: Trader = {
      id: myTraderProfile?.id || `trader-${Date.now()}`,
      businessName,
      ownerName,
      category,
      serviceAreas: [],
      serviceCities,
      serviceRegions: serviceRegions || undefined,
      experience,
      certifications: myTraderProfile?.certifications || [],
      insured: myTraderProfile?.insured || true,
      portfolioImages: myTraderProfile?.portfolioImages || [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      ],
      description,
      priceRating,
      rating: myTraderProfile?.rating || 5.0,
      reviewCount: myTraderProfile?.reviewCount || 0,
      verified: myTraderProfile?.verified || false,
      yearsInBusiness: parseInt(yearsInBusiness),
      phone,
      email,
    };

    updateTraderProfile(profile);
    Alert.alert('Success', 'Your profile has been updated!');
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Save size={20} color={Colors.deepBlue} />
          </TouchableOpacity>
        </View>

        <View style={styles.subscriptionBanner}>
          <View style={styles.subscriptionBannerContent}>
            <View style={styles.subscriptionBannerIcon}>
              {currentPlan?.id === 'elite' ? (
                <Crown size={24} color="#FFD700" />
              ) : currentPlan?.id === 'pro' ? (
                <Zap size={24} color="#FF6B35" />
              ) : (
                <Star size={24} color={Colors.deepBlue} />
              )}
            </View>
            <View style={styles.subscriptionBannerInfo}>
              <Text style={styles.subscriptionBannerTitle}>{currentPlan?.name} Plan</Text>
              <Text style={styles.subscriptionBannerSubtitle}>
                {tier === 'basic' 
                  ? `Job responses: ${myTraderProfile?.job_responses_count || 0} / 3`
                  : 'Unlimited job responses'
                }
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.subscriptionBannerButton}
            onPress={() => router.push('/(trader)/subscription-dashboard' as any)}
          >
            <Settings size={20} color={Colors.deepBlue} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Business Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your business name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Owner Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Your full name"
              value={ownerName}
              onChangeText={setOwnerName}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Trade Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {TRADE_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, category === cat && styles.chipActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Experience Level *</Text>
            <View style={styles.row}>
              {EXPERIENCE_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[styles.rowButton, experience === level && styles.rowButtonActive]}
                  onPress={() => setExperience(level)}
                >
                  <Text style={[styles.rowButtonText, experience === level && styles.rowButtonTextActive]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Price Rating *</Text>
            <View style={styles.row}>
              {PRICE_RATINGS.map((rating) => (
                <TouchableOpacity
                  key={rating}
                  style={[styles.rowButton, priceRating === rating && styles.rowButtonActive]}
                  onPress={() => setPriceRating(rating)}
                >
                  <Text style={[styles.rowButtonText, priceRating === rating && styles.rowButtonTextActive]}>
                    {rating}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Service Cities * (Select all that apply)</Text>
            <View style={styles.communityGrid}>
              {CITIES.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={[styles.communityItem, serviceCities.includes(city) && styles.communityItemActive]}
                  onPress={() => toggleServiceCity(city)}
                >
                  <Text style={[styles.communityItemText, serviceCities.includes(city) && styles.communityItemTextActive]}>
                    {city}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Regions / Neighborhoods (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., NW Calgary, South Edmonton"
              value={serviceRegions}
              onChangeText={setServiceRegions}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Years in Business *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 10"
              value={yearsInBusiness}
              onChangeText={setYearsInBusiness}
              keyboardType="numeric"
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tell customers about your business..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
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

          <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
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
  subscriptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      } as any,
    }),
  },
  subscriptionBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subscriptionBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subscriptionBannerInfo: {
    flex: 1,
  },
  subscriptionBannerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subscriptionBannerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  subscriptionBannerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
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
  textArea: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    height: 100,
  },
  chipScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: Colors.deepBlue,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowButton: {
    flex: 1,
    backgroundColor: Colors.offWhite,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  rowButtonActive: {
    backgroundColor: Colors.deepBlue,
  },
  rowButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  rowButtonTextActive: {
    color: Colors.white,
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
    ...Platform.select({
      ios: {
        shadowColor: Colors.deepBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
      } as any,
    }),
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
