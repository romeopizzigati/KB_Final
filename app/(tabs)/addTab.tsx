// ----- Imports (Handmade + External) -----
import DatePicker from "@/components/DatePicker"; // Handmade
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { showAlert, showConfirmation } from "@/components/ShowAlert"; // Handmade
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from "@/components/ThemedView";
import { styles } from "@/components/ui/Styles";
import { Ingredient } from "@/constants/Ingredient"; // Handmade
import { Categories, Locations, Packagings, Status } from "@/constants/Options"; // Handmade
import { useCanStatus } from '@/hooks/useCanStatus'; // Handmade
import { useRipeness } from '@/hooks/useRipeness'; // Handmade
import { getEstimatedDate } from "@/scripts/Functions"; // Handmade

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { Camera, CameraView } from "expo-camera";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Monoton_400Regular, useFonts } from '@expo-google-fonts/monoton';
import AppLoading from 'expo-app-loading';

// ----- Main Component -----
const addTab: React.FC = () => {
  // Holds form data: name, brand, category, etc.
const [form, setForm] = useState({
  name:"",
  label: "",
  category: "",
  location: "",
  isExact: false,
  commonEstimate: "",
  expiration: new Date(),
})

  // Local state storing the list of ingredients
const [ingredients, setIngredients] = useState<Ingredient[]>([]);
const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
const [scanning, setScanning] = useState(false);
const [loading, setLoading] = useState(false);

  // Custom hook managing food type and freshness status
  // the hook is built this way so the ripeness is reset when the packaging is reselected as Non-Fresh 
  // see hooks/useRipeness();
  const { packaging, setPackaging, ripeness, setRipeness, isFresh } = useRipeness("");
  const { isOpen, setIsOpen, isCanned } = useCanStatus(packaging);
  
  // Calculates expiration date based on exact or estimated input
  const expirationDate = useMemo(() => {     // recalculates only if the value form.commonEstimate changes
    return form.isExact
    ? form.expiration.toISOString().split("T")[0]
    : getEstimatedDate(form.commonEstimate);
  }, [form]);

  // Loads saved ingredients from local storage
  const loadIngredients = async () => {
    const saved = await AsyncStorage.getItem("ingredients");
    if (saved) {
      setIngredients(JSON.parse(saved));
    }
  };

  // Runs on mount: loads ingredients + requests camera permission
  useEffect(() => {
    loadIngredients();
    Camera.requestCameraPermissionsAsync().then(({ status }) =>
      setCameraPermission(status === "granted")
    );
  }, []); // run on mount ======> bc. of []

  // Reset ripeness if the item is not fresh
  useEffect(() => {
    if (!isFresh) setRipeness("");
  }, [isFresh]); // run when isFresh value changes

  // Reset isOpen when packaging is not canned
  useEffect(() => {
    if (packaging !== "canned") {
      setIsOpen(false);
    }
  }, [packaging]);

  // Function used to reset all form fields' data
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

  // Persists a new ingredient to local storage
  const persistIngredient = async (item: Ingredient) => {
    const updated = [...ingredients, item];
    await AsyncStorage.setItem("ingredients", JSON.stringify(updated));
    setIngredients(updated);
  };

  // Creates an Ingredient object from form data
  // data: form.data
  const createIngredientObject = (): Ingredient => ({
    name: form.name,
    label: form.label,
    category: form.category,
    location: form.location,
    packing: packaging,
    status: ripeness,
    isOpen: packaging === "canned" ? isOpen : undefined,
    expirationDate
  });

  // Adds a new ingredient (after validation) | It is connected to the addIngredient button
  const addIngredient = async () => {
    if(!form.name.trim()) {
      showAlert("‼️ Attention","Insert ingredient name");
      return;
    }
    else if(form.name == "No Name"){
      showAlert("‼️ Attention", "Please give a name to this product")
    }

    const newItem = createIngredientObject();
    await persistIngredient(newItem);
    
    showAlert(
      "1 INGREDIENT ADDED! 🍎",
      `*Name: ${newItem.name}\n*Label: ${newItem.label},\n*Location: ${newItem.location},\n*Expires: ${newItem.expirationDate},`
    )
  }

  // Handles barcode scan event and fetches product data
  const handleBarcodeScan = async ({ data}: {data: string}) => {
    setScanning(false);
    setLoading(true);

    try{
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${data}.json`);
      const result = await response.json(); // parsing as JSON

      if (result.status === 1) {

        //product name extraction
        const productName = result.product.product_name || "No Name";

        // prefill the form
        setForm((prev) => ({...prev, name: productName}));

        const newItem: Ingredient = {
          name: productName,
          expirationDate: "",
        };

        const saved = await AsyncStorage.getItem("ingredients");
        const parsed = saved ? JSON.parse(saved) : [];
        await AsyncStorage.setItem("ingredients", JSON.stringify([...parsed, newItem]));

        showAlert("The Product exists!", `Named as: ${productName}`, clearForm);
      } else {
        showConfirmation("‼️ Attention","Product was not found!")
      }
    } catch{
      showConfirmation("‼️ Attention", "Cannot fetch product details.");
    } finally {
      setLoading(false);
    }
  } 

  // Handles camera permission retry or manual settings redirect
  const recheckPermissions = async () => {
    const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setCameraPermission(true);
    } else {
      setCameraPermission(false);
      if (!canAskAgain) {
        showConfirmation(
          "Camera Permission Denied",
          "Please enable permissions manually in settings.",
          () => Linking.openSettings()
        );
      }
    }
  };

  // font loading

  const [fontsLoaded] = useFonts({
    Monoton_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  // ----- UI Layout -----
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#ffa647", dark: "#ff8e14" }}
      headerImage={<Image source={require("@/assets/images/icon.jpg")} style={styles.image} />}
    >
      <ThemedText type="title"> KITCHEN BUDDY 🥑😎</ThemedText>
      <ThemedView style={styles.title}>
        
        {/* Ingredient name input */}
        <ThemedText type="label"> Name:</ThemedText>
        <TextInput
          style={styles.input} // gives style to the text I input
          value={form.name} // connects the value I input, to the form.name container
          onChangeText={(name) => setForm({ ...form, name })} // when the text changes, so does the form.name value
          placeholder="Enter ingredient name"
        />

        {/* Label input */}
        <ThemedText type="label"> Label:</ThemedText>
        <TextInput
          style={styles.input}
          value={form.label}
          onChangeText={(label) => setForm({ ...form, label })}
          placeholder="Enter label"
        />

        {/* Category Picker */}
        <ThemedText type="label"> Category:</ThemedText>
        <Picker 
          selectedValue={form.category} // the chosen value, will populate the form.category container
          style={styles.picker} // style is given
          onValueChange={(v) => setForm({ ...form, category: v })} // when the choice changes, so does the form.category value
        >
          {Categories.map((c) => ( // pick from constants/Options -> Categories
            <Picker.Item key={c.value} label={c.label} value={c.value}/>
          ))}
        </Picker>

        {/* Location Picker */}
        <ThemedText type="label"> Location:</ThemedText>
        <Picker
          selectedValue={form.location}
          style={styles.picker}
          onValueChange={(v) => setForm({ ...form, location: v })}
        >
          {Locations.map((l) => (
            <Picker.Item key={l.value} label={l.label} value={l.value} />
          ))}
        </Picker>

        {/* Packaging Type */}
        <ThemedText type="label"> Packaging:</ThemedText>
        <Picker selectedValue={packaging} style={styles.picker} onValueChange={setPackaging}>
          {Packagings.map((p) => (
            <Picker.Item key={p.value} label={p.label} value={p.value} />
          ))}
        </Picker>

        {/* Ripeness choice shown only if item is fresh */}
        {isFresh && (
          <>
            <ThemedText type="label"> Ripeness:</ThemedText>
            <Picker selectedValue={ripeness} style={styles.picker} onValueChange={setRipeness}>
              {Status.map((s) => (
                <Picker.Item key={s.value} label={s.label} value={s.value} />
              ))}
            </Picker>
          </>
        )}


        {/* isOpen choice shown only if item is fresh */}
        {isCanned && (
        <ThemedView style={styles.switchContainer}>
          <ThemedText> Is it open? </ThemedText>
          <Switch value={isOpen} onValueChange={setIsOpen} />
        </ThemedView>
        )}


        {/* Switch between exact and estimated expiration */}
        <ThemedView style={styles.switchContainer}>
          <ThemedText> Exact Date Known </ThemedText> 
          <Switch
            value={form.isExact}
            onValueChange={(v) => setForm({ ...form, isExact: v })}
          />
        </ThemedView>

        {/* Conditional expiration input */}
        {form.isExact ? (
          <DatePicker
            date={form.expiration} // expiration is the value given if isExact is true
            onDateChange={(d) => setForm({ ...form, expiration: d })}
          />
        ) : (
          <>
            <Picker
              selectedValue={form.commonEstimate} // commonEstimate is the value given if !isExact
              style={styles.picker}
              onValueChange={(v) => setForm({ ...form, commonEstimate: v })}
            >
              <Picker.Item label="Estimated Expiration ⬇️" value="" />
              <Picker.Item label="2 days" value="2 days" />
              <Picker.Item label="1 week" value="1 week" />
              <Picker.Item label="10 days" value="10 days" />
              <Picker.Item label="1 month" value="1 month" />
            </Picker>
          </>
        )}

        {/* Action buttons */}
        <TouchableOpacity style={styles.successButton} onPress={addIngredient}> {/* calls the function AddIngredient, declared high above */}
          <ThemedText style={styles.buttonText}> Add Ingredient 🥕</ThemedText>
        </TouchableOpacity>


        <TouchableOpacity style={[styles.primaryButton, { marginTop: 12 }]} onPress={() => setScanning(true)}> {/* calls the function setScanning, declared high above */}
          <ThemedText style={styles.buttonText}> Scan Barcode 🤳
          </ThemedText>
        </TouchableOpacity>

        {/* Modal Camera View */}
        <Modal visible={scanning} animationType="slide">
          <ThemedView style={styles.modalContainer}>
            {cameraPermission === false ? (
              // If not granted, show retry UI
              <ThemedView>
                <ThemedText style={styles.buttonText}> Camera access is required ‼️</ThemedText>
                <TouchableOpacity style={styles.primaryButton} onPress={recheckPermissions}>
                  <ThemedText style={styles.buttonText}>Ask permission again</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dangerButton} onPress={() => setScanning(false)}>
                  <ThemedText style={styles.buttonText}>Close</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ) : (
              // Open camera (scanner)
              <CameraView
                style={styles.camera}
                barcodeScannerSettings={{ // expo-camera component!
                  barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"]
                }}
                onBarcodeScanned={scanning ? handleBarcodeScan : undefined} // recalls handleBarcodeScan function mentioned above!
              >
                <TouchableOpacity style={styles.closeButton} onPress={() => setScanning(false)}>
                  <ThemedText style={styles.buttonText}> Back 🪃   </ThemedText>
                </TouchableOpacity>
              </CameraView>
            )}
          </ThemedView>
        </Modal>

        {/* Loading feedback */}
        {loading && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#28a745" />
            <ThemedText>Loading...</ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default addTab;
