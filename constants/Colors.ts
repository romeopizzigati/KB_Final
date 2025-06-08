/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#D97706'; // warm orange
const tintColorDark = '#FCD34D';  // light amber

export const Colors = {
  light: {
    text: '#3B2F2F',              // dark brown
    background: '#FFF8F0',         // soft cream
    tint: tintColorLight,
    icon: '#6B4226',               // medium brown
    tabIconDefault: '#A47551',     // light brown
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F5F3E7',               // light beige
    background: '#2E2A25',         // deep brown
    tint: tintColorDark,
    icon: '#B8A17A',               // muted tan
    tabIconDefault: '#8C6E54',     // brownish gray
    tabIconSelected: tintColorDark,
  },
};

export const Theme = {
  primary: '#D97706',              // orange
  secondary: '#A16207',            // darker orange-gold
  success: '#4CAF50',              // natural green
  danger: '#A42A04',               // earthy red
  white: '#FFFFFF',
  black: '#1C1C1C',
  gray: '#B5AFA4',                 // earthy gray
  link: '#B45309',                 // rustic orange
  green: '#3F6212',                // olive green
};