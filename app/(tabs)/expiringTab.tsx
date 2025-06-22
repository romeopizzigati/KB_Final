// Imports 
// External
import React, { useCallback, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Local data persistence #2
import { useFocusEffect } from 'expo-router'; // Detect when the tab is focused

// Custom
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/components/ui/Styles';
import { Ingredient } from '@/constants/Ingredient';
import { Status } from '@/constants/Options';
import { needsRipenessCheck } from '@/scripts/Functions'; // To check if ripeness needs check

const expiringTab: React.FC = () => {
  // Store ingredients that: are expiring || need checking
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  // Function to LOAD + FILTER
  const fetchExpiringIngredients = async () => {
    try {
      const storedIngredients = await AsyncStorage.getItem("ingredients");
      if (!storedIngredients) return;

      const parsedIngredients: Ingredient[] = JSON.parse(storedIngredients);
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7); 

      // Filter ingredients
      const filtered = parsedIngredients.filter((item) => {
        const expiration = new Date(item.expirationDate);
        // ... expiring in 7 (or less) days
        const isExpiringSoon = expiration <= sevenDaysFromNow;
        // ... that are ripe
        const isRipe = item.status === "ripe";
        // ... that are open
        const isOpen = item.isOpen === true;
        // ... that need ripeness check
        const needsCheck = needsRipenessCheck(item);
        return isExpiringSoon || isRipe || isOpen || needsCheck;
      });

      // Update state with FILTERED list
      setIngredients(filtered);
    } catch (error) {
      console.error("Couldn't load expiring ingredients...", error);
    }
  };

  // Fetch expiring ingredients, when table is FOCUSED
  useFocusEffect(
    useCallback(() => {
      fetchExpiringIngredients();
    }, [])
  );

  // Function to mark an ingredient as CHECKED (updates lastChecked field)
  const markAsChecked = async (item: Ingredient) => {
    try {
      const stored = await AsyncStorage.getItem("ingredients");
      if (!stored) return;

      const allIngredients: Ingredient[] = JSON.parse(stored);
      // Update only the matching item
      const updatedIngredients = allIngredients.map((ing) => {
        if (ing.name === item.name && ing.expirationDate === item.expirationDate) {
          return { ...ing, lastChecked: new Date().toISOString() };
        }
        return ing;
      });

      // Save updated list
      await AsyncStorage.setItem("ingredients", JSON.stringify(updatedIngredients));

      // Refresh expiring list
      fetchExpiringIngredients();
    } catch (error) {
      console.error("Failed to update lastChecked:", error);
    }
  };

// --- UI Implementation ---
  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      {/* Title */}
      <ThemedText type="title" style={{ marginBottom: 12 }}>Expiring    Soon ⏰</ThemedText>

      {/* List of expiring ingredients */}
      <FlatList
        data={ingredients} // Data source
        keyExtractor={(item) => `${item.name}-${item.expirationDate}`} // Unique key
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const today = new Date();
          const expirationDate = new Date(item.expirationDate);
          const isExpired = expirationDate < today; // Check if item is expired
          const statusLabel = Status.find((s) => s.value === item.status)?.label || item.status;

          return (
            <ThemedView
              style={[
                styles.itemContainer,
                { marginBottom: 16, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 }
              ]}
            >
              <View style={{ marginBottom: 6 }}>
                {/* Ingredient name */}
                <ThemedText style={styles.itemTitle}>{item.name}</ThemedText>

                {/* Expiration info */}
                <ThemedText style={isExpired ? styles.itemDangerText : styles.itemSubText}>
                  {isExpired ? `EXPIRED: ${item.expirationDate}` : `Expires: ${item.expirationDate}`}
                </ThemedText>

                {/* Status (e.g. ripe, unripe) */}
                {item.status && (
                  <ThemedText style={styles.itemSubText}>Status: {statusLabel}</ThemedText>
                )}

                {/* Last checked info */}
                {item.lastChecked && (
                  <ThemedText style={styles.itemSubText}>
                    Last Checked: {new Date(item.lastChecked).toLocaleDateString()}
                  </ThemedText>
                )}
              </View>

              {/* Button to mark as checked if ripeness check needed */}
              {item.status && needsRipenessCheck(item) && (
                <TouchableOpacity
                  style={[styles.primaryButton, { alignSelf: 'flex-start' }]}
                  onPress={() => markAsChecked(item)}
                >
                  <ThemedText style={styles.buttonText}>Mark as Checked ✅</ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          );
        }}
        // Show message if list is empty
        ListEmptyComponent={() => (
          <ThemedText style={{ marginTop: 32, textAlign: 'center' }}>
            THERE AIN'T NO ITEMS EXPIRING SOON 😎🎸🥕!
          </ThemedText>
        )}
      />
    </ThemedView>
  );
};

export default expiringTab;