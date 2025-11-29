export type SubscriptionTier = 'basic' | 'pro' | 'elite';
export type BillingCycle = 'monthly' | 'annual';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  annualPrice?: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  leadsPerMonth: number | 'unlimited';
  featuredListings: boolean;
  prioritySupport: boolean;
  verifiedBadge: boolean;
  portfolioPhotos: number;
  responseTime: string;
  recommended?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    currency: 'CAD',
    interval: 'month',
    features: [
      '3 job requests per month',
      'Basic profile listing',
      'Normal profile visibility',
      'Standard support',
      'Community visibility',
    ],
    leadsPerMonth: 3,
    featuredListings: false,
    prioritySupport: false,
    verifiedBadge: false,
    portfolioPhotos: 5,
    responseTime: '48 hours',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 39,
    annualPrice: 390,
    currency: 'CAD',
    interval: 'month',
    features: [
      'Unlimited job requests',
      'Featured higher in search results',
      'Priority support',
      'Advanced analytics',
      'Early access to jobs',
    ],
    leadsPerMonth: 'unlimited',
    featuredListings: true,
    prioritySupport: true,
    verifiedBadge: false,
    portfolioPhotos: 20,
    responseTime: '24 hours',
    recommended: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 79,
    annualPrice: 790,
    currency: 'CAD',
    interval: 'month',
    features: [
      'Unlimited job requests',
      'Top placement in search results',
      '"Elite Pro" badge on profile',
      'Dedicated support',
      'Advanced analytics & insights',
      'Instant job notifications',
      'Custom branding options',
    ],
    leadsPerMonth: 'unlimited',
    featuredListings: true,
    prioritySupport: true,
    verifiedBadge: true,
    portfolioPhotos: 999,
    responseTime: '1 hour',
  },
];

export const PAY_PER_LEAD_PRICE = 12;

export interface LeadPurchase {
  id: string;
  jobId: string;
  traderId: string;
  amount: number;
  purchaseDate: Date;
  status: 'completed' | 'pending' | 'failed';
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
  leadsUsed: number;
  leadsRemaining: number | 'unlimited';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}
