import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Phone, Mail, MapPin, Star, BadgeCheck, Shield, ArrowLeft, Crown } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function ContractorDetailScreen() {
  const { id } = useLocalSearchParams();
  const { traders, favoriteTraders, toggleFavorite } = useApp();
  
  const trader = traders.find((t) => t.id === id);

  if (!trader) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Contractor not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            <Image
              source={{ uri: trader.portfolioImages[0] }}
              style={styles.heroImage}
              contentFit="cover"
            />
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.headerSection}>
              <View>
                <Text style={styles.businessName}>{trader.businessName}</Text>
                <Text style={styles.category}>{trader.category}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star size={24} color={Colors.orange} fill={Colors.orange} />
                <Text style={styles.rating}>{trader.rating}</Text>
              </View>
            </View>

            <View style={styles.badges}>
              {trader.subscriptionTier === 'elite' && (
                <View style={[styles.badge, styles.eliteBadge]}>
                  <Crown size={16} color="#FFD700" />
                  <Text style={styles.eliteBadgeText}>Elite Pro</Text>
                </View>
              )}
              {trader.verified && (
                <View style={styles.badge}>
                  <BadgeCheck size={16} color={Colors.deepBlue} />
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              )}
              {trader.insured && (
                <View style={styles.badge}>
                  <Shield size={16} color={Colors.success} />
                  <Text style={styles.badgeText}>Insured</Text>
                </View>
              )}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{trader.yearsInBusiness} years</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{trader.priceRating}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{trader.description}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Areas</Text>
              <View style={styles.serviceAreas}>
                {trader.serviceAreas.map((area) => (
                  <View key={area} style={styles.serviceArea}>
                    <MapPin size={16} color={Colors.deepBlue} />
                    <Text style={styles.serviceAreaText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {trader.certifications.map((cert, index) => (
                <View key={index} style={styles.certItem}>
                  <Text style={styles.certBullet}>•</Text>
                  <Text style={styles.certText}>{cert}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Portfolio</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.portfolio}
              >
                {trader.portfolioImages.map((image, index) => (
                  <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.portfolioImage}
                    contentFit="cover"
                  />
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact</Text>
              <TouchableOpacity style={styles.contactItem}>
                <Phone size={20} color={Colors.deepBlue} />
                <Text style={styles.contactText}>{trader.phone}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactItem}>
                <Mail size={20} color={Colors.deepBlue} />
                <Text style={styles.contactText}>{trader.email}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(trader.id)}
          >
            <Text style={styles.favoriteBtnText}>
              {favoriteTraders.includes(trader.id) ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.requestQuoteButton}>
            <Text style={styles.requestQuoteButtonText}>Request Quote</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: Colors.deepBlue,
    fontWeight: '600' as const,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  eliteBadge: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  eliteBadgeText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#FFD700',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  serviceAreas: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  serviceAreaText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500' as const,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  certBullet: {
    fontSize: 18,
    color: Colors.deepBlue,
    fontWeight: '700' as const,
  },
  certText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  portfolio: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  portfolioImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginRight: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  contactText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  favoriteBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoriteBtnText: {
    fontSize: 24,
    color: Colors.orange,
  },
  requestQuoteButton: {
    flex: 1,
    backgroundColor: Colors.orange,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
      } as any,
    }),
  },
  requestQuoteButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
});
