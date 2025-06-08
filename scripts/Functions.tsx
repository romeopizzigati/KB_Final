// Local imports
import { Ingredient } from "@/constants/Ingredient";
  
// transforming estimated date into a DATE string (USED in addTab)
export const getEstimatedDate = (estimate: string): string => {
  const date = new Date();
  const daysMap: Record<string, number> = {
    "1 day": 1,
    "2 days": 2,
    "3 days": 3,
    "1 week": 7,
    "10 days": 10,
    "1 month": 30,
  };
  date.setDate(date.getDate() + (daysMap[estimate] || 0));
  return estimate ? date.toISOString().split("T")[0] : ""; // we use split "T" to only keep the Date, and not the current time
};


const getDaysUntilExpiration = (expirationDate: string): number => {
  const today = new Date();
  const expDate = new Date(expirationDate);
  const diffTime = expDate.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};

// 1. Gets ingredients expiring soon  (FILTER IN expiringTab -> uses getDaysUntilExpiration (declared here))
export const getExpiringSoon = (ingredients: Ingredient[], daysThreshold: number = 3) => {
  return ingredients.filter(
    (ingredient) =>
      ingredient.expirationDate &&
      getDaysUntilExpiration(ingredient.expirationDate) <= daysThreshold
  );
};

export const needsRipenessCheck = (item: Ingredient): boolean => {
  if (!item.status) return false;

  const lastChecked = item.lastChecked ? new Date(item.lastChecked) : null;
  const now = new Date();

  if (!lastChecked) return true; // Never checked
  const daysSinceCheck = (now.getTime() - lastChecked.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceCheck > 3;
};


// 2. Gets ingredients missing data (FILTER #1 IN infoTab)
export const getMissingData = (ingredients: Ingredient[]) => {
  return ingredients.filter(
    (ingredient) => !ingredient.category || !ingredient.location || !ingredient.expirationDate
  );
};

// 3. Gets most recently added ingredients (FILTER #2 IN infoTab)
export const getRecentlyAdded = (ingredients: Ingredient[], limit: number = 5) => {
  return ingredients.slice(-limit).reverse();
};

// 4. Gets ingredients by category type (FILTER #3 IN infoTab)
export const getbyCategory = (ingredients: Ingredient[], category?: string) => {
  return ingredients.filter(
    (ingredient) => (category && ingredient.category === category)
  );
};

// 5. Gets ingredients by packaging type (FILTER #4 IN infoTab)
export const getByPackaging = (ingredients: Ingredient[], packing?: string) => {
  return ingredients.filter(
    (ingredient) => (packing && ingredient.packing === packing)
  );
};

// 5. Gets ingredients by location (FILTER #5 IN infoTab)
export const getByLocation = (ingredients: Ingredient[], location: string) => {
  return ingredients.filter((ingredient) => ingredient.location === location);
};