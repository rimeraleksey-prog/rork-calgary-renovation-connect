export type UserRole = 'customer' | 'trader' | null;

export type TradeCategory = 
  | 'General Contractor'
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Painter'
  | 'Roofer'
  | 'HVAC'
  | 'Flooring'
  | 'Landscaping'
  | 'Kitchen & Bath';

export type Community = 'NE' | 'NW' | 'SE' | 'SW' | 'All';

export type City = 
  | 'Calgary'
  | 'Edmonton'
  | 'Red Deer'
  | 'Lethbridge'
  | 'Medicine Hat'
  | 'Grande Prairie'
  | 'Airdrie'
  | 'Spruce Grove'
  | 'Leduc'
  | 'Fort McMurray'
  | 'Camrose'
  | 'Brooks'
  | 'Lloydminster';

export type ExperienceLevel = 'Entry' | 'Intermediate' | 'Expert';

export type PriceRating = '$' | '$$' | '$$$';

export interface Trader {
  id: string;
  businessName: string;
  ownerName: string;
  category: TradeCategory;
  serviceAreas: Community[];
  serviceCities: City[];
  serviceRegions?: string;
  city?: City;
  experience: ExperienceLevel;
  certifications: string[];
  insured: boolean;
  portfolioImages: string[];
  description: string;
  priceRating: PriceRating;
  rating: number;
  reviewCount: number;
  verified: boolean;
  yearsInBusiness: number;
  phone: string;
  email: string;
  subscriptionTier?: 'basic' | 'pro' | 'elite';
  isFeatured?: boolean;
  job_responses_count?: number;
  auto_renew?: boolean;
  subscription_end_date?: string;
  subscription_status?: 'active' | 'canceled' | 'expired';
  billing_cycle?: 'monthly' | 'annual';
  referral_code?: string;
  referred_by?: string;
  referral_credits?: number;
}

export type ProjectType = 
  | 'Kitchen Renovation'
  | 'Bathroom Renovation'
  | 'Basement Finishing'
  | 'Room Addition'
  | 'Roofing'
  | 'Flooring'
  | 'Painting'
  | 'Electrical Work'
  | 'Plumbing'
  | 'HVAC'
  | 'Landscaping'
  | 'General Repairs'
  | 'Other';

export type BudgetRange = 
  | 'Under $5,000'
  | '$5,000 - $10,000'
  | '$10,000 - $25,000'
  | '$25,000 - $50,000'
  | '$50,000 - $100,000'
  | 'Over $100,000';

export type Timeline = 
  | 'ASAP'
  | 'Within 1 month'
  | '1-3 months'
  | '3-6 months'
  | 'Flexible';

export interface Job {
  id: string;
  customerId: string;
  customerName: string;
  projectType: ProjectType;
  description: string;
  photos: string[];
  budgetRange: BudgetRange;
  timeline: Timeline;
  community: Community;
  city: City;
  region?: string;
  address: string;
  postedDate: Date;
  status: 'open' | 'quoted' | 'in-progress' | 'completed';
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  community?: Community;
  city?: City;
  region?: string;
}

export interface UnlockedLead {
  jobId: string;
  traderId: string;
  unlockedAt: Date;
  amount: number;
}
