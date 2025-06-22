// Imports
// External
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";

// Custom
import { ThemedView } from "@/components/ThemedView";
import { styles } from "@/components/ui/Styles";
import { ThemedText } from './ThemedText';

// Define props for the DatePicker component
interface DatePickerProps {
  date: Date; // The current selected date
  onDateChange: (date: Date) => void; // Callback when date is changed
}

// DatePicker component
const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  // Handler for native DateTimePicker change
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      // Call parent-provided function with new date
      onDateChange(selectedDate);
    }
  };

  return (
    <ThemedView style={{ alignItems: "center", marginBottom: 12 }}>
      {Platform.OS === "web" ? (
        // Web platform: use HTML input element 
        <input
          type="date"
          style={styles.input} 
          value={date.toISOString().split("T")[0]} // Format date as YYYY-MM-DD
          onChange={(event) => {
            // When user picks a date...
            const newDate = new Date(event.target.value);
            if (!isNaN(newDate.getTime())) {
              // ... make sure it's valid
              onDateChange(newDate);
            }
          }}
        />
      ) : (
        // Native platforms (iOS/Android): use native date picker
        <>
          <ThemedText style={styles.switchContainer}>
            OPEN CALENDAR ⬇️
          </ThemedText>
          <DateTimePicker
            value={date} // The current date value
            mode="date" // Show DATE selection (e.g. not time)
            display="default" // Default OS-specific style
            onChange={handleDateChange} // Trigger on change
            style={{ alignSelf: 'center' }} // Center align on screen
          />
        </>
      )}
    </ThemedView>
  );
};

export default DatePicker;
