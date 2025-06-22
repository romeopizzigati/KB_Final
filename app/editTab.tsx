// Imports
// External
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Local data persistence #4
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';

// Custom
import DatePicker from '@/components/DatePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { styles } from '@/components/ui/Styles';
import { Ingredient } from '@/constants/Ingredient';
import { Categories, Locations, Packagings, Status } from '@/constants/Options';
import { useConfectionStatus } from '@/hooks/useConfectionStatus';
import { useRipeness } from '@/hooks/useRipeness';
import { getEstimatedDate } from '@/scripts/Functions';

const editTab: React.FC = () => {
  const navigation = useNavigation(); // BACK Navigation
  const { ingredient } = useLocalSearchParams<{ ingredient: string }>(); // Get ingredient param

  // If no ingredient data provided, show error message
  if (!ingredient) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Error ❌</ThemedText>
        <ThemedText>No ingredient data provided.</ThemedText>
      </ThemedView>
    );
  }

  // PARSE ingredient data
  const parsedIngredient: Ingredient = JSON.parse(ingredient);

  // INITIALIZE FORM State from ingredient
  const [form, setForm] = useState({
    name: parsedIngredient.name,
    label: parsedIngredient.label || '',
    category: parsedIngredient.category || '',
    location: parsedIngredient.location || '',
    isExact: !!parsedIngredient.expirationDate && !parsedIngredient.expirationDate.includes('day'),
    commonEstimate: parsedIngredient.expirationDate.includes('day') ? parsedIngredient.expirationDate : '',
    expiration: parsedIngredient.expirationDate.includes('day')
      ? new Date() // default to today if estimate
      : new Date(parsedIngredient.expirationDate), // parse date if exact
  });

  // Custom hooks
  const { packaging, setPackaging, ripeness, setRipeness, isFresh } = useRipeness(parsedIngredient.packing || '');
  const { isOpen, setIsOpen } = useConfectionStatus(packaging);

  // No more fresh -> reset ripeness 
  useEffect(() => {
    if (!isFresh) setRipeness('');
  }, [isFresh]);

  // Function to SAVE changes
  const handleSave = async () => {
    try {
      // Compute UPDATED expiration date
      const updatedExpiration = form.isExact
        ? form.expiration.toISOString().split('T')[0]
        : getEstimatedDate(form.commonEstimate);

      // Build updated ingredient object
      const updatedIngredient: Ingredient = {
        ...parsedIngredient,
        name: form.name,
        label: form.label,
        category: form.category,
        location: form.location,
        packing: packaging,
        status: ripeness,
        isOpen: packaging === 'confenction' ? isOpen : undefined,
        expirationDate: updatedExpiration,
      };

      // LOAD existing ingredients
      const stored = await AsyncStorage.getItem('ingredients');
      const allIngredients: Ingredient[] = stored ? JSON.parse(stored) : [];

      // REPLACE old ingredient with UPDATED one
      const updatedList = allIngredients.map((item) =>
        item.name === parsedIngredient.name &&
        item.expirationDate === parsedIngredient.expirationDate
          ? updatedIngredient
          : item
      );

      // SAVE updated list
      await AsyncStorage.setItem('ingredients', JSON.stringify(updatedList));
      navigation.goBack(); // Navigate back after save
    } catch (err) {
      console.error('Failed to save ingredient:', err);
    }
  };

// --- UI Implementation ---
  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title">Edit Ingredient ✏️</ThemedText>

        {/* Name input */}
        <ThemedText type="label">Name:</ThemedText>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(name) => setForm({ ...form, name })}
        />

        {/* Label input */}
        <ThemedText type="label">Label:</ThemedText>
        <TextInput
          style={styles.input}
          value={form.label}
          onChangeText={(label) => setForm({ ...form, label })}
        />

        {/* Category picker */}
        <ThemedText type="label">Category:</ThemedText>
        <Picker
          selectedValue={form.category}
          style={styles.picker}
          onValueChange={(v) => setForm({ ...form, category: v })}
        >
          {Categories.map((c) => (
            <Picker.Item key={c.value} label={c.label} value={c.value} />
          ))}
        </Picker>

        {/* Location picker */}
        <ThemedText type="label">Location:</ThemedText>
        <Picker
          selectedValue={form.location}
          style={styles.picker}
          onValueChange={(v) => setForm({ ...form, location: v })}
        >
          {Locations.map((l) => (
            <Picker.Item key={l.value} label={l.label} value={l.value} />
          ))}
        </Picker>

        {/* Packaging picker */}
        <ThemedText type="label">Packaging:</ThemedText>
        <Picker selectedValue={packaging} style={styles.picker} onValueChange={setPackaging}>
          {Packagings.map((p) => (
            <Picker.Item key={p.value} label={p.label} value={p.value} />
          ))}
        </Picker>

        {/* Ripeness picker if fresh */}
        {isFresh && (
          <>
            <ThemedText type="label">Ripeness:</ThemedText>
            <Picker selectedValue={ripeness} style={styles.picker} onValueChange={setRipeness}>
              {Status.map((s) => (
                <Picker.Item key={s.value} label={s.label} value={s.value} />
              ))}
            </Picker>
          </>
        )}

        {/* Confectionated packaging open switch */}
        {packaging === 'confenction' && (
          <ThemedView style={styles.switchContainer}>
            <ThemedText>Is it open?</ThemedText>
            <Switch value={isOpen} onValueChange={setIsOpen} />
          </ThemedView>
        )}

        {/* Exact date toggle */}
        <ThemedView style={styles.switchContainer}>
          <ThemedText>Exact Date Known</ThemedText>
          <Switch
            value={form.isExact}
            onValueChange={(v) => setForm({ ...form, isExact: v })}
          />
        </ThemedView>

        {/* Expiration picker */}
        {form.isExact ? (
          <DatePicker
            date={form.expiration}
            onDateChange={(d) => setForm({ ...form, expiration: d })}
          />
        ) : (
          <Picker
            selectedValue={form.commonEstimate}
            style={styles.picker}
            onValueChange={(v) => setForm({ ...form, commonEstimate: v })}
          >
            <Picker.Item label="Estimated Expiration ⬇️" value="" />
            <Picker.Item label="2 days" value="2 days" />
            <Picker.Item label="1 week" value="1 week" />
            <Picker.Item label="10 days" value="10 days" />
            <Picker.Item label="1 month" value="1 month" />
          </Picker>
        )}

        {/* Save button */}
        <TouchableOpacity style={[styles.successButton, { marginTop: 20 }]} onPress={handleSave}>
          <ThemedText style={styles.buttonText}>Save Changes 💾</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
};

export default editTab;
