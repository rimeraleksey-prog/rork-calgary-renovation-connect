import { router } from 'expo-router';
import { Alert, Platform } from 'react-native';

const __DEV__ = process.env.NODE_ENV === 'development';

export type NavigationAction =
  | { type: 'navigate'; route: string }
  | { type: 'replace'; route: string }
  | { type: 'back' }
  | { type: 'custom'; handler: () => void };

interface ButtonPressConfig {
  action?: NavigationAction;
  label?: string;
  onError?: () => void;
}

const VALID_ROUTES = [
  '/',
  '/(customer-tabs)/home',
  '/(customer-tabs)/browse',
  '/(customer-tabs)/my-jobs',
  '/(customer-tabs)/messages',
  '/(customer-tabs)/profile',
  '/(trader-tabs)/dashboard',
  '/(trader-tabs)/job-board',
  '/(trader-tabs)/messages',
  '/(trader-tabs)/profile',
  '/(trader-tabs)/subscription',
  '/(customer)/contractor/[id]',
  '/(customer)/post-job',
  '/(trader)/profile',
  '/(trader)/subscription-plans',
  '/(trader)/subscription-dashboard',
  '/settings',
  '/my-profile',
] as const;

function isValidRoute(route: string): boolean {
  if (VALID_ROUTES.includes(route as any)) {
    return true;
  }
  
  if (route.includes('[id]')) {
    const baseRoute = route.split('[')[0];
    return VALID_ROUTES.some(validRoute => validRoute.includes('[id]') && validRoute.startsWith(baseRoute));
  }
  
  return false;
}

function showFeatureNotAvailable(label?: string) {
  const message = label 
    ? `"${label}" is not available yet.`
    : 'This feature is not available yet.';
  
  if (Platform.OS === 'web') {
    alert(message);
  } else {
    Alert.alert('Not Available', message, [{ text: 'OK' }]);
  }
}

function logNavigationError(action: NavigationAction, label?: string) {
  if (__DEV__) {
    const actionType = action.type === 'navigate' || action.type === 'replace' 
      ? `${action.type}:${action.route}` 
      : action.type;
    
    console.warn(`[Navigation Handler] Invalid button configuration:`, {
      action: actionType,
      label: label || 'Unlabeled button',
      timestamp: new Date().toISOString(),
    });
  }
}

export function handleButtonPress(config: ButtonPressConfig): () => void {
  return () => {
    const { action, label, onError } = config;

    if (!action) {
      if (__DEV__) {
        console.error(`[Navigation Handler] Button "${label || 'Unknown'}" has no action defined`);
      }
      showFeatureNotAvailable(label);
      onError?.();
      return;
    }

    try {
      switch (action.type) {
        case 'navigate':
          if (!isValidRoute(action.route)) {
            logNavigationError(action, label);
            showFeatureNotAvailable(label);
            onError?.();
            return;
          }
          console.log(`[Navigation] Navigating to: ${action.route}`);
          router.push(action.route as any);
          break;

        case 'replace':
          if (!isValidRoute(action.route)) {
            logNavigationError(action, label);
            showFeatureNotAvailable(label);
            onError?.();
            return;
          }
          console.log(`[Navigation] Replacing with: ${action.route}`);
          router.replace(action.route as any);
          break;

        case 'back':
          console.log(`[Navigation] Going back`);
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
          break;

        case 'custom':
          console.log(`[Navigation] Executing custom handler`);
          action.handler();
          break;

        default:
          if (__DEV__) {
            console.error(`[Navigation Handler] Unknown action type for "${label}"`);
          }
          showFeatureNotAvailable(label);
          onError?.();
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`[Navigation Handler] Error handling button press:`, {
          label,
          action,
          error,
        });
      }
      showFeatureNotAvailable(label);
      onError?.();
    }
  };
}

export function createNavigateAction(route: string): NavigationAction {
  return { type: 'navigate', route };
}

export function createReplaceAction(route: string): NavigationAction {
  return { type: 'replace', route };
}

export function createBackAction(): NavigationAction {
  return { type: 'back' };
}

export function createCustomAction(handler: () => void): NavigationAction {
  return { type: 'custom', handler };
}

export function debugButtonWithoutAction(componentName: string, buttonLabel: string) {
  if (__DEV__) {
    console.warn(`[Navigation Debug] Component "${componentName}" has button "${buttonLabel}" without valid action`);
  }
}

export { VALID_ROUTES };
