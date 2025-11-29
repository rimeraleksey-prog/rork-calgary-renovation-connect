import { StyleSheet, Text, View, TouchableOpacity, Platform, Modal } from 'react-native';
import { AlertCircle, X, Zap, Crown, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { SubscriptionTier } from '@/constants/subscription';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  requiredTier: SubscriptionTier;
  description: string;
}

export function UpgradePrompt({ visible, onClose, feature, requiredTier, description }: UpgradePromptProps) {
  const handleUpgrade = () => {
    onClose();
    router.push('/(trader)/subscription-plans' as any);
  };

  const getIcon = () => {
    switch (requiredTier) {
      case 'pro':
        return <Zap size={48} color="#FF6B35" />;
      case 'elite':
        return <Crown size={48} color="#FFD700" />;
      default:
        return <TrendingUp size={48} color={Colors.deepBlue} />;
    }
  };

  const tierName = requiredTier === 'pro' ? 'Pro' : 'Elite';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            {getIcon()}
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Upgrade to {tierName}</Text>
            <Text style={styles.subtitle}>{feature}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Text style={styles.upgradeButtonText}>View Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface LeadUnlockPromptProps {
  visible: boolean;
  onClose: () => void;
  onUnlock: () => void;
  onUpgrade: () => void;
  price: number;
  canUseSubscription: boolean;
}

export function LeadUnlockPrompt({ 
  visible, 
  onClose, 
  onUnlock, 
  onUpgrade,
  price,
  canUseSubscription 
}: LeadUnlockPromptProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.iconContainer, styles.iconContainerWarning]}>
            <AlertCircle size={48} color="#FF6B35" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Unlock This Lead</Text>
            <Text style={styles.description}>
              {canUseSubscription 
                ? 'View full job details and contact information to submit your quote.'
                : 'You\'ve used all your free leads this month. Unlock this lead or upgrade your plan.'}
            </Text>
          </View>

          <View style={styles.actions}>
            {canUseSubscription ? (
              <TouchableOpacity style={styles.upgradeButton} onPress={onUnlock}>
                <Text style={styles.upgradeButtonText}>Use 1 Lead Credit</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.upgradeButton} onPress={onUnlock}>
                  <Text style={styles.upgradeButtonText}>Unlock for ${price} CAD</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={onUpgrade}>
                  <Text style={styles.secondaryButtonText}>Upgrade Plan Instead</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

interface LimitReachedPromptProps {
  visible: boolean;
  onClose: () => void;
  onViewPlans: () => void;
  responsesUsed: number;
  maxResponses: number;
}

export function LimitReachedPrompt({ 
  visible, 
  onClose, 
  onViewPlans,
  responsesUsed,
  maxResponses 
}: LimitReachedPromptProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.iconContainer, styles.iconContainerWarning]}>
            <AlertCircle size={48} color="#FF6B35" />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>You&apos;ve reached your free limit</Text>
            <Text style={styles.description}>
              On the Basic plan you can respond to up to {maxResponses} job requests. You&apos;ve used all {responsesUsed} available responses.
            </Text>
            <Text style={[styles.description, { marginTop: 12 }]}>
              Upgrade to Pro or Elite to unlock unlimited job responses and higher visibility.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.upgradeButton} onPress={onViewPlans}>
              <Text style={styles.upgradeButtonText}>View Plans</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
      } as any,
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  iconContainerWarning: {
    backgroundColor: '#FFF4E6',
  },
  content: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.deepBlue,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    gap: 12,
  },
  upgradeButton: {
    backgroundColor: Colors.deepBlue,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
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
  upgradeButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  secondaryButton: {
    backgroundColor: Colors.offWhite,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.deepBlue,
    fontSize: 17,
    fontWeight: '700' as const,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
