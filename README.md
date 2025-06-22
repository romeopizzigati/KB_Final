# Kitchen Buddy 🍽️  

This is an [Expo](https://expo.dev) project developed with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

It is used to manage and track kitchen ingredients, to make our food inventory at least 90% less messy than before. (It can't do miracles)

The App was developed by **Romeo Pizzigati** AKA **Student: 23027** 

## 📋 COMPONENTS OVERVIEW  

| Component | Props | State | Functionality |

| `TabLayout` | none | Uses `useColorScheme` | The main navigator for the app. Sets up the bottom tabs: `addTab`, `expiringTab`, `infoTab`. Handles their tab styling, too. |

| `addTab` | none | `form`, `ingredients`, `cameraPermission`, `scanning`, `loading`, `packaging`, `ripeness`, `isOpen` | Screen to add new ingredients. Manages form input, barcode scanning, and saves data to storage. |

| `expiringTab` | none | `ingredients` | 	Screen to add new ingredients. Manages form input, barcode scanning, and saves data to storage. |

| `infoTab` | none | `allItems`, `visibleItems`, `chosenCategory`, `chosenLocation`, `chosenPackaging`, `filter` | Shows all ingredients based on filter(s) selection (category, location, packaging) + makes it possible to delete or edit them. |

| `editTab` | none | `form`, `packaging`, `ripeness`, `isOpen` | Allows editing an existing ingredient’s details. Updates asynchronous storage after save. |

| `index.tsx (HomeScreen)` | none | none | Landing screen. Lets user navigate to any tab via buttons. |

| `ThemedText` | `type`, `lightColor`, `darkColor`, native `TextProps` | none | Custom text component that adapts color/style to light/dark theme.|

| `ThemedView` | `lightColor`, `darkColor`, native `ViewProps` | none | Custom container that adapts background color to theme. |

| `DatePicker` | `date: Date`, `onDateChange: (Date) => void` | none | 	Wrapper around native/web date input. Calls back when user picks date. |

| `HapticTab` | `BottomTabBarButtonProps` | none | Custom tab button that gives haptic feedback on press (iOS). |

!!!!!!
| `ParallaxScrollView` | `headerImage`, `headerBackgroundColor` | internal animated values | Provides scrollable view with a header that moves/zooms as user scrolls. |
!!!!!!

| `ShowAlert` (fn) | `showAlert(title, msg)`, `showConfirmation(title, msg, onConfirm, onCancel)` | none | Utility functions for showing alerts or confirmations, native/web. |

| `IconSymbol` | `name`, `size`, `color`, `style`, `weight` | none | Displays a symbol icon from system fonts (iOS, macOS). |


## 🌳 COMPONENT TREE  
RootLayout
 └── Stack.Navigator
     ├── index.tsx (That is the home screen, which is shown once at the app start)
     ├── (tabs)/layout.tsx (TabLayout)
          ├── addTab.tsx
          │         ├── ThemedView
          │         ├── ThemedText
          │         ├── TextInput / Picker / Switch / DatePicker
          │         └── Modal -> CameraView
          ├── expiringTab.tsx
          │         ├── ThemedView
          │         └── FlatList -> ThemedText, TouchableOpacity
          ├── infoTab.tsx
          │         ├── ThemedView
          │         ├── FlatList -> ThemedText, TouchableOpacity
          │         └── Picker filters
          ├── editTab.tsx
          │         ├── ThemedView
          │         ├── ThemedText
          │         └── TextInput / Picker / Switch / DatePicker
          └── +not-found

## 🔄 CONTROL FLOW & STATE UPDATES  

Legend:  
🔵 = callback passed down  
🟣 = state update triggered  
🟢 = causes UI re-render  

### Example callback and state flows:  

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


## 📌 UTILITY + HOOKS FLOW  

- `useRipeness` 🟣 updates `packaging`, auto-clears `ripeness` if not fresh  
- `useConfectionStatus` 🟣 updates `isOpen`, auto-clears if not confection  
- `getEstimatedDate`, `getExpiringSoon`, `needsRipenessCheck` power date/ripeness logic  

## 💡 The Type Ingredient  

{
  name: string;
  label?: string;
  category?: string;
  location?: string;
  packing?: string;
  status?: string;
  isOpened?: boolean;
  expirationDate: string;
  ripenessChangedAt?: string;
  lastChecked?: string;
  isOpen?: boolean;
}


## 🎨 THEMING  

- **Light mode:**  
  Background: `#FFF8F0`  
  Text: `#3B2F2F`  
  Tint: `#D97706`  

- **Dark mode:**  
  Background: `#2E2A25`  
  Text: `#F5F3E7`  
  Tint: `#FCD34D`  


## 📦 STORAGE  

- Ingredients stored in `AsyncStorage` key: `"ingredients"`  
- All tabs load from / update this store  


## 🛠 SETUP  

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

    npx expo start

3. Troubleshooting

    npx expo start --tunnel

## FUNCTIONALITIES CHECKLIST

**Persistence**
Ingredient data persists across app sessions (e.g., stored in local storage / DB).
✅ Uses `AsyncStorage`. Data is loaded and saved in all relevant screens.

**Ripeness**
Fresh ingredients have a ripeness/maturity status (e.g., green, ripe, too ripe).
✅ Ripeness is implemented via `useRipeness` and status can be edited.

!!!!
**Frozen** 
Fresh ingredients can be frozen, extending expiration by at least 6 months.                                                               
Not implemented — no explicit handling for freezing fresh ingredients or auto-extending expiry.                                                                |
!!!!

**Open**
Confectioned ingredients can be marked as "open". 
 `isOpen` is tracked, and shown in components. 

!!!But expiry adjustment logic for opened items isn’t implemented (no auto-calculation).!!!

**Barcode scanning**
App can scan barcodes, query OpenFoodFacts, and retrieve product info.                                                                     
✅ Implemented. Uses `expo-camera` + OpenFoodFacts API in `addTab`.

**Brand**
Some items can have brands in addition to names. 
✅ Implemented. `label` field in form or `Ingredient` type.

**Ripeness check query**
Ingredients with ripeness need checking if not checked in 3+ days. 
✅ Implemented. `needsRipenessCheck` + `expiringTab` query filters.

!!!!!
**Expiring soon query** 
Ripe + open items show up in "expiring soon". Frozen items are excluded unless near expiry.                                              
⚠️ Partial — `expiringTab` includes ripe + open items. Frozen exclusion logic isn’t implemented (frozen packaging does not modify expiry in code).                |
!!!!!

## 🌱 IMPLEMENTATION'S POSSIBILITIES  

- Add more filters, e.g., by ripeness  
- Set up push notifications  
- Set up a reminder function for adding ingredients

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
