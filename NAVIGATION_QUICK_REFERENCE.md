# Navigation Handler Quick Reference

## Import
```typescript
// Recommended: Use SafeButton component
import { SafeButton, createNavigateAction, createBackAction, createCustomAction } from '@/components/SafeButton';

// Or use handler directly
import { handleButtonPress, createNavigateAction } from '@/lib/navigation-handler';
```

## Common Patterns

### Navigate to Screen
```typescript
<SafeButton 
  action={createNavigateAction('/settings')} 
  label="Settings"
>
  <Text>Settings</Text>
</SafeButton>
```

### Back Button
```typescript
<SafeButton 
  action={createBackAction()} 
  label="Back"
>
  <ArrowLeft size={24} />
</SafeButton>
```

### Save/Submit Button
```typescript
<SafeButton 
  action={createCustomAction(handleSave)} 
  label="Save Profile"
>
  <Text>Save Profile</Text>
</SafeButton>
```

### Coming Soon Feature
```typescript
<SafeButton label="Premium Feature">
  <Text>Premium</Text>
</SafeButton>
```

## When to Use What

| Action Type | Use Case | Example |
|------------|----------|---------|
| `createNavigateAction` | Go to a new screen | Settings, Profile, Details |
| `createReplaceAction` | Replace current screen | Login → Home, Onboarding |
| `createBackAction` | Go back | Back buttons, Cancel |
| `createCustomAction` | Custom logic | Save, Delete, API calls |
| No action | Coming soon | Features not implemented yet |

## Error Handling

The handler automatically:
- ✅ Validates routes before navigation
- ✅ Shows "Not available yet" for missing features
- ✅ Logs errors in development mode
- ✅ Never fails silently

## Development Tips

### Check Console for Warnings
```
[Navigation Handler] Button "Language Settings" has no action defined
```

### Test Your Buttons
1. Press every button in your screen
2. Verify navigation or message appears
3. Check console for warnings

### Add New Route
1. Create screen file
2. Add to `VALID_ROUTES` in `lib/navigation-handler.ts`
3. Register in `app/_layout.tsx`
4. Use in buttons

## Complete Example

```typescript
import { SafeButton, createNavigateAction, createBackAction } from '@/components/SafeButton';

export default function MyScreen() {
  return (
    <View>
      {/* Back button */}
      <SafeButton action={createBackAction()} label="Back">
        <ArrowLeft size={24} />
      </SafeButton>

      {/* Navigate to settings */}
      <SafeButton 
        action={createNavigateAction('/settings')} 
        label="Settings"
        style={styles.button}
      >
        <Text>Settings</Text>
      </SafeButton>

      {/* Coming soon feature */}
      <SafeButton label="Premium Features" style={styles.button}>
        <Text>Premium</Text>
      </SafeButton>
    </View>
  );
}
```

## All Valid Routes

```
/
/(customer-tabs)/home
/(customer-tabs)/browse
/(customer-tabs)/my-jobs
/(customer-tabs)/messages
/(customer-tabs)/profile
/(trader-tabs)/dashboard
/(trader-tabs)/job-board
/(trader-tabs)/messages
/(trader-tabs)/profile
/(trader-tabs)/subscription
/(customer)/contractor/[id]
/(customer)/post-job
/(trader)/profile
/(trader)/subscription-plans
/(trader)/subscription-dashboard
/settings
/my-profile
```
