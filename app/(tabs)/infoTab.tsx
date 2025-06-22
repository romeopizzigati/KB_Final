// Imports
// External
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Local data persistence #3
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Edit3, Trash2 } from 'lucide-react-native';

// Custom
import { showConfirmation } from '@/components/ShowAlert';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/components/ui/Styles';
import { Ingredient } from '@/constants/Ingredient';
import { Categories, Locations, Packagings } from '@/constants/Options';
import {
  getByLocation,
  getByPackaging,
  getMissingData,
  getRecentlyAdded,
  getbyCategory
} from '@/scripts/Functions';

// Define type for navigation stack and props
type NavigationStack = {
  InfoIngredient: undefined;
  editTab: { ingredient: string }; // editTab expects ingredient data as stringified JSON!!!
};
type Navigator = StackNavigationProp<NavigationStack, 'InfoIngredient'>;


const infoTab: React.FC = () => {
  // Loaded INGREDIENTS from storage
  const [allItems, setAllItems] = useState<Ingredient[]>([]);
  // Filtered INGREDIENTS
  const [visibleItems, setVisibleItems] = useState<Ingredient[]>([]);
  // FILTERS' States
  const [chosenCategory, setChosenCategory] = useState<string>('');
  const [chosenLocation, setChosenLocation] = useState<string>('');
  const [chosenPackaging, setChosenPackaging] = useState<string>('');
  const [filter, setFilter] = useState<string>('all'); // State for filter type (all/recent/missing)

  const navigation = useNavigation<Navigator>(); // Setup navigation

  // Load data from AsyncStorage
  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem('ingredients');
      if (!raw) return; // If no data, exit
      const parsed: Ingredient[] = JSON.parse(raw);
      setAllItems(parsed);
      setVisibleItems(parsed); // Initially show all
    } catch (err) {
      console.warn('Failed to load items', err);
    }
  };

  // Fetch ingredients, when table is FOCUSED
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Whenever filter states change -> APPLY filters 
  useEffect(() => {
    let currentList = allItems;
    // QUICK ACCESS filters (Incomplete Data and Recently Added)
    if (filter === 'missing') {
      currentList = getMissingData(currentList);
    } else if (filter === 'recent') {
      currentList = getRecentlyAdded(currentList);
    }
    // Apply CATEGORY, PACKAGING, LOCATION filters
    if (chosenCategory) currentList = getbyCategory(currentList, chosenCategory);
    if (chosenPackaging) currentList = getByPackaging(currentList, chosenPackaging);
    if (chosenLocation) currentList = getByLocation(currentList, chosenLocation);

    setVisibleItems(currentList); // SET based on choice(s)
  }, [filter, chosenCategory, chosenLocation, chosenPackaging]);

  // RESET ALL filters + RELOAD ALL data
  const resetFilters = () => {
    setFilter('all');
    setChosenCategory('');
    setChosenLocation('');
    setChosenPackaging('');
    loadData();
  };

  // EDIT ingredient -> #1 ASK confirmation #2 Navigate to edit screen
  const editIngredient = (item: Ingredient) => {
    showConfirmation(
      'Edit Item',
      `Edit: ${item.name}?`,
      () => navigation.navigate('editTab', { ingredient: JSON.stringify(item) })
    );
  };

  // DELETE ingredient -> #1 ASK confirmation #2 UPDATE storage and state
  const deleteIngredient = async (item: Ingredient) => {
    showConfirmation(
      'Deleting the Item',
      `Are you sure that you want to delete ${item.name}?`,
      async () => {
        const updated = allItems.filter((i) => i !== item);
        await AsyncStorage.setItem('ingredients', JSON.stringify(updated));
        setAllItems(updated);
        setVisibleItems(updated);
      }
    );
  };

  // --- UI Implementation --- 
  return (
    <ThemedView style={[styles.container, { paddingHorizontal: 16 }]}>
      <ThemedText type="title">Ingredient Overview  🥗</ThemedText>

      {/* Filters section */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 12 }}>
        {/* Category picker */}
        <View style={{ marginBottom: 12 }}>
          <ThemedText type="label">Category:</ThemedText>
          <Picker selectedValue={chosenCategory} onValueChange={setChosenCategory}>
            <Picker.Item label="All" value="" />
            {Categories.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        {/* Location picker */}
        <View style={{ marginBottom: 12 }}>
          <ThemedText type="label">Location:</ThemedText>
          <Picker selectedValue={chosenLocation} onValueChange={setChosenLocation}>
            <Picker.Item label="All" value="" />
            {Locations.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        {/* Packaging picker */}
        <View style={{ marginBottom: 12 }}>
          <ThemedText type="label">Packaging:</ThemedText>
          <Picker selectedValue={chosenPackaging} onValueChange={setChosenPackaging}>
            <Picker.Item label="All" value="" />
            {Packagings.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </View>

        {/* Buttons for filters */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[styles.primaryButton, { marginVertical: 6 }]}
            onPress={() => setFilter('recent')}
          >
            <ThemedText style={styles.buttonText}>Recently Added</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { marginVertical: 6 }]}
            onPress={() => setFilter('missing')}
          >
            <ThemedText style={styles.buttonText}>Incomplete Data</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, { marginVertical: 6 }]}
            onPress={resetFilters}
          >
            <ThemedText style={styles.buttonText}>Reset All</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Ingredient list */}
      <FlatList
        data={visibleItems} // Filtered list to display
        keyExtractor={(item, index) => `${item.name}-${index}`} // Unique key
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <ThemedView style={[styles.item, { marginBottom: 12 }]}>
            {/* Ingredient info */}
            <ThemedText style={styles.itemTitle}>
              {item.name} ({item.category}) — {item.location}
            </ThemedText>
            <ThemedText style={styles.itemSubText}>
              Packaging: {item.packing || 'N/A'}
            </ThemedText>

            {/* Edit + delete icons */}
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editIngredient(item)}>
                <Edit3 size={24} color="#007bff" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteIngredient(item)}>
                <Trash2 size={24} color="#dc3545" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

export default infoTab;
