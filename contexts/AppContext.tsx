import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { UserRole, Trader, Job, Community, TradeCategory, PriceRating, ProjectType, UnlockedLead, Customer } from '@/types';
import { mockTraders, mockJobs } from '@/mocks/data';
import { SubscriptionTier } from '@/constants/subscription';

export interface AppState {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  traders: Trader[];
  jobs: Job[];
  addJob: (job: Job) => void;
  updateTraderProfile: (trader: Trader) => void;
  myTraderProfile: Trader | null;
  myCustomerProfile: Customer | null;
  updateCustomerProfile: (customer: Customer) => void;
  favoriteTraders: string[];
  toggleFavorite: (traderId: string) => void;
  isLoading: boolean;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  leadsUsedThisMonth: number;
  unlockedLeads: UnlockedLead[];
  unlockLead: (jobId: string, amount: number) => Promise<void>;
  isLeadUnlocked: (jobId: string) => boolean;
  canRespondToJob: () => boolean;
  getJobResponsesRemaining: () => number;
  recordJobResponse: () => Promise<void>;
  toggleAutoRenew: () => Promise<void>;
  checkSubscriptionExpiration: () => Promise<void>;
  addReferralCredit: (referrerId: string, amount: number) => Promise<void>;
  processReferralPayment: (traderId: string, paymentAmount: number) => Promise<void>;
}

