import { StyleSheet, Text, View, TouchableOpacity, Platform, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { ProjectType, BudgetRange, Timeline, City, Job, HandymanService, CleaningService } from '@/types';
import Colors from '@/constants/colors';

const PROJECT_TYPES: ProjectType[] = [
  'Kitchen Renovation',
  'Bathroom Renovation',
  'Basement Finishing',
  'Room Addition',
  'Roofing',
  'Flooring',
  'Painting',
  'Electrical Work',
  'Plumbing',
  'HVAC',
  'Landscaping',
  'General Repairs',
  'Handyman Services',
  'Cleaning Services',
  'Other',
];

const BUDGET_RANGES: BudgetRange[] = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Over $100,000',
];

const TIMELINES: Timeline[] = [
  'ASAP',
  'Within 1 month',
  '1-3 months',
  '3-6 months',
  'Flexible',
];

const CITIES: City[] = [
  'Calgary',
  'Edmonton',
  'Red Deer',
  'Lethbridge',
  'Medicine Hat',
  'Grande Prairie',
  'Airdrie',
  'Spruce Grove',
  'Leduc',
  'Fort McMurray',
];

const HANDYMAN_SERVICES: HandymanService[] = [
  'Furniture Assembly',
  'TV Mounting',
  'Drywall Patching',
  'Minor Plumbing Repairs',
  'Minor Electrical Fixes',
  'Door Repair',
  'Lock Installation',
  'Caulking',
  'Shelf Installation',
];

const CLEANING_SERVICES: CleaningService[] = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move-in/out Cleaning',
  'Post-renovation Cleaning',
  'Airbnb Turnover',
  'Carpet Cleaning',
];

