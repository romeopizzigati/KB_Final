// Imports
// External
import { Text, type TextProps } from 'react-native';
// Import Text from React Native + its props type

// Custom
import { styles } from '@/components/ui/Styles';
import { useThemeColor } from '@/hooks/useThemeColor';

/* Define the props for ThemedText */
export type ThemedTextProps = TextProps & {
  lightColor?: string;  // Optional color override for light theme
  darkColor?: string;   // Optional color override for dark theme
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'label';
  // Text style type (default is 'default')
};

// === ThemedText component ===
export function ThemedText({
  style,          // Custom style passed by the caller
  lightColor,     // Light mode override
  darkColor,      // Dark mode override
  type = 'default', // Default style type is 'default'
  ...rest         // Other Text props (e.g. onPress, numberOfLines)
}: ThemedTextProps) {
  
  // Get the correct color depending on theme + overrides
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      // Combine styles together:
      style={[
        { color }, // Always apply computed color

        // Apply specific style based on 'type' prop
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'label' ? styles.label : undefined,

        style, // Apply any custom style passed by caller
      ]}
      {...rest} // Spread remaining props (e.g. accessibilityLabel, onPress)
    />
  );
}
