export type UnifiedFoodProduct = {
  source: "openfoodfacts" | "bonhappetee" | "fatsecret" | "merged";

  name: string;
  brand: string;
  barcode?: string;
  image?: string;
  ingredients?: string;

  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  sugar?: number;
  salt?: number;
  fiber?: number;
  saturatedFat?: number;
  sodium?: number;

  nutriscore?: string;
  nova?: string | number;

  healthTags?: string[];
  alternatives?: string[];

  confidence: number;
};