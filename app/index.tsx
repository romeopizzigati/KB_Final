import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';

// Local imports
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles as localStyles, styles } from "@/components/ui/Styles"; // Renamed to avoid conflict

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("@/assets/images/home-background.jpg")} // Make sure path is correct
      style={styles.background} // Full screen
      resizeMode="cover"
    >
      
      <ThemedView style={localStyles.containerHome}>
        <ThemedText type='title'>Kitchen Buddy 🍽️</ThemedText>
        <ThemedText type='subtitle'>Track your ingredients with ease!</ThemedText>
        <TouchableOpacity 
          style={localStyles.getStartedButton} 
          onPress={() => router.push('/(tabs)/addTab')}
        >
          <ThemedText style={localStyles.buttonText}>Get Started</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ImageBackground>
  );
}

