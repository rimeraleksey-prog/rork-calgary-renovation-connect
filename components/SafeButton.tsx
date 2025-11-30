import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { handleButtonPress, NavigationAction } from '@/lib/navigation-handler';

interface SafeButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  action?: NavigationAction;
  label?: string;
  onError?: () => void;
  children: React.ReactNode;
}

export function SafeButton({ action, label, onError, children, ...props }: SafeButtonProps) {
  const handler = handleButtonPress({ action, label, onError });
  
  return (
    <TouchableOpacity {...props} onPress={handler}>
      {children}
    </TouchableOpacity>
  );
}

export { 
  createNavigateAction, 
  createReplaceAction, 
  createBackAction, 
  createCustomAction 
} from '@/lib/navigation-handler';
