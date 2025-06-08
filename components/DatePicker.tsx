import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React from "react";
import { Platform } from "react-native";

// Local imports
import { ThemedView } from "@/components/ThemedView";
import { styles } from "@/components/ui/Styles";
import { ThemedText } from './ThemedText';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  // Handles the date change event
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <ThemedView style={{ alignItems: "center", marginBottom: 12 }}>
      {Platform.OS === "web" ? (
        // Web input fallback
        <input
          type="date"
          style={styles.input}
          value={date.toISOString().split("T")[0]}
          onChange={(event) => {
            const newDate = new Date(event.target.value);
            if (!isNaN(newDate.getTime())) {
              onDateChange(newDate);
            }
          }}
        />
      ) : (
        // Native DateTimePicker directly shown (no toggle)
        <>
      <ThemedText style={styles.switchContainer}>
          OPEN CALENDAR ⬇️
      </ThemedText>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          style={{ alignSelf: 'center' }}
        />
      </>
      )}
    </ThemedView>
  );
};

export default DatePicker;
