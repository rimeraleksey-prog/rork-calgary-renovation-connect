import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { CreditCard, Crown, Zap } from 'lucide-react-native';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function SubscriptionScreen() {
  const { currentPlan, remainingLeads } = useSubscription();
  const { myTraderProfile } = useApp();

  const tierName = currentPlan?.id === 'elite' ? 'Elite' : currentPlan?.id === 'pro' ? 'Pro' : 'Basic';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.currentPlanCard}>
          <View style={styles.planBadge}>
            {currentPlan?.id === 'elite' ? (
              <Crown size={24} color="#FFD700" />
            ) : currentPlan?.id === 'pro' ? (
              <Zap size={24} color={Colors.orange} />
            ) : (
              <CreditCard size={24} color={Colors.deepBlue} />
            )}
          </View>
          <Text style={styles.currentPlanTitle}>Current Plan</Text>
          <Text style={styles.currentPlanName}>{tierName}</Text>
          
          <View style={styles.planDetails}>
            <View style={styles.planDetail}>
              <Text style={styles.planDetailLabel}>Job Responses</Text>
              <Text style={styles.planDetailValue}>
                {remainingLeads === 'unlimited' ? 'Unlimited' : `${remainingLeads} remaining`}
              </Text>
            </View>
            
            {myTraderProfile?.subscriptionTier !== 'basic' && (
              <>
                <View style={styles.planDetail}>
                  <Text style={styles.planDetailLabel}>Priority Placement</Text>
                  <Text style={styles.planDetailValue}>
                    {currentPlan?.id === 'elite' ? 'Highest' : 'High'}
                  </Text>
                </View>
                <View style={styles.planDetail}>
                  <Text style={styles.planDetailLabel}>Response Badges</Text>
                  <Text style={styles.planDetailValue}>Enabled</Text>
                </View>
              </>
            )}
          </View>

          {myTraderProfile?.auto_renew === false && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                Auto-renew is off. Your plan will expire at the end of the billing period.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          {myTraderProfile?.subscriptionTier === 'basic' && (
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/(trader)/subscription-plans' as any)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => router.push('/(trader)/subscription-dashboard' as any)}
          >
            <Text style={styles.manageButtonText}>Manage Subscription</Text>
          </TouchableOpacity>

          {myTraderProfile?.subscriptionTier !== 'basic' && (
            <TouchableOpacity
              style={styles.plansButton}
              onPress={() => router.push('/(trader)/subscription-plans' as any)}
            >
              <Text style={styles.plansButtonText}>View All Plans</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan Benefits</Text>
          <View style={styles.benefitsCard}>
            {currentPlan?.id === 'elite' ? (
              <>
                <Text style={styles.benefit}>✓ Unlimited job responses</Text>
                <Text style={styles.benefit}>✓ Highest priority in search results</Text>
                <Text style={styles.benefit}>✓ Elite badge on profile</Text>
                <Text style={styles.benefit}>✓ Premium customer support</Text>
                <Text style={styles.benefit}>✓ Advanced analytics</Text>
              </>
            ) : currentPlan?.id === 'pro' ? (
              <>
                <Text style={styles.benefit}>✓ Unlimited job responses</Text>
                <Text style={styles.benefit}>✓ Priority in search results</Text>
                <Text style={styles.benefit}>✓ Pro badge on profile</Text>
                <Text style={styles.benefit}>✓ Basic analytics</Text>
              </>
            ) : (
              <>
                <Text style={styles.benefit}>• 3 free job responses/month</Text>
                <Text style={styles.benefit}>• Standard listing</Text>
                <Text style={styles.benefit}>• Basic profile</Text>
              </>
            )}
          </View>
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
  currentPlanCard: {
    margin: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      } as any,
    }),
  },
  planBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currentPlanTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  currentPlanName: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.deepBlue,
    marginBottom: 24,
  },
  planDetails: {
    width: '100%',
    gap: 16,
  },
  planDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
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
  warningBanner: {
    marginTop: 16,
    width: '100%',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.orange,
  },
  warningText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
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
  upgradeButton: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  manageButton: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  manageButtonText: {
    color: Colors.deepBlue,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  plansButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  plansButtonText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  benefitsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  benefit: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});