export default function PostJobScreen() {
  const { addJob } = useApp();
  const [projectType, setProjectType] = useState<ProjectType | ''>('');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState<BudgetRange | ''>('');
  const [timeline, setTimeline] = useState<Timeline | ''>('');
  const [city, setCity] = useState<City | ''>('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  
  const [selectedHandymanServices, setSelectedHandymanServices] = useState<HandymanService[]>([]);
  const [handymanUrgency, setHandymanUrgency] = useState<'Low' | 'Medium' | 'Urgent' | ''>('');
  
  const [selectedCleaningServices, setSelectedCleaningServices] = useState<CleaningService[]>([]);
  const [numberOfRooms, setNumberOfRooms] = useState('');
  const [squareFootage, setSquareFootage] = useState('');
  
  const isHandymanJob = projectType === 'Handyman Services';
  const isCleaningJob = projectType === 'Cleaning Services';

  const toggleHandymanService = (service: HandymanService) => {
    setSelectedHandymanServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };
  
  const toggleCleaningService = (service: CleaningService) => {
    setSelectedCleaningServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    if (!projectType || !description || !budgetRange || !timeline || !city || !address) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    if (isHandymanJob) {
      if (selectedHandymanServices.length === 0) {
        Alert.alert('Missing Information', 'Please select at least one handyman service');
        return;
      }
      if (!handymanUrgency) {
        Alert.alert('Missing Information', 'Please select level of urgency');
        return;
      }
    }
    
    if (isCleaningJob) {
      if (selectedCleaningServices.length === 0) {
        Alert.alert('Missing Information', 'Please select at least one cleaning service');
        return;
      }
      if (!numberOfRooms && !squareFootage) {
        Alert.alert('Missing Information', 'Please enter number of rooms or square footage');
        return;
      }
    }

    let jobDescription = description;
    
    if (isHandymanJob) {
      jobDescription += `\n\nServices: ${selectedHandymanServices.join(', ')}`;
      jobDescription += `\nUrgency: ${handymanUrgency}`;
    }
    
    if (isCleaningJob) {
      jobDescription += `\n\nServices: ${selectedCleaningServices.join(', ')}`;
      if (numberOfRooms) jobDescription += `\nNumber of rooms: ${numberOfRooms}`;
      if (squareFootage) jobDescription += `\nSquare footage: ${squareFootage} sq ft`;
    }

    const newJob: Job = {
      id: `j${Date.now()}`,
      customerId: 'current-user',
      customerName: 'You',
      projectType: projectType as ProjectType,
      description: jobDescription,
      photos: [],
      budgetRange: budgetRange as BudgetRange,
      timeline: timeline as Timeline,
      community: 'All',
      city: city as City,
      region: region || undefined,
      address,
      postedDate: new Date(),
      status: 'open',
      ...(isHandymanJob && {
        tradeCategory: 'Handyman Services',
      }),
      ...(isCleaningJob && {
        tradeCategory: 'Cleaning Services',
      }),
    };

    addJob(newJob);
    Alert.alert('Success', 'Your job has been posted! Contractors will start sending quotes soon.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.label}>Project Type *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {PROJECT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, projectType === type && styles.chipActive]}
                  onPress={() => setProjectType(type)}
                >
                  <Text style={[styles.chipText, projectType === type && styles.chipTextActive]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {isHandymanJob && (
            <View style={styles.section}>
              <Text style={styles.label}>Select Services *</Text>
              <View style={styles.serviceGrid}>
                {HANDYMAN_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceChip,
                      selectedHandymanServices.includes(service) && styles.serviceChipActive,
                    ]}
                    onPress={() => toggleHandymanService(service)}
                  >
                    <Text
                      style={[
                        styles.serviceChipText,
                        selectedHandymanServices.includes(service) && styles.serviceChipTextActive,
                      ]}
                    >
                      {service}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {isHandymanJob && (
            <View style={styles.section}>
              <Text style={styles.label}>Level of Urgency *</Text>
              <View style={styles.grid}>
                {(['Low', 'Medium', 'Urgent'] as const).map((urgency) => (
                  <TouchableOpacity
                    key={urgency}
                    style={[styles.gridItem, handymanUrgency === urgency && styles.gridItemActive]}
                    onPress={() => setHandymanUrgency(urgency)}
                  >
                    <Text
                      style={[
                        styles.gridItemText,
                        handymanUrgency === urgency && styles.gridItemTextActive,
                      ]}
                    >
                      {urgency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {isCleaningJob && (
            <View style={styles.section}>
              <Text style={styles.label}>Select Cleaning Services *</Text>
              <View style={styles.serviceGrid}>
                {CLEANING_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service}
                    style={[
                      styles.serviceChip,
                      selectedCleaningServices.includes(service) && styles.serviceChipActive,
                    ]}
                    onPress={() => toggleCleaningService(service)}
                  >
                    <Text
                      style={[
                        styles.serviceChipText,
                        selectedCleaningServices.includes(service) && styles.serviceChipTextActive,
                      ]}
                    >
                      {service}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {isCleaningJob && (
            <View style={styles.section}>
              <Text style={styles.label}>Property Details *</Text>
              <View style={styles.inputRow}>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Number of Rooms</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 3"
                    value={numberOfRooms}
                    onChangeText={setNumberOfRooms}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <Text style={styles.inputLabel}>Square Footage</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., 1200"
                    value={squareFootage}
                    onChangeText={setSquareFootage}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.grayLight}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your project in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Budget Range *</Text>
            <View style={styles.grid}>
              {BUDGET_RANGES.map((range) => (
                <TouchableOpacity
                  key={range}
                  style={[styles.gridItem, budgetRange === range && styles.gridItemActive]}
                  onPress={() => setBudgetRange(range)}
                >
                  <Text style={[styles.gridItemText, budgetRange === range && styles.gridItemTextActive]}>
                    {range}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Timeline *</Text>
            <View style={styles.grid}>
              {TIMELINES.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[styles.gridItem, timeline === time && styles.gridItemActive]}
                  onPress={() => setTimeline(time)}
                >
                  <Text style={[styles.gridItemText, timeline === time && styles.gridItemTextActive]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>City *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
              {CITIES.map((cityOption) => (
                <TouchableOpacity
                  key={cityOption}
                  style={[styles.chip, city === cityOption && styles.chipActive]}
                  onPress={() => setCity(cityOption)}
                >
                  <Text style={[styles.chipText, city === cityOption && styles.chipTextActive]}>
                    {cityOption}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Region / Neighborhood (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., NW, Downtown, Riverbend"
              value={region}
              onChangeText={setRegion}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor={Colors.grayLight}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Photos (Optional)</Text>
            <TouchableOpacity style={styles.photoButton}>
              <Camera size={24} color={Colors.deepBlue} />
              <Text style={styles.photoButtonText}>Add Photos</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Post Job</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  chipScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  chip: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  chipActive: {
    backgroundColor: Colors.deepBlue,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  textArea: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    height: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  gridItemActive: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
  },
  gridItemText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  gridItemTextActive: {
    color: Colors.white,
  },
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  communityItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.offWhite,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  communityItemActive: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
  },
  communityItemText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  communityItemTextActive: {
    color: Colors.white,
  },
  photoButton: {
    backgroundColor: Colors.offWhite,
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.deepBlue,
  },
  submitButton: {
    backgroundColor: Colors.orange,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.orange,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
      } as any,
    }),
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceChip: {
    backgroundColor: Colors.offWhite,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  serviceChipActive: {
    backgroundColor: Colors.deepBlue,
    borderColor: Colors.deepBlue,
  },
  serviceChipText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
  },
  serviceChipTextActive: {
    color: Colors.white,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
});