export const [AppProvider, useApp] = createContextHook(() => {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [traders, setTraders] = useState<Trader[]>(mockTraders);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [myTraderProfile, setMyTraderProfile] = useState<Trader | null>(null);
  const [myCustomerProfile, setMyCustomerProfile] = useState<Customer | null>(null);
  const [favoriteTraders, setFavoriteTraders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>('basic');
  const [unlockedLeads, setUnlockedLeads] = useState<UnlockedLead[]>([]);
  const [leadsUsedThisMonth, setLeadsUsedThisMonth] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedRole, storedFavorites, storedProfile, storedCustomerProfile, storedTier, storedLeads, storedLeadsUsed] = await Promise.all([
          AsyncStorage.getItem('userRole'),
          AsyncStorage.getItem('favoriteTraders'),
          AsyncStorage.getItem('myTraderProfile'),
          AsyncStorage.getItem('myCustomerProfile'),
          AsyncStorage.getItem('subscriptionTier'),
          AsyncStorage.getItem('unlockedLeads'),
          AsyncStorage.getItem('leadsUsedThisMonth'),
        ]);

        if (storedRole) {
          setUserRoleState(storedRole as UserRole);
        }
        if (storedFavorites) {
          setFavoriteTraders(JSON.parse(storedFavorites));
        }
        if (storedProfile) {
          setMyTraderProfile(JSON.parse(storedProfile));
        }
        if (storedCustomerProfile) {
          setMyCustomerProfile(JSON.parse(storedCustomerProfile));
        }
        if (storedTier) {
          setSubscriptionTierState(storedTier as SubscriptionTier);
        }
        if (storedLeads) {
          setUnlockedLeads(JSON.parse(storedLeads));
        }
        if (storedLeadsUsed) {
          setLeadsUsedThisMonth(parseInt(storedLeadsUsed));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      await AsyncStorage.setItem('userRole', role);
    } else {
      await AsyncStorage.removeItem('userRole');
    }
  };

  const addJob = (job: Job) => {
    setJobs((prev) => [job, ...prev]);
  };

  const generateReferralCode = (traderId: string): string => {
    return 'TRADE' + traderId.slice(0, 8).toUpperCase();
  };

  const updateTraderProfile = async (trader: Trader) => {
    if (!trader.referral_code) {
      trader.referral_code = generateReferralCode(trader.id);
    }
    if (trader.referral_credits === undefined) {
      trader.referral_credits = 0;
    }
    
    setMyTraderProfile(trader);
    await AsyncStorage.setItem('myTraderProfile', JSON.stringify(trader));
    setTraders((prev) => {
      const existing = prev.find((t) => t.id === trader.id);
      if (existing) {
        return prev.map((t) => (t.id === trader.id ? trader : t));
      }
      return [...prev, trader];
    });
  };

  const updateCustomerProfile = async (customer: Customer) => {
    setMyCustomerProfile(customer);
    await AsyncStorage.setItem('myCustomerProfile', JSON.stringify(customer));
  };

  const toggleFavorite = async (traderId: string) => {
    const newFavorites = favoriteTraders.includes(traderId)
      ? favoriteTraders.filter((id) => id !== traderId)
      : [...favoriteTraders, traderId];
    
    setFavoriteTraders(newFavorites);
    await AsyncStorage.setItem('favoriteTraders', JSON.stringify(newFavorites));
  };

  const setSubscriptionTier = async (tier: SubscriptionTier) => {
    setSubscriptionTierState(tier);
    await AsyncStorage.setItem('subscriptionTier', tier);
    if (myTraderProfile) {
      const updatedProfile = { ...myTraderProfile, subscriptionTier: tier };
      await updateTraderProfile(updatedProfile);
    }
  };

  const unlockLead = async (jobId: string, amount: number) => {
    const newLead: UnlockedLead = {
      jobId,
      traderId: myTraderProfile?.id || '',
      unlockedAt: new Date(),
      amount,
    };
    const updatedLeads = [...unlockedLeads, newLead];
    setUnlockedLeads(updatedLeads);
    await AsyncStorage.setItem('unlockedLeads', JSON.stringify(updatedLeads));
    
    const updatedLeadsUsed = leadsUsedThisMonth + 1;
    setLeadsUsedThisMonth(updatedLeadsUsed);
    await AsyncStorage.setItem('leadsUsedThisMonth', updatedLeadsUsed.toString());
  };

  const isLeadUnlocked = (jobId: string) => {
    return unlockedLeads.some(lead => lead.jobId === jobId);
  };



  const canRespondToJob = () => {
    if (!myTraderProfile) return false;
    
    const tier = myTraderProfile.subscriptionTier || 'basic';
    
    if (tier === 'pro' || tier === 'elite') {
      return true;
    }
    
    const responsesCount = myTraderProfile.job_responses_count || 0;
    return responsesCount < 3;
  };

  const getJobResponsesRemaining = () => {
    if (!myTraderProfile) return 0;
    
    const tier = myTraderProfile.subscriptionTier || 'basic';
    
    if (tier === 'pro' || tier === 'elite') {
      return -1;
    }
    
    const responsesCount = myTraderProfile.job_responses_count || 0;
    return Math.max(0, 3 - responsesCount);
  };

  const recordJobResponse = async () => {
    if (!myTraderProfile) return;

    const newResponseCount = (myTraderProfile.job_responses_count || 0) + 1;
    const updatedProfile = {
      ...myTraderProfile,
      job_responses_count: newResponseCount,
    };

    await updateTraderProfile(updatedProfile);
    console.log(`Job response recorded. Total: ${newResponseCount}`);
  };

  const toggleAutoRenew = useCallback(async () => {
    if (!myTraderProfile) return;

    const currentAutoRenew = myTraderProfile.auto_renew ?? true;
    const updatedProfile = {
      ...myTraderProfile,
      auto_renew: !currentAutoRenew,
    };

    await updateTraderProfile(updatedProfile);
    console.log(`Auto-renew ${!currentAutoRenew ? 'enabled' : 'disabled'}`);
  }, [myTraderProfile]);

  const checkSubscriptionExpiration = useCallback(async () => {
    if (!myTraderProfile) return;

    const endDate = myTraderProfile.subscription_end_date;
    if (!endDate) return;

    const now = new Date();
    const expirationDate = new Date(endDate);

    if (now >= expirationDate && myTraderProfile.auto_renew === false) {
      const tier = myTraderProfile.subscriptionTier || 'basic';
      
      if (tier === 'pro' || tier === 'elite') {
        console.log('Subscription expired, downgrading to Basic');
        const updatedProfile = {
          ...myTraderProfile,
          subscriptionTier: 'basic' as SubscriptionTier,
          subscription_status: 'expired' as const,
          auto_renew: true,
        };
        await updateTraderProfile(updatedProfile);
        await setSubscriptionTier('basic');
      }
    }
  }, [myTraderProfile]);

  const addReferralCredit = useCallback(async (referrerId: string, amount: number) => {
    const referrer = traders.find(t => t.id === referrerId);
    if (!referrer) {
      console.error('Referrer not found');
      return;
    }

    const updatedReferrer = {
      ...referrer,
      referral_credits: (referrer.referral_credits || 0) + amount,
    };

    if (myTraderProfile?.id === referrerId) {
      await updateTraderProfile(updatedReferrer);
    }

    console.log(`Added ${amount} CAD credit to referrer ${referrerId}`);
  }, [traders, myTraderProfile]);

  const processReferralPayment = useCallback(async (traderId: string, paymentAmount: number) => {
    const trader = traders.find(t => t.id === traderId);
    if (!trader || !trader.referred_by) {
      console.log('No referrer found for this trader');
      return;
    }

    const referralCredit = paymentAmount * 0.1;
    await addReferralCredit(trader.referred_by, referralCredit);
    console.log(`Processed referral payment: ${paymentAmount} CAD, credited ${referralCredit} CAD to referrer`);
  }, [traders, addReferralCredit]);

  useEffect(() => {
    checkSubscriptionExpiration();
  }, [myTraderProfile]);

  return {
    userRole,
    setUserRole,
    traders,
    jobs,
    addJob,
    updateTraderProfile,
    myTraderProfile,
    myCustomerProfile,
    updateCustomerProfile,
    favoriteTraders,
    toggleFavorite,
    isLoading,
    subscriptionTier,
    setSubscriptionTier,
    leadsUsedThisMonth,
    unlockedLeads,
    unlockLead,
    isLeadUnlocked,
    canRespondToJob,
    getJobResponsesRemaining,
    recordJobResponse,
    toggleAutoRenew,
    checkSubscriptionExpiration,
    addReferralCredit,
    processReferralPayment,
  };
});

