import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Plus, Star, TrendingUp, Clock, Shield, Award } from 'lucide-react-native';
import { useFilteredTraders, useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function CustomerHomeScreen() {
  const { jobs } = useApp();
  const featuredTraders = useFilteredTraders('', 'All', 'All', 'All', false).slice(0, 3);
  const myActiveJobs = jobs.filter(job => job.status === 'open' || job.status === 'quoted');

  const quickActions = [
    {
      icon: Plus,
      title: 'Post a Job',
      subtitle: 'Get quotes from pros',
      color: '#FF6B35',
      action: () => router.push('/(customer)/post-job' as any),
    },
    {
      icon: Star,
      title: 'Browse Pros',
      subtitle: 'Find verified contractors',
      color: '#1E3A5F',
      action: () => router.push('/(customer-tabs)/browse' as any),
    },
  ];

  const features = [
    { icon: Shield, text: 'All pros are verified & insured' },
    { icon: Award, text: 'Read real customer reviews' },
    { icon: TrendingUp, text: 'Compare multiple quotes' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back</Text>
          <Text style={styles.subtitle}>Find your next renovation pro</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickActionsSection}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionCard, { borderLeftColor: action.color, borderLeftWidth: 4 }]}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <Icon size={24} color={action.color} strokeWidth={2.5} />
                </View>
                <View style={styles.quickActionContent}>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                  <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {myActiveJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Active Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/(customer-tabs)/my-jobs' as any)}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.jobsList}>
              {myActiveJobs.slice(0, 2).map((job) => (
                <View key={job.id} style={styles.jobCard}>
                  <View style={styles.jobCardHeader}>
                    <Text style={styles.jobCardTitle}>{job.projectType}</Text>
                    <View style={[styles.statusBadge, { 
                      backgroundColor: job.status === 'quoted' ? '#4CAF50' : '#FF6B35' 
                    }]}>
                      <Text style={styles.statusText}>
                        {job.status === 'quoted' ? 'Quoted' : 'Open'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.jobCardDescription} numberOfLines={2}>
                    {job.description}
                  </Text>
                  <View style={styles.jobCardFooter}>
                    <View style={styles.jobCardDetail}>
                      <Clock size={14} color={Colors.textSecondary} />
                      <Text style={styles.jobCardDetailText}>{job.timeline}</Text>
                    </View>
                    <Text style={styles.jobCardBudget}>{job.budgetRange}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose Alberta Reno</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Icon size={20} color={Colors.orange} strokeWidth={2} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Professionals</Text>
            <TouchableOpacity onPress={() => router.push('/(customer-tabs)/browse' as any)}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tradersScrollContent}
          >
            {featuredTraders.map((trader) => (
              <TouchableOpacity
                key={trader.id}
                style={styles.traderCard}
                onPress={() => router.push(`/(customer)/contractor/${trader.id}` as any)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: trader.portfolioImages[0] }}
                  style={styles.traderImage}
                  contentFit="cover"
                />
                <View style={styles.traderInfo}>
                  <Text style={styles.traderName} numberOfLines={1}>
                    {trader.businessName}
                  </Text>
                  <Text style={styles.traderCategory} numberOfLines={1}>
                    {trader.category}
                  </Text>
                  <View style={styles.traderRating}>
                    <Star size={14} color={Colors.orange} fill={Colors.orange} />
                    <Text style={styles.traderRatingText}>
                      {trader.rating} ({trader.reviewCount})
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  quickActionsSection: {
    padding: 20,
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.orange,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      } as any,
    }),
  },
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  jobCardTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  jobCardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobCardDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  jobCardBudget: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.deepBlue,
  },
  featuresGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F3',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#FFE8DC',
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  tradersScrollContent: {
    paddingRight: 20,
  },
  traderCard: {
    width: 180,
    marginRight: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
  traderImage: {
    width: '100%',
    height: 120,
  },
  traderInfo: {
    padding: 12,
  },
  traderName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  traderCategory: {
    fontSize: 12,
    color: Colors.deepBlue,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  traderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  traderRatingText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
