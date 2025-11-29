import createContextHook from '@nkzw/create-context-hook';
import { Platform, Alert } from 'react-native';
import { useApp } from './AppContext';
import { SUBSCRIPTION_PLANS, SubscriptionTier, PAY_PER_LEAD_PRICE, BillingCycle } from '@/constants/subscription';

export interface SubscriptionContextValue {
  currentPlan: typeof SUBSCRIPTION_PLANS[number] | null;
  canAccessLeads: boolean;
  remainingLeads: number | 'unlimited';
  upgradeToPlan: (tier: SubscriptionTier, billingCycle: BillingCycle) => Promise<void>;
  purchaseLead: (jobId: string) => Promise<void>;
  featureListing: () => Promise<void>;
  isProcessing: boolean;
  toggleAutoRenew: () => Promise<void>;
  applyReferralCredits: (amount: number) => number;
}

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const { subscriptionTier, setSubscriptionTier, leadsUsedThisMonth, unlockLead, myTraderProfile, updateTraderProfile, toggleAutoRenew: toggleAutoRenewApp } = useApp();

  const currentPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === subscriptionTier) || SUBSCRIPTION_PLANS[0];

  const remainingLeads = currentPlan.leadsPerMonth === 'unlimited' 
    ? 'unlimited' 
    : Math.max(0, currentPlan.leadsPerMonth - leadsUsedThisMonth);

  const canAccessLeads = currentPlan.leadsPerMonth === 'unlimited' || (typeof remainingLeads === 'number' && remainingLeads > 0);

  const processStripePayment = async (
    amount: number, 
    description: string,
    isSubscription: boolean = false
  ): Promise<boolean> => {
    console.log(`Processing Stripe payment: ${amount} CAD for ${description}`);
    
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        Alert.alert(
          'Payment Demo',
          `In production, this would process:\n\n${description}\nAmount: $${amount} CAD${isSubscription ? '/month' : ''}\n\nThis is a demo - payment approved!`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Approve',
              onPress: () => resolve(true),
            },
          ]
        );
      });
    } else {
      return new Promise((resolve) => {
        Alert.alert(
          'Payment Demo',
          `In production, this would process:\n\n${description}\nAmount: $${amount} CAD${isSubscription ? '/month' : ''}\n\nThis is a demo - payment approved!`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => resolve(false),
            },
            {
              text: 'Approve',
              onPress: () => resolve(true),
            },
          ]
        );
      });
    }
  };

  const upgradeToPlan = async (tier: SubscriptionTier, billingCycle: BillingCycle = 'monthly') => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === tier);
    if (!plan) return;

    if (tier === 'basic') {
      await setSubscriptionTier(tier);
      if (myTraderProfile) {
        await updateTraderProfile({
          ...myTraderProfile,
          subscriptionTier: tier,
          subscription_status: 'canceled',
          auto_renew: true,
          billing_cycle: 'monthly',
        });
      }
      Alert.alert('Success', 'Switched to Basic plan');
      return;
    }

    const amount = billingCycle === 'annual' && plan.annualPrice ? plan.annualPrice : plan.price;
    const finalAmount = applyReferralCredits(amount);
    
    const success = await processStripePayment(
      finalAmount,
      `${plan.name} Plan Subscription (${billingCycle === 'annual' ? 'Annual' : 'Monthly'})`,
      true
    );

    if (success) {
      await setSubscriptionTier(tier);
      
      const subscriptionEndDate = new Date();
      if (billingCycle === 'annual') {
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
      } else {
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
      }
      
      if (myTraderProfile) {
        const creditsUsed = amount - finalAmount;
        const remainingCredits = Math.max(0, (myTraderProfile.referral_credits || 0) - creditsUsed);
        
        await updateTraderProfile({
          ...myTraderProfile,
          subscriptionTier: tier,
          auto_renew: true,
          subscription_end_date: subscriptionEndDate.toISOString(),
          subscription_status: 'active',
          billing_cycle: billingCycle,
          referral_credits: remainingCredits,
        });
      }
      
      Alert.alert(
        'Subscription Active!', 
        `You're now subscribed to the ${plan.name} plan (${billingCycle === 'annual' ? 'Annual' : 'Monthly'}). Enjoy your new features!`
      );
    }
  };

  const applyReferralCredits = (amount: number): number => {
    const credits = myTraderProfile?.referral_credits || 0;
    if (credits <= 0) return amount;
    
    const discount = Math.min(credits, amount);
    console.log(`Applying ${discount} in referral credits`);
    return amount - discount;
  };

  const purchaseLead = async (jobId: string) => {
    const success = await processStripePayment(
      PAY_PER_LEAD_PRICE,
      'Unlock Job Lead',
      false
    );

    if (success) {
      await unlockLead(jobId, PAY_PER_LEAD_PRICE);
      Alert.alert('Lead Unlocked!', 'You can now view the full job details and contact information.');
    }
  };

  const featureListing = async () => {
    const success = await processStripePayment(
      29,
      'Feature Your Listing (30 days)',
      false
    );

    if (success) {
      Alert.alert(
        'Listing Featured!', 
        'Your profile will appear at the top of search results for the next 30 days.'
      );
    }
  };

  const toggleAutoRenew = async () => {
    await toggleAutoRenewApp();
    const autoRenew = myTraderProfile?.auto_renew ?? true;
    if (!autoRenew) {
      Alert.alert(
        'Auto-renew Turned On',
        'Your plan will continue each month until you cancel.'
      );
    } else {
      Alert.alert(
        'Auto-renew Turned Off',
        `Your ${currentPlan?.name} plan will remain active until the end of your current billing period, then you will switch to the Basic plan.`
      );
    }
  };

  return {
    currentPlan,
    canAccessLeads,
    remainingLeads,
    upgradeToPlan,
    purchaseLead,
    featureListing,
    isProcessing: false,
    toggleAutoRenew,
    applyReferralCredits,
  };
});
