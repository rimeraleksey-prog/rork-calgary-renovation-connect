import { StyleSheet, Text, View, TouchableOpacity, Platform, TextInput, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Search, Filter, Star, MapPin, Heart, Crown, ArrowLeft } from 'lucide-react-native';
import { useFilteredTraders, useApp } from '@/contexts/AppContext';
import { TradeCategory, Community, PriceRating } from '@/types';
import Colors from '@/constants/colors';

export default function BrowseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<TradeCategory | 'All'>('All');
  const [community, setCommunity] = useState<Community>('All');
  const [priceRating, setPriceRating] = useState<PriceRating | 'All'>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories: (TradeCategory | 'All')[] = [
    'All',
    'General Contractor',
    'Electrician',
    'Plumber',
    'Carpenter',
    'Painter',
    'Roofer',
    'HVAC',
    'Flooring',
  ];

  const communities: Community[] = ['All', 'NE', 'NW', 'SE', 'SW'];
  const priceRatings: (PriceRating | 'All')[] = ['All', '$', '$$', '$$$'];

  const hasActiveFilters = category !== 'All' || community !== 'All' || priceRating !== 'All';

  const clearFilters = () => {
    setCategory('All');
    setCommunity('All');
    setPriceRating('All');
  };

  const traders = useFilteredTraders(searchQuery, category, community, priceRating, verifiedOnly);
  const { favoriteTraders, toggleFavorite } = useApp();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(customer-tabs)/home' as any)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Find a Pro</Text>
        </View>
        <TouchableOpacity 
          style={styles.postJobButton}
          onPress={() => router.push('/(customer)/post-job' as any)}
        >
          <Text style={styles.postJobButtonText}>Post a Job</Text>
        </TouchableOpacity>
      </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={Colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contractors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.grayLight}
            />
          </View>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, verifiedOnly && styles.filterChipActive]}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
          >
            <Text style={[styles.filterChipText, verifiedOnly && styles.filterChipTextActive]}>
              ✓ Verified Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterChip, hasActiveFilters && styles.filterChipActive]}
            onPress={() => setShowFilters(true)}
          >
            <Filter size={16} color={hasActiveFilters ? Colors.white : Colors.graphite} />
            <Text style={[styles.filterChipText, hasActiveFilters && styles.filterChipTextActive]}>
              Filters {hasActiveFilters && `(${[category !== 'All', community !== 'All', priceRating !== 'All'].filter(Boolean).length})`}
            </Text>
          </TouchableOpacity>

          {hasActiveFilters && (
            <TouchableOpacity 
              style={styles.clearFiltersButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.listContent}>
            <Text style={styles.resultCount}>{traders.length} professionals found</Text>
            
            {traders.map((trader) => (
              <TouchableOpacity
                key={trader.id}
                style={styles.card}
                onPress={() => router.push(`/(customer)/contractor/${trader.id}` as any)}
                activeOpacity={0.8}
              >
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: trader.portfolioImages[0] }}
                    style={styles.cardImage}
                    contentFit="cover"
                  />
                  {trader.subscriptionTier === 'elite' && (
                    <View style={styles.eliteBadge}>
                      <Crown size={12} color="#FFD700" />
                      <Text style={styles.eliteBadgeText}>ELITE PRO</Text>
                    </View>
                  )}
                  {trader.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedBadgeText}>✓ VERIFIED</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(trader.id);
                    }}
                  >
                    <Heart
                      size={20}
                      color={favoriteTraders.includes(trader.id) ? Colors.orange : Colors.white}
                      fill={favoriteTraders.includes(trader.id) ? Colors.orange : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.businessName}>{trader.businessName}</Text>
                      <Text style={styles.category}>{trader.category}</Text>
                    </View>
                    <View style={styles.priceRating}>
                      <Text style={styles.priceRatingText}>{trader.priceRating}</Text>
                    </View>
                  </View>

                  <View style={styles.cardStats}>
                    <View style={styles.stat}>
                      <Star size={16} color={Colors.orange} fill={Colors.orange} />
                      <Text style={styles.statText}>
                        {trader.rating} ({trader.reviewCount})
                      </Text>
                    </View>

                    <View style={styles.stat}>
                      <MapPin size={16} color={Colors.gray} />
                      <Text style={styles.statText}>
                        {trader.serviceAreas.join(', ')}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.description} numberOfLines={2}>
                    {trader.description}
                  </Text>

                  <View style={styles.cardFooter}>
                    <Text style={styles.experience}>
                      {trader.yearsInBusiness} years experience
                    </Text>
                    {trader.insured && (
                      <View style={styles.insuredBadge}>
                        <Text style={styles.insuredBadgeText}>Insured</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Modal
          visible={showFilters}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowFilters(false)}
        >
          <SafeAreaView style={styles.modalContainer} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.modalClose}>Done</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Trade Category</Text>
                <View style={styles.filterOptions}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.filterOption,
                        category === cat && styles.filterOptionActive,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          category === cat && styles.filterOptionTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Community</Text>
                <View style={styles.filterOptions}>
                  {communities.map((comm) => (
                    <TouchableOpacity
                      key={comm}
                      style={[
                        styles.filterOption,
                        community === comm && styles.filterOptionActive,
                      ]}
                      onPress={() => setCommunity(comm)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          community === comm && styles.filterOptionTextActive,
                        ]}
                      >
                        {comm === 'All' ? 'All Areas' : comm}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptions}>
                  {priceRatings.map((price) => (
                    <TouchableOpacity
                      key={price}
                      style={[
                        styles.filterOption,
                        priceRating === price && styles.filterOptionActive,
                      ]}
                      onPress={() => setPriceRating(price)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          priceRating === price && styles.filterOptionTextActive,
                        ]}
                      >
                        {price}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {hasActiveFilters && (
                <TouchableOpacity
                  style={styles.clearAllButton}
                  onPress={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                >
                  <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  postJobButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  postJobButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  filters: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    maxHeight: 56,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.deepBlue,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.graphite,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  clearFiltersButton: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  clearFiltersText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.orange,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
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
  cardImageContainer: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  eliteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  eliteBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    padding: 16,
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
  businessName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.deepBlue,
    fontWeight: '600' as const,
  },
  priceRating: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceRatingText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  cardStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experience: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  insuredBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  insuredBadgeText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600' as const,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.deepBlue,
  },
  modalContent: {
    flex: 1,
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterOptionActive: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  filterOptionTextActive: {
    color: Colors.white,
  },
  clearAllButton: {
    margin: 20,
    backgroundColor: Colors.offWhite,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  clearAllButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.orange,
  },
});
