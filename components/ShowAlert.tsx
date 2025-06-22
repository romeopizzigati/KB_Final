import { Alert, Platform } from "react-native"; // Import Alert for native + detect platform (web/native)

/**
 * showConfirmation
 * Displays a confirmation dialog that offers OK/Cancel options.
 * - On web: uses `window.confirm`.
 * - On native: uses React Native's Alert.
 */
export const showConfirmation = (
  title: string,
  message: string,
  onConfirm?: () => void, // Callback if user confirms
  onCancel?: () => void   // Callback if user cancels
) => {
  if (Platform.OS === "web") {
    // On web: use the browser's native confirm dialog
    const confirmAction = window.confirm(`${title}\n\n${message}`); 
    if (confirmAction) {
      // User clicked OK
      onConfirm?.();
    } else {
      // User clicked Cancel
      onCancel?.();
    }
  } else {
    // On native: use React Native's Alert with two buttons
    Alert.alert(
      title,
      message,
      [
        { text: "Cancel", onPress: onCancel, style: "cancel" }, // Cancel button
        { text: "OK", onPress: onConfirm },                    // Confirm button
      ]
    );
  }
};

/**
 * showAlert
 * Displays a simple alert with an OK button.
 * - On web: uses `window.alert`.
 * - On native: uses React Native's Alert.
 */
export const showAlert = (
  title: string,
  message: string,
  onConfirm?: () => void // Optional callback when OK is pressed
) => {
  if (Platform.OS === "web") {
    // On web: show alert dialog
    window.alert(`${title}\n\n${message}`);
    if (onConfirm) {
      // Call the callback right after OK is clicked
      onConfirm();
    }
  } else {
    // On native: show alert with single OK button
    Alert.alert(
      title,
      message,
      [
        { text: "OK", onPress: onConfirm }
      ]
    );
  }
};

