import { useEffect, useMemo, useState } from "react";

// Custom hook for managing packaging + ripeness status
export const useRipeness = (
  initialPackaging: string,             
  initialRipeness: string = ""         
) => {
  const [packaging, setPackaging] = useState(initialPackaging); 
  const [ripeness, setRipeness] = useState(initialRipeness);

  // Is packaging value of type "fresh"? Recomputes if packaging changes
  const isFresh = useMemo(() => packaging === "fresh", [packaging]);

 // Effect: whenever packaging type changes and it's no longer "fresh", ripeness is reset
  useEffect(() => {
    if (!isFresh) {
      setRipeness(""); // Clear ripeness if packaging isn't fresh
    }
  }, [isFresh, ripeness]); 

  // Return state values + setters + derived fresh status
  return {
    packaging,     // Current packaging value
    setPackaging,  // Setter for packaging
    ripeness,      // Current ripeness value
    setRipeness,   // Setter for ripeness
    isFresh,       // Is the packaging "fresh"?
  };
};
