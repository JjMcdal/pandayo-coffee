export const INVENTORY_CATEGORIES = [
  "Coffee Beans",
  "Dairy",
  "Syrups & Flavors",
  "Packaging",
  "Ingredients",
] as const;

export type InventoryCategory = (typeof INVENTORY_CATEGORIES)[number];

export type CatalogItem = {
  name: string;
  category: InventoryCategory;
  unit: "kg" | "g" | "L" | "ml" | "pcs";
};

export const INVENTORY_CATALOG: CatalogItem[] = [
  // Coffee Beans
  { name: "Coffee Beans", category: "Coffee Beans", unit: "kg" },
  { name: "Arabica Beans", category: "Coffee Beans", unit: "kg" },
  { name: "Robusta Beans", category: "Coffee Beans", unit: "kg" },
  { name: "Espresso Blend", category: "Coffee Beans", unit: "kg" },
  { name: "Decaf Beans", category: "Coffee Beans", unit: "kg" },

  // Dairy
  { name: "Whole Milk", category: "Dairy", unit: "L" },
  { name: "Fresh Milk", category: "Dairy", unit: "L" },
  { name: "Oat Milk", category: "Dairy", unit: "L" },
  { name: "Almond Milk", category: "Dairy", unit: "L" },
  { name: "Evaporated Milk", category: "Dairy", unit: "L" },
  { name: "Condensed Milk", category: "Dairy", unit: "L" },
  { name: "Heavy Cream", category: "Dairy", unit: "L" },

  // Syrups & Flavors
  { name: "Vanilla Syrup", category: "Syrups & Flavors", unit: "L" },
  { name: "Caramel Syrup", category: "Syrups & Flavors", unit: "L" },
  { name: "Hazelnut Syrup", category: "Syrups & Flavors", unit: "L" },
  { name: "Chocolate Sauce", category: "Syrups & Flavors", unit: "L" },
  { name: "Caramel Sauce", category: "Syrups & Flavors", unit: "L" },
  { name: "Matcha Powder", category: "Syrups & Flavors", unit: "kg" },
  { name: "Cocoa Powder", category: "Syrups & Flavors", unit: "kg" },

  // Packaging
  { name: "Plastic Cups 12oz", category: "Packaging", unit: "pcs" },
  { name: "Plastic Cups 16oz", category: "Packaging", unit: "pcs" },
  { name: "Hot Cups 8oz", category: "Packaging", unit: "pcs" },
  { name: "Cup Lids", category: "Packaging", unit: "pcs" },
  { name: "Straws", category: "Packaging", unit: "pcs" },
  { name: "Cup Sleeves", category: "Packaging", unit: "pcs" },
  { name: "Paper Bags", category: "Packaging", unit: "pcs" },

  // Ingredients
  { name: "White Sugar", category: "Ingredients", unit: "kg" },
  { name: "Brown Sugar", category: "Ingredients", unit: "kg" },
  { name: "Ice", category: "Ingredients", unit: "kg" },
  { name: "Drinking Water", category: "Ingredients", unit: "L" },
  { name: "Cinnamon Powder", category: "Ingredients", unit: "g" },
];

// Case-insensitive, whitespace-tolerant exact match against the catalog.
export function findCatalogItem(input: string): CatalogItem | undefined {
  const key = input.trim().toLowerCase().replace(/\s+/g, " ");
  return INVENTORY_CATALOG.find((item) => item.name.toLowerCase() === key);
}