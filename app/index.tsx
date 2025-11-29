import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Hammer, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  const { setUserRole } = useApp();

  const handleRoleSelection = (role: 'customer' | 'trader') => {
    setUserRole(role);
    if (role === 'customer') {
      router.replace('/(customer)/browse');
    } else {
      router.replace('/(trader)/jobs');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.deepBlueDark, Colors.deepBlue, Colors.graphite]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.logo}>RenoCalgary</Text>
              <Text style={styles.tagline}>Your trusted link to Calgary renovation professionals</Text>
            </View>

            <View style={styles.cardContainer}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleRoleSelection('customer')}
                activeOpacity={0.9}
              >
                <View style={[styles.iconCircle, { backgroundColor: Colors.orange }]}>
                  <User size={40} color={Colors.white} strokeWidth={2.5} />
                </View>
                <Text style={styles.cardTitle}>I&apos;m a Homeowner</Text>
                <Text style={styles.cardDescription}>
                  Find verified renovation professionals and get quotes for your project
                </Text>
                <View style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Get Started</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() => handleRoleSelection('trader')}
                activeOpacity={0.9}
              >
                <View style={[styles.iconCircle, { backgroundColor: Colors.deepBlue }]}>
                  <Hammer size={40} color={Colors.white} strokeWidth={2.5} />
                </View>
                <Text style={styles.cardTitle}>I&apos;m a Professional</Text>
                <Text style={styles.cardDescription}>
                  Connect with homeowners, showcase your work, and grow your business
                </Text>
                <View style={styles.cardButton}>
                  <Text style={styles.cardButtonText}>Get Started</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Serving Calgary Communities</Text>
              <Text style={styles.communities}>NE • NW • SE • SW</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    fontSize: 42,
    fontWeight: '800' as const,
    color: Colors.white,
    letterSpacing: -1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: Colors.white,
    opacity: 0.9,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      } as any,
    }),
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  cardButton: {
    backgroundColor: Colors.graphite,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cardButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 8,
  },
  communities: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.7,
    letterSpacing: 2,
  },
});
