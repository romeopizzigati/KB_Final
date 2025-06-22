// Imports
// External
import { SafeAreaView, type ViewProps } from 'react-native';
// Import ViewProps type to allow passing all standard View props

// Custom
import { useThemeColor } from '@/hooks/useThemeColor';


// Define props for ThemedView
export type ThemedViewProps = ViewProps & {
  lightColor?: string; // Optional color override for light theme
  darkColor?: string;  // Optional color override for dark theme
};

// ThemedView component
export function ThemedView({
  style,          // Custom styles passed by caller
  lightColor,     // Optional override for light background
  darkColor,      // Optional override for dark background
  ...otherProps   // All other View props (e.g. accessibility, testID, children)
}: ThemedViewProps) {
  
  // Determine background color using theme and optional overrides
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor }, // Custom overrides (if any)
    'background' // Fallback to default theme background
  );

  return (
    <SafeAreaView
      // Apply background color + any additional styles
      style={[{ backgroundColor }, style]}
      {...otherProps} // Spread the rest of the props (e.g. children)
    />
  );
}

