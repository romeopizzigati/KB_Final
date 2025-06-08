import React, { useCallback, useState } from 'react';

import { FlatList, TouchableOpacity } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

// Local imports
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/components/ui/Styles';
import { Ingredient } from '@/constants/Ingredient';
import { Status } from '@/constants/Options';

import { needsRipenessCheck } from '@/scripts/Functions';

const expiringTab: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // used to store the list of ingredients that will expire soon

  // Fetch expiring soon ingredients
  const fetchExpiringIngredients = async () => {
    try {
    const storedIngredients = await AsyncStorage.getItem("ingredients");  // Reads ingredients from storage.
    if (!storedIngredients) return; // nothing found -> exits early 

    const parsedIngredients: Ingredient[] = JSON.parse(storedIngredients); // Parse ingredients from storage

    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // Filter by expiration, ripeness, or open
    const filtered = parsedIngredients.filter((item) => {
      const expiration = new Date(item.expirationDate);
      const isExpiringSoon = expiration <= sevenDaysFromNow;
    
      const isRipe = item.status === "ripe";
      const isOpen = item.isOpen === true;
      const needsCheck = needsRipenessCheck(item);
    
      return isExpiringSoon || isRipe || isOpen || needsCheck;
    })
    
    
    setIngredients(filtered);

    } catch (error) {
      console.error("Couldn't load expiring ingredients...", error);
    }
  };

  // This ensures that every time the screen becomes active, it reloads the expiring data.
  useFocusEffect(
    useCallback(() => {
      fetchExpiringIngredients();
    }, [])
  );

  const markAsChecked = async (item: Ingredient) => {
    try {
      const stored = await AsyncStorage.getItem("ingredients");
      if (!stored) return;
  
      const allIngredients: Ingredient[] = JSON.parse(stored);
  
      const updatedIngredients = allIngredients.map((ing) => {
        if (
          ing.name === item.name &&
          ing.expirationDate === item.expirationDate
        ) {
          return {
            ...ing,
            lastChecked: new Date().toISOString(),
          };
        }
        return ing;
      });
  
      await AsyncStorage.setItem("ingredients", JSON.stringify(updatedIngredients));
      fetchExpiringIngredients(); // refresh list
    } catch (error) {
      console.error("Failed to update lastChecked:", error);
    }
  };

//  Returns true if:
//  The item has never been checked.
//  It was checked more than 3 days ago.


//  UI LAYOUT.
  return (
    <ThemedView style={styles.container}>
      {/* Title */}
      <ThemedText type="title">EXPIRING SOON</ThemedText>
      {/* List of Expiring Soon Ingredients */}
      <ThemedView style={styles.content}>
        <FlatList
          data={ingredients}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => `${item.name}-${item.expirationDate}`}
          renderItem={({ item }) => {
            const today = new Date();
            const expirationDate = new Date(item.expirationDate); 
            const isExpired = expirationDate < today; //Boolean flag for expiration.
            const statusLabel = Status.find((s) => s.value === item.status)?.label || item.status;

            return (
              <ThemedView style={styles.itemContainer}>
                <ThemedText style={styles.itemTitle}>{item.name}</ThemedText>

              {/* Expiration Date */}
                {isExpired ? (
                  <ThemedText style={styles.itemDangerText}> EXPIRED ON: {item.expirationDate}</ThemedText>
                ) : (
                  <ThemedText style={styles.itemSubText}> Expires on: {item.expirationDate}</ThemedText>
                )}

              {/* Ripeness Status */}
                {item.status && (
                  <>
                    <ThemedText style={styles.itemSubText}> Status: {statusLabel}</ThemedText>
                  </>
                )}

                {item.lastChecked && (
                  <ThemedText style={styles.itemSubText}>
                    Last Checked: {new Date(item.lastChecked).toLocaleDateString()}
                  </ThemedText>
                )}

                {item.status && needsRipenessCheck(item) && (
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => markAsChecked(item)}
                  >
                    <ThemedText style={styles.buttonText}>Mark as Checked ✅</ThemedText>
                  </TouchableOpacity>
                )}
                
              </ThemedView>
            );
          }}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default expiringTab;

