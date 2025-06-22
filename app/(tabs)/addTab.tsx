// Imports 
// Custom
import DatePicker from "@/components/DatePicker"; // Custom date picker component
import { showAlert, showConfirmation } from "@/components/ShowAlert"; // Function to display alerts
import { ThemedText } from '@/components/ThemedText'; // Custom themed text
import { ThemedView } from "@/components/ThemedView"; // Custom themed view
import { styles } from "@/components/ui/Styles"; // UI components styles
import { Ingredient } from "@/constants/Ingredient"; // Ingredient type definition
import { Categories, Locations, Packagings, Status } from "@/constants/Options"; // Dropdown Menus options
import { useConfectionStatus } from '@/hooks/useConfectionStatus'; // Hook for confection/opened status
import { useRipeness } from '@/hooks/useRipeness'; // Hook for ripeness status
import { extendExpiry, getEstimatedDate } from "@/scripts/Functions"; // Function to calculate estimated expiration

// External
import { Monoton_400Regular, useFonts } from '@expo-google-fonts/monoton'; // Custom font
import AsyncStorage from "@react-native-async-storage/async-storage"; // Local data persistence #1
import { Picker } from '@react-native-picker/picker'; // Dropdown picker component
import { Camera, CameraView } from 'expo-camera'; // For camera access and barcode scanning
import React, { useEffect, useMemo, useState } from "react"; // React and hooks
import {
  ActivityIndicator, // Loading spinner
  Linking, // For opening app settings
  Modal, // Modal overlay for scanner
  ScrollView, // Scrollable content
  Switch, // On/off toggle
  TextInput, // Text input field
  TouchableOpacity, // Pressable button(s)
} from "react-native";

