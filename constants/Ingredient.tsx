export interface Ingredient {
    name: string;
    label?: string;
    category?: string;
    location?: string;
    packing?: string;
    status?: string;
    isOpened?: boolean;
    expirationDate: string; // Stored as YYYY-MM-DD
    ripenessChangedAt?: string;
    lastChecked?: string;
    isOpen?: boolean;
  }