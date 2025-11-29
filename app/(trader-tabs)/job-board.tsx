import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { MapPin, DollarSign, Clock, Lock, Crown, Zap, Filter } from 'lucide-react-native';
import { useFilteredJobs, useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { TradeCategory, Community, HandymanComplexity, CleaningType } from '@/types';
import { LeadUnlockPrompt, LimitReachedPrompt } from '@/components/UpgradePrompts';
import { PAY_PER_LEAD_PRICE } from '@/constants/subscription';
import Colors from '@/constants/colors';

export default function JobBoardScreen() {
  const [category, setCategory] = useState<TradeCategory | 'All'>('All');
  const [community] = useState<Community>('All');
  const [handymanComplexity, setHandymanComplexity] = useState<HandymanComplexity | 'All'>('All');
  const [cleaningType, setCleaningType] = useState<CleaningType | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const jobs = useFilteredJobs(category, community, 0, handymanComplexity, cleaningType);
  const { isLeadUnlocked, canRespondToJob, recordJobResponse, myTraderProfile } = useApp();
  const { canAccessLeads, remainingLeads, purchaseLead, currentPlan } = useSubscription();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [showLimitReachedPrompt, setShowLimitReachedPrompt] = useState(false);

  const formatDate = (date: Date) => {
    const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const handleJobPress = (jobId: string) => {
    if (isLeadUnlocked(jobId)) {
      Alert.alert('Lead Unlocked', 'This lead has been unlocked! Contact details are available.');
      return;
    }

    if (!canRespondToJob()) {
      setShowLimitReachedPrompt(true);
      return;
    }

    setSelectedJobId(jobId);
    setShowUnlockPrompt(true);
  };

  const handleUnlockLead = async () => {
    if (!selectedJobId) return;
    setShowUnlockPrompt(false);
    await purchaseLead(selectedJobId);
    await recordJobResponse();
    setSelectedJobId(null);
  };

  const handleUpgradePlan = () => {
    setShowUnlockPrompt(false);
    router.push('/(trader)/subscription-plans' as any);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Job Board</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} color={Colors.deepBlue} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.subscriptionButton}
              onPress={() => router.push('/(trader-tabs)/subscription' as any)}
            >
              {currentPlan?.id === 'elite' ? (
                <Crown size={18} color="#FFD700" />
              ) : currentPlan?.id === 'pro' ? (
                <Zap size={18} color={Colors.orange} />
              ) : null}
              <Text style={styles.subscriptionButtonText}>
                {remainingLeads === 'unlimited' ? '∞' : remainingLeads} leads
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showFilters && (
          <View style={styles.filtersContainer}>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                <TouchableOpacity
                  style={[styles.chip, category === 'All' && styles.chipActive]}
                  onPress={() => setCategory('All')}
                >
                  <Text style={[styles.chipText, category === 'All' && styles.chipTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chip, category === 'Handyman Services' && styles.chipActive]}
                  onPress={() => setCategory('Handyman Services')}
                >
                  <Text style={[styles.chipText, category === 'Handyman Services' && styles.chipTextActive]}>Handyman</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chip, category === 'Cleaning Services' && styles.chipActive]}
                  onPress={() => setCategory('Cleaning Services')}
                >
                  <Text style={[styles.chipText, category === 'Cleaning Services' && styles.chipTextActive]}>Cleaning</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {category === 'Handyman Services' && (
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Complexity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                  <TouchableOpacity
                    style={[styles.chip, handymanComplexity === 'All' && styles.chipActive]}
                    onPress={() => setHandymanComplexity('All')}
                  >
                    <Text style={[styles.chipText, handymanComplexity === 'All' && styles.chipTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, handymanComplexity === 'Small Fix' && styles.chipActive]}
                    onPress={() => setHandymanComplexity('Small Fix')}
                  >
                    <Text style={[styles.chipText, handymanComplexity === 'Small Fix' && styles.chipTextActive]}>Small Fix</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, handymanComplexity === 'Medium Repair' && styles.chipActive]}
                    onPress={() => setHandymanComplexity('Medium Repair')}
                  >
                    <Text style={[styles.chipText, handymanComplexity === 'Medium Repair' && styles.chipTextActive]}>Medium Repair</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, handymanComplexity === 'Large Task' && styles.chipActive]}
                    onPress={() => setHandymanComplexity('Large Task')}
                  >
                    <Text style={[styles.chipText, handymanComplexity === 'Large Task' && styles.chipTextActive]}>Large Task</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}

            {category === 'Cleaning Services' && (
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChips}>
                  <TouchableOpacity
                    style={[styles.chip, cleaningType === 'All' && styles.chipActive]}
                    onPress={() => setCleaningType('All')}
                  >
                    <Text style={[styles.chipText, cleaningType === 'All' && styles.chipTextActive]}>All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, cleaningType === 'Standard' && styles.chipActive]}
                    onPress={() => setCleaningType('Standard')}
                  >
                    <Text style={[styles.chipText, cleaningType === 'Standard' && styles.chipTextActive]}>Standard</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, cleaningType === 'Deep Cleaning' && styles.chipActive]}
                    onPress={() => setCleaningType('Deep Cleaning')}
                  >
                    <Text style={[styles.chipText, cleaningType === 'Deep Cleaning' && styles.chipTextActive]}>Deep Cleaning</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.chip, cleaningType === 'Move-in/Move-out' && styles.chipActive]}
                    onPress={() => setCleaningType('Move-in/Move-out')}
                  >
                    <Text style={[styles.chipText, cleaningType === 'Move-in/Move-out' && styles.chipTextActive]}>Move-in/out</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            <Text style={styles.sectionTitle}>Available Opportunities</Text>
            
            {jobs.map((job) => {
              const unlocked = isLeadUnlocked(job.id);
              return (
                <TouchableOpacity
                  key={job.id}
                  style={[styles.card, !unlocked && styles.cardLocked]}
                  onPress={() => handleJobPress(job.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.projectType}>{job.projectType}</Text>
                      {job.handymanComplexity && (
                        <Text style={styles.jobSubType}>{job.handymanComplexity}</Text>
                      )}
                      {job.cleaningType && (
                        <Text style={styles.jobSubType}>{job.cleaningType}</Text>
                      )}
                      <Text style={styles.customerName}>by {job.customerName}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>NEW</Text>
                    </View>
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {job.description}
                  </Text>

                  <View style={styles.cardDetails}>
                    <View style={styles.detail}>
                      <MapPin size={16} color={Colors.gray} />
                      <Text style={styles.detailText}>{job.address}</Text>
                    </View>

                    <View style={styles.detail}>
                      <DollarSign size={16} color={Colors.gray} />
                      <Text style={styles.detailText}>{job.budgetRange}</Text>
                    </View>

                    <View style={styles.detail}>
                      <Clock size={16} color={Colors.gray} />
                      <Text style={styles.detailText}>{job.timeline}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.postedDate}>
                      Posted {formatDate(job.postedDate)}
                    </Text>
                    {unlocked ? (
                      <TouchableOpacity style={styles.quoteButton}>
                        <Text style={styles.quoteButtonText}>Submit Quote</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.lockButton}>
                        <Lock size={14} color={Colors.textSecondary} />
                        <Text style={styles.lockButtonText}>Unlock Lead</Text>
                      </View>
                    )}
                  </View>

                  {!unlocked && (
                    <View style={styles.lockedOverlay}>
                      <View style={styles.lockedBadge}>
                        <Lock size={16} color={Colors.white} />
                        <Text style={styles.lockedText}>Tap to Unlock</Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <LeadUnlockPrompt
          visible={showUnlockPrompt}
          onClose={() => {
            setShowUnlockPrompt(false);
            setSelectedJobId(null);
          }}
          onUnlock={handleUnlockLead}
          onUpgrade={handleUpgradePlan}
          price={PAY_PER_LEAD_PRICE}
          canUseSubscription={canAccessLeads}
        />

        <LimitReachedPrompt
          visible={showLimitReachedPrompt}
          onClose={() => setShowLimitReachedPrompt(false)}
          onViewPlans={() => {
            setShowLimitReachedPrompt(false);
            router.push('/(trader)/subscription-plans' as any);
          }}
          responsesUsed={myTraderProfile?.job_responses_count || 0}
          maxResponses={3}
        />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 10,
  },
  subscriptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  subscriptionButtonText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
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
  cardLocked: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  projectType: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLighter,
  },
  postedDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  quoteButton: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quoteButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  lockButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: '600' as const,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.deepBlue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(30,58,95,0.3)',
      } as any,
    }),
  },
  lockedText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700' as const,
  },
  filtersContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterRow: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.offWhite,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.deepBlue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  jobSubType: {
    fontSize: 12,
    color: Colors.orange,
    fontWeight: '600' as const,
    marginTop: 2,
  },
});
