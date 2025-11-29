import { router } from 'expo-router';
import { UserRole } from '@/types';

export function navigateToHome(userRole: UserRole) {
  console.log('Navigating to home for role:', userRole);
  
  if (!userRole) {
    router.replace('/');
    return;
  }

  if (userRole === 'customer') {
    router.replace('/(customer-tabs)/home');
    return;
  }

  if (userRole === 'trader') {
    router.replace('/(trader-tabs)/dashboard');
    return;
  }

  router.replace('/');
}

export function getHomeRoute(userRole: UserRole): string {
  if (!userRole) {
    return '/';
  }

  if (userRole === 'customer') {
    return '/(customer-tabs)/home';
  }

  if (userRole === 'trader') {
    return '/(trader-tabs)/dashboard';
  }

  return '/';
}
