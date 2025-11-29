import { StyleSheet, Text, View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Briefcase, Clock, DollarSign, MapPin } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

export default function MyJobsScreen() {
  const { jobs } = useApp();
  const myJobs = jobs.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return Colors.orange;
      case 'quoted': return '#4CAF50';
      case 'in-progress': return Colors.deepBlue;
      case 'completed': return Colors.gray;
      default: return Colors.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Open';
      case 'quoted': return 'Quoted';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity 
          style={styles.postButton}
          onPress={() => router.push('/(customer)/post-job' as any)}
        >
          <Text style={styles.postButtonText}>+ New Job</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {myJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Briefcase size={48} color={Colors.gray} />
              <Text style={styles.emptyTitle}>No Jobs Yet</Text>
              <Text style={styles.emptyDescription}>
                Post your first renovation job and get quotes from verified professionals
              </Text>
              <TouchableOpacity 
                style={styles.emptyButton}
                onPress={() => router.push('/(customer)/post-job' as any)}
              >
                <Text style={styles.emptyButtonText}>Post a Job</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.jobCard}
                activeOpacity={0.8}
              >
                <View style={styles.jobCardHeader}>
                  <Text style={styles.jobTitle}>{job.projectType}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(job.status)}</Text>
                  </View>
                </View>

                <Text style={styles.jobDescription} numberOfLines={2}>
                  {job.description}
                </Text>

                <View style={styles.jobDetails}>
                  <View style={styles.jobDetail}>
                    <MapPin size={14} color={Colors.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.community}</Text>
                  </View>
                  <View style={styles.jobDetail}>
                    <DollarSign size={14} color={Colors.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.budgetRange}</Text>
                  </View>
                  <View style={styles.jobDetail}>
                    <Clock size={14} color={Colors.textSecondary} />
                    <Text style={styles.jobDetailText}>{job.timeline}</Text>
                  </View>
                </View>

                <View style={styles.jobFooter}>
                  <Text style={styles.jobFooterText}>
                    Posted {Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </Text>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  postButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  postButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  jobCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
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
  jobCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  jobDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobDetailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  jobFooterText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  viewButton: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
