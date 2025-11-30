import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { User, Briefcase, ArrowRight, CheckCircle, Star, Shield, LogIn } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { useEffect } from 'react';

export default function WelcomeScreen() {
  const { setUserRole, isAuthenticated, userRole } = useApp();

  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 'customer') {
        router.replace('/(customer-tabs)/home');
      } else {
        router.replace('/(trader-tabs)/dashboard');
      }
    }
  }, [isAuthenticated, userRole]);

  const handleRoleSelection = (role: 'customer' | 'trader') => {
    setUserRole(role);
    if (role === 'customer') {
      router.replace('/(customer-tabs)/home');
    } else {
      router.replace('/(trader-tabs)/dashboard');
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Verified Pros',
      description: 'All contractors verified and insured',
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: 'Read reviews from real customers',
    },
    {
      icon: CheckCircle,
      title: 'Quality Guaranteed',
      description: 'Professional workmanship assured',
    },
  ];

  const services = [
    {
      name: 'Kitchen Renovation',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
      price: 'Starting from $25,000',
    },
    {
      name: 'Bathroom Remodel',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
      price: 'Starting from $10,000',
    },
    {
      name: 'Basement Finishing',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
      price: 'Starting from $50,000',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.logo}>Alberta Reno</Text>
            <Text style={styles.tagline}>Connecting Alberta homeowners with trusted renovation professionals</Text>
          </View>

          <View style={styles.heroSection}>
            <View style={styles.heroImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800' }}
                style={styles.heroImage}
                contentFit="cover"
              />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Transform Your Home</Text>
                <Text style={styles.heroSubtitle}>Connect with Alberta&apos;s best renovation pros</Text>
              </View>
            </View>
          </View>

          <View style={styles.authSection}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/login')}
              activeOpacity={0.8}
            >
              <LogIn size={20} color={Colors.white} strokeWidth={2.5} />
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.roleSelection}>
            <Text style={styles.sectionTitle}>New User? Get Started</Text>
            <View style={styles.roleCards}>
              <TouchableOpacity
                style={styles.roleCard}
                onPress={() => handleRoleSelection('customer')}
                activeOpacity={0.8}
              >
                <View style={styles.roleCardHeader}>
                  <View style={[styles.roleIcon, { backgroundColor: '#FF6B35' }]}>
                    <User size={28} color={Colors.white} strokeWidth={2.5} />
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </View>
                <Text style={styles.roleCardTitle}>I&apos;m a Homeowner</Text>
                <Text style={styles.roleCardDescription}>
                  Find pros and get quotes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.roleCard}
                onPress={() => handleRoleSelection('trader')}
                activeOpacity={0.8}
              >
                <View style={styles.roleCardHeader}>
                  <View style={[styles.roleIcon, { backgroundColor: '#1E3A5F' }]}>
                    <Briefcase size={28} color={Colors.white} strokeWidth={2.5} />
                  </View>
                  <ArrowRight size={20} color={Colors.textSecondary} />
                </View>
                <Text style={styles.roleCardTitle}>I&apos;m a Professional</Text>
                <Text style={styles.roleCardDescription}>
                  Grow your business
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Why Choose Us</Text>
            <View style={styles.features}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <View key={index} style={styles.featureCard}>
                    <View style={styles.featureIcon}>
                      <Icon size={24} color="#FF6B35" strokeWidth={2} />
                    </View>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <View style={styles.servicesVertical}>
              {services.map((service, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.serviceCard}
                  activeOpacity={0.9}
                  onPress={() => handleRoleSelection('customer')}
                >
                  <Image
                    source={{ uri: service.image }}
                    style={styles.serviceImage}
                    contentFit="cover"
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <View style={styles.servicePriceContainer}>
                      <Text style={styles.servicePrice}>{service.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Serving All Alberta</Text>
            <Text style={styles.footerCommunities}>Calgary • Edmonton • Red Deer • Lethbridge</Text>
            <Text style={styles.footerCopyright}>© 2025 Alberta Renovation Connect</Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: Colors.white,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FF6B35',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  heroSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  heroImageContainer: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.95,
  },
  roleSelection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  roleCards: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      } as any,
    }),
  },
  roleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCardTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  roleCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  features: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7F3',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE8DC',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
    flex: 1,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  servicesVertical: {
    gap: 16,
  },
  serviceCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      } as any,
    }),
  },
  serviceImage: {
    width: '100%',
    height: 180,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  servicePriceContainer: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  servicePrice: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: Colors.offWhite,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  footerCommunities: {
    fontSize: 14,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  footerCopyright: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  authSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  loginButton: {
    height: 56,
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#1E3A5F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});
