import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TrendingUp, Briefcase, DollarSign, Crown, Zap, Calendar } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Colors from '@/constants/colors';

export default function DashboardScreen() {
  const { myTraderProfile, jobs, leadsUsedThisMonth } = useApp();
  const { remainingLeads, currentPlan } = useSubscription();

  const stats = [
    {
      icon: Briefcase,
      label: 'Leads This Month',
      value: leadsUsedThisMonth.toString(),
      color: Colors.deepBlue,
    },
    {
      icon: DollarSign,
      label: 'Active Quotes',
      value: '12',
      color: '#4CAF50',
    },
    {
      icon: TrendingUp,
      label: 'Response Rate',
      value: '94%',
      color: Colors.orange,
    },
  ];

  const tierName = currentPlan?.id === 'elite' ? 'Elite' : currentPlan?.id === 'pro' ? 'Pro' : 'Basic';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back</Text>
          <Text style={styles.businessName}>{myTraderProfile?.businessName || 'Your Business'}</Text>
        </View>
        <TouchableOpacity
          style={styles.subscriptionBadge}
          onPress={() => router.push('/(trader-tabs)/subscription' as any)}
        >
          {currentPlan?.id === 'elite' ? (
            <Crown size={16} color="#FFD700" />
          ) : currentPlan?.id === 'pro' ? (
            <Zap size={16} color={Colors.orange} />
          ) : null}
          <Text style={styles.subscriptionText}>{tierName}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>Your Plan</Text>
            <TouchableOpacity onPress={() => router.push('/(trader-tabs)/subscription' as any)}>
              <Text style={styles.planLink}>Manage</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.planTier}>{tierName} Plan</Text>
          <View style={styles.planDetail}>
            <Text style={styles.planDetailLabel}>Job Responses:</Text>
            <Text style={styles.planDetailValue}>
              {remainingLeads === 'unlimited' ? 'Unlimited' : `${remainingLeads} remaining`}
            </Text>
          </View>
          {myTraderProfile?.subscriptionTier === 'basic' && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => router.push('/(trader)/subscription-plans' as any)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '15' }]}>
                    <Icon size={24} color={stat.color} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(trader-tabs)/job-board' as any)}
          >
            <Briefcase size={24} color={Colors.deepBlue} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Browse Jobs</Text>
              <Text style={styles.actionDescription}>{jobs.length} open opportunities</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(trader-tabs)/profile' as any)}
          >
            <Calendar size={24} color={Colors.deepBlue} />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Update Profile</Text>
              <Text style={styles.actionDescription}>Keep your business info current</Text>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  subscriptionText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.deepBlue,
  },
  content: {
    flex: 1,
  },
  planCard: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
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
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  planLink: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.deepBlue,
  },
  planTier: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.deepBlue,
    marginBottom: 12,
  },
  planDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  planDetailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  planDetailValue: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  upgradeButton: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
