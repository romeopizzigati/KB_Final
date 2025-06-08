import { useEffect, useMemo, useState } from "react";

export const useRipeness = (initialPackaging: string, initialRipeness: string = "") => {
  const [packaging, setPackaging] = useState(initialPackaging);
  const [ripeness, setRipeness] = useState(initialRipeness);

  const isFresh = useMemo(() => packaging === "fresh", [packaging]);

  // Reset ripeness when the confection type changes to non-fresh
  useEffect(() => {
    if (!isFresh) {
      setRipeness("");
    }
  }, [ripeness, isFresh]);

  return { packaging, setPackaging, ripeness, setRipeness, isFresh };
};