const addTab: React.FC = () => {
  // State for form fields
  const [form, setForm] = useState({
    name:"",
    label: "", 
    category: "", 
    location: "", 
    isExact: false, // Is an EXACT expiration date provided or not?
    commonEstimate: "", // If an EXTIMATED period is given
    expiration: new Date(), // EXACT expiration date
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Stored ingredients
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null); 
  const [scanning, setScanning] = useState(false); 
  const [loading, setLoading] = useState(false);

  // Custom hooks (packaging and ripeness)
  const { packaging, setPackaging, ripeness, setRipeness, isFresh } = useRipeness("");
  const { isOpen, setIsOpen, isConfectioned } = useConfectionStatus(packaging);

  // EXACT expiration date
  const expirationDate = useMemo(() => {
    return form.isExact
      ? form.expiration.toISOString().split("T")[0] // Exact date as YYYY-MM-DD
      : getEstimatedDate(form.commonEstimate); // Compute estimated date
  }, [form]);

  // ON FIRST RENDER -> Load ingredients and ask for camera permission 
  useEffect(() => {
    const loadIngredients = async () => {
      const saved = await AsyncStorage.getItem("ingredients");
      if (saved) setIngredients(JSON.parse(saved));
    };
    loadIngredients();

    Camera.requestCameraPermissionsAsync().then(({ status }) =>
      setCameraPermission(status === "granted")
    );
  }, []);

  // No more fresh -> reset ripeness 
  useEffect(() => { if (!isFresh) setRipeness(""); }, [isFresh]);

  // No more confectionated -> reset isOpen 
  useEffect(() => { if (packaging !== "confenction") setIsOpen(false); }, [packaging]);

  // Clear WHOLE form
  const clearForm = () => {
    setForm({
      name: "",
      label: "",
      category: "",
      location: "",
      isExact: false,
      commonEstimate: "",
      expiration: new Date(),
    });
    setPackaging("");
    setRipeness("");
  };

  // Save ingredient to AsyncStorage + update its state
  const persistIngredient = async (item: Ingredient) => {
    const updated = [...ingredients, item];
    await AsyncStorage.setItem("ingredients", JSON.stringify(updated));
    setIngredients(updated);
  };

  // Build an Ingredient object from current form state
  const createIngredientObject = (): Ingredient => ({
    name: form.name,
    label: form.label,
    category: form.category,
    location: form.location,
    packing: packaging,
    status: ripeness,
    isOpen: packaging === "confenction" ? isOpen : undefined,
    expirationDate,

  });
  // Logic to add ingredient -> #1 validation #2 creation #3 persistence
  const addIngredient = async () => {
    if (!form.name.trim()) {
      showAlert("‼️ Attention", "Insert ingredient name");
      return;
    } else if (form.name === "No Name") {
      showAlert("‼️ Attention", "Please give a name to this product");
    }
    const newItem = createIngredientObject();
    await persistIngredient(newItem);
    showAlert(
      "1 INGREDIENT ADDED! 🥑",
      `*Name: ${newItem.name}\n*Label: ${newItem.label},\n*Location: ${newItem.location},\n*Expires: ${newItem.expirationDate},`
    );
  };

  // Barcorde scanning + Fetching product info
  const handleBarcodeScan = async ({ data }: { data: string }) => {
    setScanning(false);
    setLoading(true);
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const result = await response.json();
      if (result.status === 1) {
        // Product found
        const productName = result.product.product_name || "No Name";
        setForm((prev) => ({ ...prev, name: productName }));
        const newItem: Ingredient = { name: productName, expirationDate: "" };
        const saved = await AsyncStorage.getItem("ingredients");
        const parsed = saved ? JSON.parse(saved) : [];
        await AsyncStorage.setItem("ingredients", JSON.stringify([...parsed, newItem]));
        showAlert("The Product exists!", `Named as: ${productName}`, clearForm);
      } else {
        showConfirmation("‼️ Attention", "Product was not found!");
      }
    } catch {
      showConfirmation("‼️ Attention", "Cannot fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  // Recheck camera permissions
  const recheckPermissions = async () => {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") setCameraPermission(true);
    else {
      setCameraPermission(false);
      if (!canAskAgain) {
        // Ask user to open settings manually
        showConfirmation(
          "Camera Permission Denied",
          "Please make sure manually that permission are enabled in your system's settings.",
          () => Linking.openSettings()
        );
      }
    }
  };

  // Fonts loading before rendering AKA don't render until the font is loaded
  const [fontsLoaded] = useFonts({ Monoton_400Regular });
  if (!fontsLoaded) return null; 

// --- UI Implementation ---
  return (
    <ThemedView style={{ flex: 1, padding: 20 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title */}
        <ThemedText type="title">Add    Ingredient 🥑 </ThemedText>

        {/* Name input */}
        <ThemedText type="label">Name:</ThemedText>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(name) => setForm({ ...form, name })}
          placeholder="Enter ingredient name"
        />

        {/* Label input */}
        <ThemedText type="label">Label:</ThemedText>
        <TextInput
          style={styles.input}
          value={form.label}
          onChangeText={(label) => setForm({ ...form, label })}
          placeholder="Enter label"
        />

        {/* Category picker */}
        <ThemedText type="label">Category:</ThemedText>
        <Picker selectedValue={form.category} style={styles.picker} onValueChange={(v) => setForm({ ...form, category: v })}>
          {Categories.map((c) => (<Picker.Item key={c.value} label={c.label} value={c.value} />))}
        </Picker>

        {/* Location picker */}
        <ThemedText type="label">Location:</ThemedText>
        <Picker selectedValue={form.location} style={styles.picker} onValueChange={(v) => setForm({ ...form, location: v })}>
          {Locations.map((l) => (<Picker.Item key={l.value} label={l.label} value={l.value} />))}
        </Picker>

        {/* Packaging picker */}
        <ThemedText type="label">Packaging type:</ThemedText>
        <Picker
  selectedValue={packaging}
  style={styles.picker}
  onValueChange={(value) => {
    if (packaging === "fresh" && value === "frozen") {
      // Extend expiration when switching fresh -> frozen
      const extended = extendExpiry(form.expiration);
      setForm({ ...form, expiration: extended });
    }
    setPackaging(value);
  }}
>
  {Packagings.map((p) => (
    <Picker.Item key={p.value} label={p.label} value={p.value} />
  ))}
</Picker>

        {/* Ripeness picker (if fresh) */}
        {isFresh && (
          <>
            <ThemedText type="label"> Ripeness:</ThemedText>
            <Picker
  selectedValue={ripeness}
  style={styles.picker}
  onValueChange={(value) => {
    setRipeness(value);
    setForm((prev) => ({
      ...prev,
    }));
  }}
>
  {Status.map((s) => (
    <Picker.Item key={s.value} label={s.label} value={s.value} />
  ))}
</Picker>

          </>
        )}

        {/* Is open switch (if confectioned) */}
        {isConfectioned && (
          <ThemedView style={styles.switchContainer}>
            <ThemedText> Is it open?</ThemedText>
            <Switch value={isOpen} onValueChange={setIsOpen} />
          </ThemedView>
        )}

        {/* Exact date switch */}
        <ThemedView style={styles.switchContainer}>
          <ThemedText> Exact Date Known</ThemedText>
          <Switch value={form.isExact} onValueChange={(v) => setForm({ ...form, isExact: v })} />
        </ThemedView>

        {/* Date picker or estimate picker */}
        {form.isExact ? (
          <DatePicker date={form.expiration} onDateChange={(d) => setForm({ ...form, expiration: d })} />
        ) : (
          <Picker selectedValue={form.commonEstimate} style={styles.picker} onValueChange={(v) => setForm({ ...form, commonEstimate: v })}>
            <Picker.Item label="Estimated Expiration ⬇️" value="" />
            <Picker.Item label="2 days" value="2 days" />
            <Picker.Item label="1 week" value="1 week" />
            <Picker.Item label="10 days" value="10 days" />
            <Picker.Item label="1 month" value="1 month" />
          </Picker>
        )}

        {/* Add button */}
        <TouchableOpacity style={styles.successButton} onPress={addIngredient}>
          <ThemedText style={styles.buttonText}>Add Ingredient 🥑</ThemedText>
        </TouchableOpacity>

        {/* Scan barcode button */}
        <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={() => setScanning(true)}>
          <ThemedText style={styles.buttonText}>Scan Barcode 🤳</ThemedText>
        </TouchableOpacity>

        {/* Scanner modal */}
        <Modal visible={scanning} animationType="slide">
          <ThemedView style={styles.modalContainer}>
            {cameraPermission === false ? (
              // Show if camera permission is denied
              <ThemedView>
                <ThemedText style={styles.buttonText}>Camera access is required ‼️</ThemedText>
                <TouchableOpacity style={styles.primaryButton} onPress={recheckPermissions}>
                  <ThemedText style={styles.buttonText}>Ask permission again</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerButton} onPress={() => setScanning(false)}>
                  <ThemedText style={styles.buttonText}>Close</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              // Show camera view
              <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"] }}
                onBarcodeScanned={scanning ? handleBarcodeScan : undefined}
              >
                <TouchableOpacity style={styles.closeButton} onPress={() => setScanning(false)}>
                  <ThemedText style={styles.buttonText}>Back 🪃</ThemedText>
                </TouchableOpacity>
              </CameraView>
            )}
          </ThemedView>
        </Modal>

        {/* Loading spinner */}
        {loading && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28a745" />
            <ThemedText>Loading...</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
};

export default addTab;
