import { useEffect, useMemo, useState } from "react";

export const useCanStatus = (packaging: string, initialIsOpen: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const isCanned = useMemo(() => packaging === "canned", [packaging]);

  useEffect(() => {
    if (!isCanned) {
      setIsOpen(false);
    }
  }, [isCanned]);

  return { isOpen, setIsOpen, isCanned };
};