export function useFilteredTraders(
  searchQuery: string,
  category: TradeCategory | 'All',
  community: Community,
  priceRating: PriceRating | 'All',
  verifiedOnly: boolean
) {
  const { traders } = useApp();

  return useMemo(() => {
    const filtered = traders.filter((trader) => {
      if (searchQuery && !trader.businessName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !trader.category.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (category !== 'All' && trader.category !== category) {
        return false;
      }

      if (community !== 'All' && !trader.serviceAreas.includes(community)) {
        return false;
      }

      if (priceRating !== 'All' && trader.priceRating !== priceRating) {
        return false;
      }

      if (verifiedOnly && !trader.verified) {
        console.log(`Filtering out ${trader.businessName} - verified: ${trader.verified}`);
        return false;
      }

      return true;
    });
    
    const getSubscriptionPriority = (tier?: 'basic' | 'pro' | 'elite') => {
      if (tier === 'elite') return 3;
      if (tier === 'pro') return 2;
      return 1;
    };
    
    const sorted = filtered.sort((a, b) => {
      const priorityA = getSubscriptionPriority(a.subscriptionTier);
      const priorityB = getSubscriptionPriority(b.subscriptionTier);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      return b.rating - a.rating;
    });
    
    console.log(`Total traders: ${traders.length}, Filtered: ${filtered.length}, VerifiedOnly: ${verifiedOnly}`);
    return sorted;
  }, [traders, searchQuery, category, community, priceRating, verifiedOnly]);
}

export function useFilteredJobs(
  category: TradeCategory | 'All',
  community: Community,
  budgetMin: number
) {
  const { jobs } = useApp();

  return useMemo(() => {
    return jobs.filter((job) => {
      if (category !== 'All') {
        const categoryMap: Record<string, ProjectType[]> = {
          'General Contractor': ['Kitchen Renovation', 'Bathroom Renovation', 'Basement Finishing', 'Room Addition'],
          'Electrician': ['Electrical Work'],
          'Plumber': ['Plumbing', 'Bathroom Renovation', 'Kitchen Renovation'],
          'Carpenter': ['Basement Finishing', 'Room Addition'],
          'Painter': ['Painting'],
          'Roofer': ['Roofing'],
          'HVAC': ['HVAC'],
          'Flooring': ['Flooring'],
        };

        const relevantTypes = categoryMap[category] || [];
        if (!relevantTypes.includes(job.projectType)) {
          return false;
        }
      }

      if (community !== 'All' && job.community !== community) {
        return false;
      }

      return true;
    });
  }, [jobs, category, community]);
}
