
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// persistent local storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// dropdown menu
import { Picker } from '@react-native-picker/picker';

// useNavigation to navigate between screens 
// useFocusEffect to run loadData() every time we're on a specific tab
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Import shared components and utility functions
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
import { Edit3, Trash2 } from 'lucide-react-native';

// Define navigation stack types
type NavigationStack = {
  InfoIngredient: undefined;
  editTab: { ingredient: Ingredient };
};

// Typed navigation object for this screen
type Navigator = StackNavigationProp<NavigationStack, 'InfoIngredient'>;

// Main screen component
const infoTab: React.FC = () => {
  
  // Stores all ingredients from local storage
  const [allItems, setAllItems] = useState<Ingredient[]>([]);
  // Stores the visible (filtered) ingredients
  const [visibleItems, setVisibleItems] = useState<Ingredient[]>([]);
  // Current selected filter values
  const [chosenCategory, setChosenCategory] = useState<string>('');
  const [chosenLocation, setChosenLocation] = useState<string>('');
  const [chosenPackaging, setChosenPackaging] = useState<string>('');
  // Active filter mode (e.g., "all", "missing", "recent")
  const [filter, setFilter] = useState<string>('all');

  // Get typed navigation helper
  const navigation = useNavigation<Navigator>();

  // Function to load ingredient data from AsyncStorage
  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem('ingredients');
      if (!raw) return;

      const parsed: Ingredient[] = JSON.parse(raw);
      setAllItems(parsed);         // full list of ingredients
      setVisibleItems(parsed);     // default visible list
    } catch (err) {
      console.warn('Failed to load items', err);
    }
  };

  // Reload ingredients every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Apply filters whenever filter values or mode change
  useEffect(() => {
    let currentList = allItems;

    // Filter by missing fields: FUNCTION #1 
    if (filter === 'missing') {
      currentList = getMissingData(currentList);
    }
    // Filter by most recent additions: FUNCTION #2
    else if (filter === 'recent') {
      currentList = getRecentlyAdded(currentList);
    }

    // Apply category filter: FUNCTION #3
    if (chosenCategory) {
      currentList = getbyCategory(currentList, chosenCategory);
    }

     // Apply packaging filter: FUNCTION #4
     if (chosenPackaging) {
      currentList = getByPackaging(currentList, chosenPackaging);
    }

    // Apply location filter: FUNCTION #5
    if (chosenLocation) {
      currentList = getByLocation(currentList, chosenLocation);
    }

    // Update the filtered list to render
    setVisibleItems(currentList);
  }, [filter, chosenCategory, chosenLocation, chosenPackaging]);

  // Reset all filter states and reload the original list
  const resetFilters = () => {
    setFilter('all');
    setChosenCategory('');
    setChosenLocation('');
    setChosenPackaging('');
    loadData();
  };

  // Navigate to the editTab screen with the selected item (ex modifyIngredient)
  const editIngredient = (item: Ingredient) => {
    showConfirmation(
      'Edit Item',
      `Edit: ${item.name}?`,
      () => navigation.navigate('editTab', { ingredient: item })
      // navigate to  editTab // to be created
    );
  };

  // Delete item from local storage and state (ex removeItem)
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

  // ---- UI ---- 
  //  JSX Layout
  return (
    <ThemedView style={styles.container}>
      {/* Title */}
      <ThemedText type="title">INFO TAB</ThemedText>

      {/* Filter Section */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.content}>

          {/* Filter buttons */}
          <ThemedView style={styles.buttonContainer}>
            {/* Recently Added Filter */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                filter === 'recent' && styles.secondaryButton,
                {marginBottom:12}
              ]}
              onPress={() => setFilter('recent')}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Recently Added</ThemedText>
            </TouchableOpacity>

            {/* Missing Info Filter */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                filter === 'missing' && styles.secondaryButton,
                {marginBottom:12}
              ]}
              onPress={() => setFilter('missing')}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Incomplete Data</ThemedText>
            </TouchableOpacity>

            {/* Reset all filters */}
            <TouchableOpacity
              style={[styles.primaryButton, styles.dangerButton, {marginBottom:12}]}
              onPress={resetFilters}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.buttonText}>Reset All</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Category Dropdown */}
          <ThemedText type="label"> Filter Category:</ThemedText>
          <Picker
            selectedValue={chosenCategory}
            style={styles.picker}
            onValueChange={setChosenCategory}
          >
            {Categories.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>

          {/* Location Dropdown */}
          <ThemedText type="label"> Filter Location:</ThemedText>
          <Picker
            selectedValue={chosenLocation}
            style={styles.picker}
            onValueChange={setChosenLocation}
          >
            {Locations.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>

          {/* Packaging Dropdown */}
          <ThemedText type="label"> Filter Packaging:</ThemedText>
          <Picker
            selectedValue={chosenPackaging}
            style={styles.picker}
            onValueChange={setChosenPackaging}
          >
            {Packagings.map((opt) => (
              <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
            ))}
          </Picker>
        </ThemedView>
      </ScrollView>

      {/* Display filtered ingredient list (WORK ON THE STYLE!!!) */}
      <FlatList
        data={visibleItems}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ThemedView style={styles.item}>
            {/* Ingredient details */}
            <ThemedText style={styles.itemText}>
              {item.name} | {item.category} | {item.location} | {item.packing}
            </ThemedText>

            {/* Action icons: edit & delete */}
            <ThemedView style={styles.iconContainer}>
            <TouchableOpacity onPress={() => editIngredient(item)}>
             <Edit3 size={32} color="#007bff" style={styles.icon} />
            </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteIngredient(item)}>
          <Trash2 size={32} color="#dc3545" style={styles.icon} />
          </TouchableOpacity>
        </ThemedView>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
};

export default infoTab;

