import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import { Hourglass, Info, PlusCircle } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>

<Tabs.Screen
  name="addTab"
  options={{
    title: 'Add ingredient 🥑',
    tabBarIcon: ({ color }) => (
      <PlusCircle size={28} color={color} />
    ),
  }}
/>

<Tabs.Screen
  name="expiringTab"
  options={{
    title: 'Expiring SOON 🏃‍♂️',
    tabBarIcon: ({ color }) => (
      <Hourglass size={28} color={color} />
    ),
  }}
/>

<Tabs.Screen
  name="infoTab"
  options={{
    title: 'Info ℹ️',
    tabBarIcon: ({ color }) => (
      <Info size={28} color={color} />
    ),
  }}
/>

  

    </Tabs>
  );
}
