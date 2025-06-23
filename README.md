# Kitchen Buddy!!  

This is an [Expo](https://expo.dev) project developed with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

It is used to manage and track kitchen ingredients, to make our food inventory at least 90% less messy than before. (It can't do miracles)

The App was developed by **Romeo Pizzigati** AKA **Student: 23027** 

## GET STARTED  

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

    ```bash
   npx expo start
   ```

## COMPONENTS OVERVIEW  

| Component | Props | State | Functionality |

| `_layout.tsx` | none | Uses `useColorScheme` | The main navigator for the app. Sets up the bottom tabs: `addTab`, `expiringTab`, `infoTab`. Handles their tab styling, too. |

| `addTab` | none | `form`, `ingredients`, `cameraPermission`, `scanning`, `loading`, `packaging`, `ripeness`, `isOpen` | Screen to add new ingredients. Manages form input, barcode scanning, and saves data to storage. |

| `expiringTab` | none | `ingredients` | 	Screen to add new ingredients. Manages form input, barcode scanning, and saves data to storage. |

| `infoTab` | none | `allItems`, `visibleItems`, `chosenCategory`, `chosenLocation`, `chosenPackaging`, `filter` | Shows all ingredients based on filter(s) selection (category, location, packaging) + makes it possible to delete or edit them. |

| `editTab` | none | `form`, `packaging`, `ripeness`, `isOpen` | Allows editing an existing ingredient’s details. Updates asynchronous storage after save. |

| `index.tsx (HomeScreen)` | none | none | Landing screen. Lets user navigate to any tab via buttons. |

| `ThemedText` | `type`, `lightColor`, `darkColor`, native `TextProps` | none | Custom text component that adapts color/style to light/dark theme.|

| `ThemedView` | `lightColor`, `darkColor`, native `ViewProps` | none | Custom container that adapts background color to theme. |

| `DatePicker` | `date: Date`, `onDateChange: (Date) => void` | none | 	Wrapper around native/web date input. Calls back when user picks date. |

| `HapticTab` | `BottomTabBarButtonProps` | none | Custom tab button that gives haptic feedback on press (iOS). |

| `ShowAlert` (fn) | `showAlert(title, msg)`, `showConfirmation(title, msg, onConfirm, onCancel)` | none | Utility functions for showing alerts or confirmations, native/web. |


## COMPONENT TREE  
RootLayout
 Stack.Navigator
  index.tsx (That is the home screen, which is shown once at the app start)

    (tabs)/layout.tsx 
      
      addTab.tsx (uses ThemedView, ThemedText, TextInput / Picker / Switch / DatePicker, Modal -> CameraView)
      expiringTab.tsx (uses ThemedView, FlatList -> ThemedText, TouchableOpacity )
      
      infoTab.tsx (uses ThemedView, Flatlist -> ThemedText, TouchableOpacity, Picker filters)

      editTab.tsx ( uses ThemedeView, ThemedText, TextInput / Picker / Switch / DatePicker)

      +not-found

## CONTROL FLOW & STATE UPDATES  

Legend:  
🔵 = callback passed down  
🟣 = state update triggered  
🟢 = UI re-render  

- **addTab**
  - 🔵 `onChangeText` / `onValueChange` → updates `form`, `packaging`, `ripeness`
  - 🔵 `onDateChange` → updates `form.expiration`
  - 🔵 `addIngredient()` → 🟣 adds ingredient to `ingredients` → 🟢 updates FlatList
  - 🔵 `handleBarcodeScan()` → 🟣 sets `form.name` → 🟢 input field updates  

- **expiringTab**
  - 🔵 `markAsChecked()` → 🟣 updates `lastChecked` in storage + `ingredients` → 🟢 FlatList updates  

- **infoTab**
  - 🔵 `Picker onValueChange` → 🟣 updates filter states → 🟣 `visibleItems` → 🟢 FlatList updates  
  - 🔵 `deleteIngredient()` → 🟣 updates storage + `visibleItems` → 🟢 FlatList updates  
  - 🔵 `editIngredient()` → navigates to `editTab` with data  

- **editTab**
  - 🔵 `onChangeText` / `onValueChange` → 🟣 updates `form`, `packaging`, `ripeness`
  - 🔵 `handleSave()` → 🟣 updates storage → 🟢 returns to infoTab refreshed  


## UTILITY & HOOKS FLOW  

- `useRipeness` 🟣 updates `packaging`, auto-clears `ripeness` if not fresh  
- `useConfectionStatus` 🟣 updates `isOpen`, auto-clears if not confection  
- `getEstimatedDate`, `getExpiringSoon`, `needsRipenessCheck` power date/ripeness logic  


## FUNCTIONALITIES

**Persistence**
Ingredient data persists across app sessions (e.g., stored in local storage / DB).
✅ Uses `AsyncStorage`. Data is loaded and saved in all relevant screens.

**Ripeness**
Fresh ingredients have a ripeness/maturity status (e.g., green, ripe, too ripe).
✅ Ripeness is implemented via `useRipeness` and status can be edited.

**Frozen** 
Fresh ingredients can be frozen, extending expiration by at least 6 months.                                                               
✅ Auto-extending  when item is frozen.

**Open**
Confectioned ingredients can be marked as "open". 
✅ `isOpen` is tracked

**Barcode scanning**
App can scan barcodes, query OpenFoodFacts, and retrieve product info.                                                                     
✅ Uses `expo-camera` + OpenFoodFacts API in `addTab`.

**Brand**
Some items can have brands in addition to names. 
✅ `label` field in form or `Ingredient` type.

**Ripeness check query**
Ingredients with ripeness need checking if not checked in 3+ days. 
✅ `needsRipenessCheck` + `expiringTab` query filters.

## IMPLEMENTATION'S POSSIBILITIES  

- Add more filters, e.g., by ripeness  
- Set up push notifications  
- Set up a reminder function for adding ingredients (e.g."Did you add your ingredients for the week?")

