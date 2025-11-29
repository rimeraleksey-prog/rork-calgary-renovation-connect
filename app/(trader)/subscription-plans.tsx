import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Check, Zap, Crown, Star } from 'lucide-react-native';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useApp } from '@/contexts/AppContext';
import { SUBSCRIPTION_PLANS, SubscriptionTier, BillingCycle } from '@/constants/subscription';
import Colors from '@/constants/colors';

export default function SubscriptionPlansScreen() {
  const { currentPlan, upgradeToPlan } = useSubscription();
  const { myTraderProfile } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionTier>(currentPlan?.id || 'basic');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BillingCycle>('monthly');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedPlan, scaleAnim]);

  const handleSelectPlan = async () => {
    if (selectedPlan === currentPlan?.id && selectedBillingCycle === (myTraderProfile?.billing_cycle || 'monthly')) {
      router.back();
      return;
    }
    await upgradeToPlan(selectedPlan, selectedBillingCycle);
    router.back();
  };

  const getPrice = (plan: typeof SUBSCRIPTION_PLANS[number]) => {
    if (plan.price === 0) return 0;
    return selectedBillingCycle === 'annual' && plan.annualPrice ? plan.annualPrice : plan.price;
  };

  const getSavings = (plan: typeof SUBSCRIPTION_PLANS[number]) => {
    if (plan.price === 0 || !plan.annualPrice) return 0;
    const monthlyTotal = plan.price * 12;
    return monthlyTotal - plan.annualPrice;
  };

  const getPlanIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'basic':
        return <Star size={24} color={Colors.deepBlue} />;
      case 'pro':
        return <Zap size={24} color="#FF6B35" />;
      case 'elite':
        return <Crown size={24} color="#FFD700" />;
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <Text style={styles.introTitle}>Grow Your Business</Text>
            <Text style={styles.introSubtitle}>
              Choose the perfect plan for your contracting business in Calgary
            </Text>
          </View>

          <View style={styles.billingToggle}>
            <TouchableOpacity
              style={[
                styles.billingToggleButton,
                selectedBillingCycle === 'monthly' && styles.billingToggleButtonActive,
              ]}
              onPress={() => setSelectedBillingCycle('monthly')}
            >
              <Text
                style={[
                  styles.billingToggleText,
                  selectedBillingCycle === 'monthly' && styles.billingToggleTextActive,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.billingToggleButton,
                selectedBillingCycle === 'annual' && styles.billingToggleButtonActive,
              ]}
              onPress={() => setSelectedBillingCycle('annual')}
            >
              <Text
                style={[
                  styles.billingToggleText,
                  selectedBillingCycle === 'annual' && styles.billingToggleTextActive,
                ]}
              >
                Annual
              </Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsBadgeText}>Save 2 Months</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.plans}>
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              const isCurrent = currentPlan?.id === plan.id;

              return (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    isSelected && styles.planCardSelected,
                    plan.recommended && styles.planCardRecommended,
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                  activeOpacity={0.9}
                >
                  {plan.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>MOST POPULAR</Text>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    <View style={styles.planIconContainer}>{getPlanIcon(plan.id)}</View>
                    <View style={styles.planTitleContainer}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      {isCurrent && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>Current</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.planPricing}>
                    {plan.price === 0 ? (
                      <Text style={styles.planPrice}>Free</Text>
                    ) : (
                      <View>
                        <View style={styles.priceRow}>
                          <Text style={styles.planPrice}>${getPrice(plan)}</Text>
                          <Text style={styles.planInterval}>/{selectedBillingCycle === 'annual' ? 'year' : 'month'} CAD</Text>
                        </View>
                        {selectedBillingCycle === 'annual' && getSavings(plan) > 0 && (
                          <Text style={styles.savingsText}>Save ${getSavings(plan)} vs monthly</Text>
                        )}
                      </View>
                    )}
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <View style={styles.checkIcon}>
                          <Check size={16} color={isSelected ? Colors.white : Colors.deepBlue} />
                        </View>
                        <Text style={[styles.featureText, isSelected && styles.featureTextSelected]}>
                          {feature}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Check size={20} color={Colors.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.comparison}>
            <Text style={styles.comparisonTitle}>Plan Comparison</Text>
            
            <View style={styles.comparisonTable}>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Job Requests</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>3</Text>
                  <Text style={styles.comparisonValue}>∞</Text>
                  <Text style={styles.comparisonValue}>∞</Text>
                </View>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Portfolio Photos</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>5</Text>
                  <Text style={styles.comparisonValue}>20</Text>
                  <Text style={styles.comparisonValue}>∞</Text>
                </View>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Featured Listing</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>-</Text>
                  <Check size={16} color={Colors.deepBlue} />
                  <Check size={16} color={Colors.deepBlue} />
                </View>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Elite Pro Badge</Text>
                <View style={styles.comparisonValues}>
                  <Text style={styles.comparisonValue}>-</Text>
                  <Text style={styles.comparisonValue}>-</Text>
                  <Check size={16} color={Colors.deepBlue} />
                </View>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Support Response</Text>
                <View style={styles.comparisonValues}>
                  <Text style={[styles.comparisonValue, styles.comparisonValueSmall]}>48h</Text>
                  <Text style={[styles.comparisonValue, styles.comparisonValueSmall]}>24h</Text>
                  <Text style={[styles.comparisonValue, styles.comparisonValueSmall]}>1h</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.payPerLead}>
            <View style={styles.payPerLeadHeader}>
              <Text style={styles.payPerLeadTitle}>Pay-Per-Lead Option</Text>
              <Text style={styles.payPerLeadPrice}>$12 CAD/lead</Text>
            </View>
            <Text style={styles.payPerLeadDesc}>
              Not ready for a subscription? Unlock individual job leads as you need them for just $12 CAD each.
            </Text>
          </View>

          {myTraderProfile && myTraderProfile.referral_credits && myTraderProfile.referral_credits > 0 && (
            <View style={styles.creditsInfo}>
              <View style={styles.creditsHeader}>
                <Text style={styles.creditsTitle}>Referral Credits Available</Text>
                <Text style={styles.creditsAmount}>${myTraderProfile.referral_credits} CAD</Text>
              </View>
              <Text style={styles.creditsDesc}>
                Your referral credits will be automatically applied to your next payment.
              </Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              selectedPlan === currentPlan?.id && styles.continueButtonDisabled
            ]} 
            onPress={handleSelectPlan}
          >
            <Text style={styles.continueButtonText}>
              {selectedPlan === currentPlan?.id ? 'Current Plan' : `Select ${SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan)?.name}`}
            </Text>
          </TouchableOpacity>
        </View>
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
  intro: {
    padding: 24,
    alignItems: 'center',
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  introSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  plans: {
    paddingHorizontal: 20,
    gap: 16,
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.border,
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
  planCardSelected: {
    borderColor: Colors.deepBlue,
    backgroundColor: Colors.deepBlue,
  },
  planCardRecommended: {
    borderColor: '#FF6B35',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  recommendedText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  planIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  planTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  currentBadge: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currentBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
  },
  planPricing: {
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
  },
  planInterval: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  planFeatures: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  featureTextSelected: {
    color: Colors.white,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparison: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comparisonLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  comparisonValues: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'center',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  comparisonValueSmall: {
    fontSize: 12,
  },
  payPerLead: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#FFF4E6',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  payPerLeadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  payPerLeadTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  payPerLeadPrice: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FF6B35',
  },
  payPerLeadDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
      } as any,
    }),
  },
  continueButton: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.grayLight,
  },
  continueButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  billingToggle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 4,
    gap: 8,
  },
  billingToggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  billingToggleButtonActive: {
    backgroundColor: Colors.deepBlue,
  },
  billingToggleText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  billingToggleTextActive: {
    color: Colors.white,
  },
  savingsBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  savingsBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700' as const,
  },
  savingsText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600' as const,
    marginTop: 4,
  },
  creditsInfo: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.deepBlue,
  },
  creditsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  creditsAmount: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.deepBlue,
  },
  creditsDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
