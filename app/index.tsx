// Imports
// External
import { useRouter } from 'expo-router'; // For navigation between screens
import React from 'react';
import { ImageBackground, TouchableOpacity, View } from 'react-native'; // React Native components

// Custom (for themed UI)
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles as localStyles, styles } from "@/components/ui/Styles"; // Styles for UI

export default function HomeScreen() {
  const router = useRouter(); // Hook to NAVIGATE between app screens

  return (
    <ImageBackground
      source={require("@/assets/images/home-background.jpg")}
      style={styles.background} 
      resizeMode="cover" // Ensure image covers entire background
    >
      {/* Overlay for readibility, semi-transparent black backgroung*/}
      <View style={{
        flex: 1, // Take up full space
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20
      }}>
        {/* Main card in center, orange background*/}
        <ThemedView style={{
          backgroundColor: 'rgba(255, 170, 102, 0.5)',
          borderRadius: 20,
          padding: 24, 
          alignItems: 'center', 
          backdropFilter: 'blur(10px)'
        }}>
          {/* Main title text */}
          <ThemedText 
            type='title' 
            style={{ color: '#fff', fontSize: 32, marginBottom: 8 }}
          >
            Kitchen Buddy 🤝🥕
          </ThemedText>

          {/* Subtitle text */}
          <ThemedText 
            type='subtitle' 
            style={{ 
              color: '#eee', 
              textAlign: 'center', 
              marginTop: 4, 
              marginBottom: 12, 
              marginInline: 20, 
              fontSize: 21 
            }}
          >
            HAVE YOUR FOOD SORTED OUT!!🥷
          </ThemedText>

          {/* Button, to addTab*/}
          <TouchableOpacity 
            style={[localStyles.getStartedButton, { marginBottom: 12, backgroundColor: '#34D399' }]} 
            onPress={() => router.push('/(tabs)/addTab')}
          >
            <ThemedText style={localStyles.buttonText}>Add Ingredient 🥕🆕</ThemedText>
          </TouchableOpacity>

          {/* Button, to expiringTab */}
          <TouchableOpacity 
            style={[localStyles.getStartedButton, { marginBottom: 12, backgroundColor: '#312' }]} 
            onPress={() => router.push('/(tabs)/expiringTab')}
          >
            <ThemedText style={localStyles.buttonText}>See what's expiring 🥑⏳</ThemedText>
          </TouchableOpacity>

          {/* Button, to infoTab */}
          <TouchableOpacity 
            style={[localStyles.getStartedButton, { marginBottom: 12, backgroundColor: '#60A5FA' }]} 
            onPress={() => router.push('/(tabs)/infoTab')}
          >
            <ThemedText style={localStyles.buttonText}>View Inventory 🍖📋</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </View>
    </ImageBackground>
  );
}
