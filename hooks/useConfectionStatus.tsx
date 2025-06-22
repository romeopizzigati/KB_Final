import { useEffect, useMemo, useState } from "react";

export const useConfectionStatus = (
  packaging: string,              
  initialIsOpen: boolean = false  // Initial value for isOpen, defaults to false
) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  // Is packaging value of type "confection"? Recomputes if `packaging` changes
  const isConfectioned = useMemo(() => packaging === "confection", [packaging]);

  // Effect: whenever packaging type changes and it's no longer "confection" isOpen is false
  useEffect(() => {
    if (!isConfectioned) {
      setIsOpen(false);
    }
  }, [isConfectioned]);

  // Return state and updater + status flag
  return {
    isOpen,          // Boolean ("is it open?")
    setIsOpen,       // To update `isOpen`
    isConfectioned,  // Boolean ("is it "confection"?")
  };
};


