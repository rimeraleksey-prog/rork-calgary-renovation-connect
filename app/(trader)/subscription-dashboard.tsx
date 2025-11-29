import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Crown, TrendingUp, DollarSign, BarChart3, Calendar, Star, Info, Gift, Share2, Copy } from 'lucide-react-native';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';
import { SUBSCRIPTION_PLANS } from '@/constants/subscription';

export default function SubscriptionDashboard() {
  const { currentPlan, remainingLeads, canAccessLeads, upgradeToPlan, featureListing, toggleAutoRenew } = useSubscription();
  const { leadsUsedThisMonth, unlockedLeads, subscriptionTier, myTraderProfile } = useApp();

  const totalSpentOnLeads = unlockedLeads.reduce((sum, lead) => sum + lead.amount, 0);

  const getProgressColor = () => {
    if (currentPlan?.leadsPerMonth === 'unlimited') return Colors.deepBlue;
    if (typeof remainingLeads === 'number') {
      const percentage = (remainingLeads / (currentPlan?.leadsPerMonth || 1)) * 100;
      if (percentage > 50) return '#10B981';
      if (percentage > 20) return '#FF6B35';
      return '#EF4444';
    }
    return Colors.deepBlue;
  };

  const getProgressPercentage = () => {
    if (currentPlan?.leadsPerMonth === 'unlimited') return 100;
    if (typeof remainingLeads === 'number' && currentPlan?.leadsPerMonth) {
      return (remainingLeads / currentPlan.leadsPerMonth) * 100;
    }
    return 0;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Subscription</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.currentPlanCard}>
            <View style={styles.currentPlanHeader}>
              <View style={styles.planBadge}>
                {subscriptionTier === 'elite' ? (
                  <Crown size={24} color="#FFD700" />
                ) : subscriptionTier === 'pro' ? (
                  <Star size={24} color="#FF6B35" />
                ) : (
                  <Star size={24} color={Colors.deepBlue} />
                )}
              </View>
              <View style={styles.currentPlanInfo}>
                <Text style={styles.currentPlanLabel}>Current Plan</Text>
                <Text style={styles.currentPlanName}>{currentPlan?.name}</Text>
              </View>
              {currentPlan?.price !== 0 && (
                <View style={styles.priceContainer}>
                  <Text style={styles.currentPrice}>${currentPlan?.price}</Text>
                  <Text style={styles.priceInterval}>/mo</Text>
                </View>
              )}
            </View>

            {subscriptionTier !== 'elite' && (
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => router.push('/(trader)/subscription-plans' as any)}
              >
                <TrendingUp size={18} color={Colors.white} />
                <Text style={styles.upgradeButtonText}>
                  Upgrade to {subscriptionTier === 'basic' ? 'Pro' : 'Elite'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>This Month</Text>

            <View style={styles.leadsCard}>
              <View style={styles.leadsHeader}>
                <View>
                  <Text style={styles.leadsLabel}>Leads Remaining</Text>
                  <Text style={styles.leadsValue}>
                    {remainingLeads === 'unlimited' ? '∞ Unlimited' : `${remainingLeads} of ${currentPlan?.leadsPerMonth}`}
                  </Text>
                </View>
                {!canAccessLeads && (
                  <View style={styles.warningBadge}>
                    <Text style={styles.warningText}>Limit Reached</Text>
                  </View>
                )}
              </View>

              {currentPlan?.leadsPerMonth !== 'unlimited' && (
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${getProgressPercentage()}%`,
                        backgroundColor: getProgressColor(),
                      }
                    ]} 
                  />
                </View>
              )}
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <BarChart3 size={20} color={Colors.deepBlue} />
                </View>
                <Text style={styles.statValue}>{leadsUsedThisMonth}</Text>
                <Text style={styles.statLabel}>Leads Used</Text>
              </View>

              <View style={styles.statCard}>
                <View style={styles.statIcon}>
                  <DollarSign size={20} color='#10B981' />
                </View>
                <Text style={styles.statValue}>${totalSpentOnLeads}</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
            </View>
          </View>

          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Your Features</Text>
            <View style={styles.featuresGrid}>
              {currentPlan?.features.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {subscriptionTier !== 'elite' && (
            <View style={styles.upgradeSection}>
              <Text style={styles.upgradeSectionTitle}>Need More Leads?</Text>
              <View style={styles.upgradeOptions}>
                <TouchableOpacity 
                  style={styles.upgradeOption}
                  onPress={() => router.push('/(trader)/subscription-plans' as any)}
                >
                  <View style={styles.upgradeOptionIcon}>
                    <Crown size={24} color='#FF6B35' />
                  </View>
                  <View style={styles.upgradeOptionContent}>
                    <Text style={styles.upgradeOptionTitle}>Upgrade Plan</Text>
                    <Text style={styles.upgradeOptionDesc}>
                      Get more leads and features
                    </Text>
                  </View>
                  <Text style={styles.upgradeOptionPrice}>
                    From ${SUBSCRIPTION_PLANS.find(p => p.id === (subscriptionTier === 'basic' ? 'pro' : 'elite'))?.price}
                  </Text>
                </TouchableOpacity>

                {subscriptionTier === 'basic' && (
                  <TouchableOpacity 
                    style={styles.upgradeOption}
                    onPress={() => featureListing()}
                  >
                    <View style={styles.upgradeOptionIcon}>
                      <TrendingUp size={24} color={Colors.deepBlue} />
                    </View>
                    <View style={styles.upgradeOptionContent}>
                      <Text style={styles.upgradeOptionTitle}>Feature Listing</Text>
                      <Text style={styles.upgradeOptionDesc}>
                        30 days at the top of search
                      </Text>
                    </View>
                    <Text style={styles.upgradeOptionPrice}>$29</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          <View style={styles.billingSection}>
            <Text style={styles.sectionTitle}>Billing</Text>
            <View style={styles.billingCard}>
              <View style={styles.billingRow}>
                <View style={styles.billingIcon}>
                  <Calendar size={20} color={Colors.deepBlue} />
                </View>
                <View style={styles.billingInfo}>
                  <Text style={styles.billingLabel}>Next Billing Date</Text>
                  <Text style={styles.billingValue}>
                    {currentPlan?.price === 0 ? 'N/A' : myTraderProfile?.subscription_end_date
                      ? new Date(myTraderProfile.subscription_end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Text>
                </View>
              </View>

              {currentPlan?.price !== 0 && (
                <View style={styles.billingRow}>
                  <View style={styles.billingIcon}>
                    <DollarSign size={20} color='#10B981' />
                  </View>
                  <View style={styles.billingInfo}>
                    <Text style={styles.billingLabel}>Next Charge</Text>
                    <Text style={styles.billingValue}>
                      ${myTraderProfile?.billing_cycle === 'annual' && currentPlan?.id === 'pro' 
                        ? '390' 
                        : myTraderProfile?.billing_cycle === 'annual' && currentPlan?.id === 'elite' 
                        ? '790' 
                        : currentPlan?.price} CAD
                    </Text>
                  </View>
                </View>
              )}

              {currentPlan?.price !== 0 && (
                <View style={styles.billingRow}>
                  <View style={styles.billingIcon}>
                    <Calendar size={20} color={Colors.deepBlue} />
                  </View>
                  <View style={styles.billingInfo}>
                    <Text style={styles.billingLabel}>Billing Cycle</Text>
                    <Text style={styles.billingValue}>
                      {myTraderProfile?.billing_cycle === 'annual' ? 'Annual' : 'Monthly'}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {currentPlan?.price !== 0 && (
              <View style={styles.autoRenewSection}>
                <View style={styles.autoRenewRow}>
                  <View style={styles.autoRenewInfo}>
                    <Text style={styles.autoRenewTitle}>Auto-renew</Text>
                    <Text style={styles.autoRenewDesc}>
                      {myTraderProfile?.auto_renew ?? true
                        ? `Your plan renews automatically every ${myTraderProfile?.billing_cycle === 'annual' ? 'year' : 'month'}. You can turn off auto-renew at any time.`
                        : `Auto-renew is turned off. Your current plan will end on ${myTraderProfile?.subscription_end_date ? new Date(myTraderProfile.subscription_end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'billing date'} and then you will switch to the Basic plan.`}
                    </Text>
                  </View>
                  <Switch
                    value={myTraderProfile?.auto_renew ?? true}
                    onValueChange={toggleAutoRenew}
                    trackColor={{ false: Colors.border, true: Colors.deepBlue }}
                    thumbColor={Colors.white}
                  />
                </View>
              </View>
            )}

            {currentPlan?.price !== 0 && (
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => upgradeToPlan('basic', 'monthly')}
              >
                <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.referralSection}>
            <Text style={styles.sectionTitle}>Referral Program</Text>
            <View style={styles.referralCard}>
              <View style={styles.referralHeader}>
                <View style={styles.referralIconContainer}>
                  <Gift size={24} color={Colors.deepBlue} />
                </View>
                <View style={styles.referralHeaderInfo}>
                  <Text style={styles.referralHeaderTitle}>Invite Other Traders</Text>
                  <Text style={styles.referralHeaderDesc}>Earn 10% of their subscription payments</Text>
                </View>
              </View>

              {myTraderProfile?.referral_credits && myTraderProfile.referral_credits > 0 && (
                <View style={styles.referralBalance}>
                  <Text style={styles.referralBalanceLabel}>Referral Balance</Text>
                  <Text style={styles.referralBalanceAmount}>${myTraderProfile.referral_credits} CAD</Text>
                  <Text style={styles.referralBalanceDesc}>Will be applied to your next payment</Text>
                </View>
              )}

              <View style={styles.referralCodeContainer}>
                <View style={styles.referralCodeHeader}>
                  <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
                  <TouchableOpacity style={styles.copyButton}>
                    <Copy size={16} color={Colors.deepBlue} />
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.referralCodeBox}>
                  <Text style={styles.referralCodeText}>
                    {myTraderProfile?.referral_code || 'TRADER' + myTraderProfile?.id?.slice(0, 6).toUpperCase()}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.shareButton}>
                <Share2 size={18} color={Colors.white} />
                <Text style={styles.shareButtonText}>Share Referral Link</Text>
              </TouchableOpacity>

              <Text style={styles.referralExplainer}>
                Share your code with other traders. When they sign up and complete their first paid subscription, you&apos;ll earn 10% credit.
              </Text>
            </View>
          </View>

          {subscriptionTier === 'basic' && (
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Info size={20} color={Colors.deepBlue} />
                <Text style={styles.infoText}>
                  You are on the free Basic plan. Upgrade to unlock unlimited job responses and higher visibility.
                </Text>
              </View>
            </View>
          )}

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
  currentPlanCard: {
    margin: 20,
    backgroundColor: Colors.deepBlue,
    borderRadius: 20,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.deepBlue,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(30,58,95,0.3)',
      } as any,
    }),
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  planBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  currentPlanInfo: {
    flex: 1,
  },
  currentPlanLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  priceInterval: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700' as const,
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
  leadsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
  leadsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  leadsLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  leadsValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  warningBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  warningText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.offWhite,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featuresGrid: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.deepBlue,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  upgradeSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  upgradeSectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  upgradeOptions: {
    gap: 12,
  },
  upgradeOption: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  upgradeOptionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upgradeOptionContent: {
    flex: 1,
  },
  upgradeOptionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  upgradeOptionDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  upgradeOptionPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.deepBlue,
  },
  billingSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  billingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  billingInfo: {
    flex: 1,
  },
  billingLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  billingValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  autoRenewSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  autoRenewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  autoRenewInfo: {
    flex: 1,
  },
  autoRenewTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  autoRenewDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  referralSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  referralCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
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
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  referralIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  referralHeaderInfo: {
    flex: 1,
  },
  referralHeaderTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  referralHeaderDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  referralBalance: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  referralBalanceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  referralBalanceAmount: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.deepBlue,
    marginBottom: 4,
  },
  referralBalanceDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  referralCodeContainer: {
    marginBottom: 16,
  },
  referralCodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  referralCodeLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.offWhite,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.deepBlue,
  },
  referralCodeBox: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.deepBlue,
    borderStyle: 'dashed' as const,
  },
  referralCodeText: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: 2,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.deepBlue,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  shareButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  referralExplainer: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
  },
});
