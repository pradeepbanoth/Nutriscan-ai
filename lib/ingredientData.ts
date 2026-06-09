export type IngredientRisk = "Low" | "Moderate" | "High";

export type IngredientProfile = {
  name: string;
  category: string;
  risk: IngredientRisk;
  usedIn: string;
  purpose: string;
  pausticaView: string;
};



export const ingredientData: Record<string, IngredientProfile> = {
  aspartame: {
    name: "Aspartame",
    category: "Artificial Sweetener",
    risk: "Moderate",
    usedIn: "Diet drinks, sugar-free foods, chewing gum, low-calorie desserts",
    purpose: "Provides sweetness without adding sugar or many calories.",
    pausticaView:
      "Aspartame is approved within daily intake limits, but PAUSTICA flags it because many users prefer tracking artificial sweeteners.",
  },

  "acesulfame-k": {
    name: "Acesulfame K",
    category: "Artificial Sweetener",
    risk: "Moderate",
    usedIn: "Diet sodas, sugar-free snacks, protein products, low-calorie drinks",
    purpose: "Adds strong sweetness with little to no calories.",
    pausticaView:
      "Often used with other sweeteners. PAUSTICA flags it as moderate because it commonly appears in ultra-processed foods.",
  },

  sucralose: {
    name: "Sucralose",
    category: "Artificial Sweetener",
    risk: "Moderate",
    usedIn: "Sugar-free drinks, protein powders, diet foods, low-calorie snacks",
    purpose: "Provides sweetness without sugar.",
    pausticaView:
      "Sucralose is widely used in low-calorie foods. PAUSTICA marks it as moderate so users can track artificial sweetener exposure.",
  },

  saccharin: {
    name: "Saccharin",
    category: "Artificial Sweetener",
    risk: "Moderate",
    usedIn: "Tabletop sweeteners, diet drinks, sugar-free foods",
    purpose: "Provides intense sweetness without sugar.",
    pausticaView:
      "Saccharin is an older artificial sweetener. PAUSTICA flags it as moderate for users who want to limit artificial sweeteners.",
  },

  stevia: {
    name: "Stevia",
    category: "Non-Sugar Sweetener",
    risk: "Low",
    usedIn: "Low-calorie drinks, diabetic-friendly foods, protein products",
    purpose: "Adds sweetness with little to no sugar.",
    pausticaView:
      "Stevia is generally viewed as a better sweetener option, but PAUSTICA still tracks it because it is often used in processed foods.",
  },

  erythritol: {
    name: "Erythritol",
    category: "Sugar Alcohol",
    risk: "Moderate",
    usedIn: "Keto snacks, sugar-free chocolate, protein bars, low-carb products",
    purpose: "Adds sweetness with fewer calories than sugar.",
    pausticaView:
      "Erythritol may cause digestive discomfort for some people. PAUSTICA flags it as moderate, especially in frequent-use products.",
  },

  xylitol: {
    name: "Xylitol",
    category: "Sugar Alcohol",
    risk: "Moderate",
    usedIn: "Sugar-free gum, candies, dental products, low-sugar snacks",
    purpose: "Adds sweetness and may support dental-friendly formulations.",
    pausticaView:
      "Xylitol is common in sugar-free products. PAUSTICA marks it moderate because sugar alcohols can cause digestive discomfort.",
  },

  sorbitol: {
    name: "Sorbitol",
    category: "Sugar Alcohol",
    risk: "Moderate",
    usedIn: "Sugar-free candies, chewing gum, desserts, diabetic foods",
    purpose: "Adds sweetness and helps retain moisture.",
    pausticaView:
      "Sorbitol can cause bloating or laxative effects in some users, especially at higher intake.",
  },

  msg: {
    name: "MSG",
    category: "Flavor Enhancer",
    risk: "Moderate",
    usedIn: "Instant noodles, chips, soups, sauces, savory snacks",
    purpose: "Enhances umami flavor and makes foods taste more savory.",
    pausticaView:
      "MSG is considered safe for most people in normal use, but PAUSTICA flags it for transparency and sensitivity tracking.",
  },

  "monosodium-glutamate": {
    name: "Monosodium Glutamate",
    category: "Flavor Enhancer",
    risk: "Moderate",
    usedIn: "Instant noodles, chips, seasoning mixes, soups, sauces",
    purpose: "Boosts savory taste and umami flavor.",
    pausticaView:
      "Same as MSG. PAUSTICA flags it because users often want to know when flavor enhancers are present.",
  },

  "sodium-benzoate": {
    name: "Sodium Benzoate",
    category: "Preservative",
    risk: "Moderate",
    usedIn: "Soft drinks, sauces, pickles, packaged juices, acidic foods",
    purpose: "Helps prevent spoilage by limiting microbial growth.",
    pausticaView:
      "Useful for shelf life, but frequent intake through processed foods may be worth monitoring.",
  },

  "potassium-benzoate": {
    name: "Potassium Benzoate",
    category: "Preservative",
    risk: "Moderate",
    usedIn: "Soft drinks, fruit juices, sauces, acidic packaged foods",
    purpose: "Prevents growth of yeast, mold, and bacteria.",
    pausticaView:
      "PAUSTICA flags it as moderate because it is common in processed drinks and preserved foods.",
  },

  "potassium-sorbate": {
    name: "Potassium Sorbate",
    category: "Preservative",
    risk: "Moderate",
    usedIn: "Cheese, baked goods, sauces, beverages, jams",
    purpose: "Helps prevent mold and yeast growth.",
    pausticaView:
      "Often safe in small amounts, but PAUSTICA tracks it because it indicates preservative use.",
  },

  "calcium-propionate": {
    name: "Calcium Propionate",
    category: "Preservative",
    risk: "Moderate",
    usedIn: "Bread, bakery products, buns, packaged baked foods",
    purpose: "Prevents mold growth and extends shelf life.",
    pausticaView:
      "Common in packaged breads. PAUSTICA flags it because it signals processed bakery formulation.",
  },

  "sodium-nitrite": {
    name: "Sodium Nitrite",
    category: "Preservative",
    risk: "High",
    usedIn: "Processed meats, sausages, bacon, cured meat products",
    purpose: "Preserves color, flavor, and inhibits bacterial growth.",
    pausticaView:
      "PAUSTICA flags sodium nitrite as high concern because it is strongly associated with processed meats.",
  },

  "sodium-nitrate": {
    name: "Sodium Nitrate",
    category: "Preservative",
    risk: "High",
    usedIn: "Cured meats, processed meats, preserved meat products",
    purpose: "Helps preserve cured meats and maintain color.",
    pausticaView:
      "PAUSTICA marks it high because nitrate preservatives are commonly linked with processed meat concerns.",
  },

  sulfites: {
    name: "Sulfites",
    category: "Preservative",
    risk: "Moderate",
    usedIn: "Dried fruits, juices, sauces, packaged foods",
    purpose: "Prevents browning and extends shelf life.",
    pausticaView:
      "Some people are sensitive to sulfites. PAUSTICA flags them so users can notice preserved foods more easily.",
  },

  bha: {
    name: "BHA",
    category: "Antioxidant Preservative",
    risk: "High",
    usedIn: "Snack foods, cereals, chewing gum, packaged fats",
    purpose: "Prevents fats and oils from going rancid.",
    pausticaView:
      "PAUSTICA marks BHA as high concern because many users prefer avoiding controversial synthetic preservatives.",
  },

  bht: {
    name: "BHT",
    category: "Antioxidant Preservative",
    risk: "Moderate",
    usedIn: "Cereals, chips, snack foods, chewing gum, packaged fats",
    purpose: "Protects oils and fats from oxidation.",
    pausticaView:
      "PAUSTICA flags BHT as moderate because it is a synthetic preservative often found in processed foods.",
  },

  tbhq: {
    name: "TBHQ",
    category: "Antioxidant Preservative",
    risk: "High",
    usedIn: "Instant noodles, chips, crackers, fried snacks, packaged oils",
    purpose: "Extends shelf life by slowing fat oxidation.",
    pausticaView:
      "PAUSTICA marks TBHQ high because it is a synthetic preservative commonly found in highly processed snacks.",
  },

  "high-fructose-corn-syrup": {
    name: "High Fructose Corn Syrup",
    category: "Added Sugar",
    risk: "High",
    usedIn: "Soft drinks, candies, packaged desserts, sweetened beverages",
    purpose: "Adds sweetness and improves shelf stability.",
    pausticaView:
      "PAUSTICA flags this as high risk because frequent intake of added sugars can contribute to poor diet quality.",
  },

  "glucose-syrup": {
    name: "Glucose Syrup",
    category: "Added Sugar",
    risk: "High",
    usedIn: "Candies, biscuits, desserts, ice creams, processed snacks",
    purpose: "Adds sweetness, texture, and moisture control.",
    pausticaView:
      "PAUSTICA flags glucose syrup because it contributes to added sugar load in processed foods.",
  },

  dextrose: {
    name: "Dextrose",
    category: "Added Sugar",
    risk: "Moderate",
    usedIn: "Snacks, bakery products, sports foods, processed meats",
    purpose: "Adds sweetness and supports browning or texture.",
    pausticaView:
      "Dextrose is a fast-digesting sugar. PAUSTICA flags it for users watching sugar intake.",
  },

  "invert-sugar": {
    name: "Invert Sugar",
    category: "Added Sugar",
    risk: "High",
    usedIn: "Candies, baked goods, soft drinks, desserts",
    purpose: "Adds sweetness and helps retain moisture.",
    pausticaView:
      "PAUSTICA marks it high when frequently consumed because it contributes to added sugar exposure.",
  },

  maltodextrin: {
    name: "Maltodextrin",
    category: "Processed Carbohydrate",
    risk: "Moderate",
    usedIn: "Chips, protein powders, instant foods, sauces, snacks",
    purpose: "Improves texture, thickness, and shelf stability.",
    pausticaView:
      "Maltodextrin is highly processed and may matter for users watching blood sugar.",
  },

  "artificial-flavors": {
    name: "Artificial Flavors",
    category: "Flavor Additive",
    risk: "Moderate",
    usedIn: "Snacks, candies, drinks, desserts, instant foods",
    purpose: "Creates or strengthens flavor.",
    pausticaView:
      "PAUSTICA flags artificial flavors because they often indicate more processed formulations.",
  },

  "natural-flavors": {
    name: "Natural Flavors",
    category: "Flavor Additive",
    risk: "Low",
    usedIn: "Drinks, snacks, sauces, cereals, desserts",
    purpose: "Adds flavor from natural source-derived compounds.",
    pausticaView:
      "Natural flavors are common and usually low concern, but PAUSTICA tracks them because the term is broad and not very specific.",
  },

  "caramel-color": {
    name: "Caramel Color",
    category: "Color Additive",
    risk: "Moderate",
    usedIn: "Colas, sauces, candies, packaged beverages",
    purpose: "Adds brown color.",
    pausticaView:
      "PAUSTICA flags caramel color as moderate because it is common in soft drinks and highly processed foods.",
  },

  "titanium-dioxide": {
    name: "Titanium Dioxide",
    category: "Color Additive",
    risk: "High",
    usedIn: "Candies, chewing gum, coatings, some processed foods",
    purpose: "Adds whiteness or brightness.",
    pausticaView:
      "PAUSTICA flags titanium dioxide as high concern because its food additive safety has been questioned by some regulators.",
  },

  tartrazine: {
    name: "Tartrazine",
    category: "Artificial Color",
    risk: "Moderate",
    usedIn: "Candies, drinks, chips, desserts, packaged snacks",
    purpose: "Adds yellow color.",
    pausticaView:
      "PAUSTICA flags tartrazine because artificial colors are important for users tracking additives.",
  },

  "sunset-yellow": {
    name: "Sunset Yellow",
    category: "Artificial Color",
    risk: "Moderate",
    usedIn: "Soft drinks, candies, snacks, desserts",
    purpose: "Adds orange-yellow color.",
    pausticaView:
      "PAUSTICA marks it moderate because it is a synthetic color often found in processed foods.",
  },

  "allura-red": {
    name: "Allura Red",
    category: "Artificial Color",
    risk: "Moderate",
    usedIn: "Candies, drinks, desserts, cereals, snacks",
    purpose: "Adds red color.",
    pausticaView:
      "PAUSTICA flags allura red to help users identify synthetic food colors.",
  },

  "brilliant-blue": {
    name: "Brilliant Blue",
    category: "Artificial Color",
    risk: "Moderate",
    usedIn: "Candies, beverages, desserts, decorated foods",
    purpose: "Adds blue color.",
    pausticaView:
      "PAUSTICA tracks brilliant blue as an artificial color commonly used in processed foods.",
  },

  carmine: {
    name: "Carmine",
    category: "Color Additive",
    risk: "Low",
    usedIn: "Candies, yogurts, drinks, cosmetics, desserts",
    purpose: "Adds red or pink color.",
    pausticaView:
      "Carmine is a natural-derived color, but PAUSTICA highlights it because some users avoid animal-derived ingredients.",
  },

  annatto: {
    name: "Annatto",
    category: "Natural Color",
    risk: "Low",
    usedIn: "Cheese, butter, snacks, bakery products",
    purpose: "Adds yellow-orange color.",
    pausticaView:
      "Annatto is generally lower concern and often used as a natural color.",
  },

  "citric-acid": {
    name: "Citric Acid",
    category: "Acidity Regulator",
    risk: "Low",
    usedIn: "Soft drinks, candies, sauces, juices, packaged foods",
    purpose: "Adds sourness, controls acidity, and supports preservation.",
    pausticaView:
      "Citric acid is common and usually low concern, but PAUSTICA tracks it as part of processing analysis.",
  },

  "xanthan-gum": {
    name: "Xanthan Gum",
    category: "Thickener / Stabilizer",
    risk: "Low",
    usedIn: "Sauces, gluten-free foods, dressings, dairy alternatives",
    purpose: "Improves thickness and texture.",
    pausticaView:
      "Usually low concern, but some people may experience digestive sensitivity.",
  },

  "guar-gum": {
    name: "Guar Gum",
    category: "Thickener / Stabilizer",
    risk: "Low",
    usedIn: "Ice cream, sauces, gluten-free foods, dairy alternatives",
    purpose: "Improves thickness and texture.",
    pausticaView:
      "Generally low concern and commonly used for texture, but PAUSTICA tracks it in processed foods.",
  },

  carrageenan: {
    name: "Carrageenan",
    category: "Thickener / Stabilizer",
    risk: "Moderate",
    usedIn: "Dairy alternatives, ice creams, sauces, processed desserts",
    purpose: "Improves texture and prevents separation.",
    pausticaView:
      "Some people prefer avoiding it due to digestive sensitivity concerns, so PAUSTICA flags it as moderate.",
  },

  pectin: {
    name: "Pectin",
    category: "Thickener / Gelling Agent",
    risk: "Low",
    usedIn: "Jams, jellies, fruit fillings, candies",
    purpose: "Thickens and gels foods.",
    pausticaView:
      "Pectin is generally low concern and commonly derived from fruits.",
  },

  agar: {
    name: "Agar",
    category: "Gelling Agent",
    risk: "Low",
    usedIn: "Desserts, jellies, vegan foods, confectionery",
    purpose: "Creates gel texture.",
    pausticaView:
      "Agar is generally low concern and often used as a plant-based gelling agent.",
  },

  "cellulose-gum": {
    name: "Cellulose Gum",
    category: "Thickener / Stabilizer",
    risk: "Low",
    usedIn: "Ice cream, sauces, gluten-free foods, processed snacks",
    purpose: "Improves texture and prevents separation.",
    pausticaView:
      "Usually low concern, but it still indicates a more formulated processed product.",
  },

  "palm-oil": {
    name: "Palm Oil",
    category: "Refined Oil",
    risk: "Moderate",
    usedIn: "Biscuits, chocolates, spreads, instant noodles, packaged snacks",
    purpose: "Improves texture, shelf life, and mouthfeel.",
    pausticaView:
      "PAUSTICA flags palm oil because it may increase saturated fat intake and often appears in ultra-processed products.",
  },

  "vegetable-oil": {
    name: "Vegetable Oil",
    category: "Refined Oil",
    risk: "Moderate",
    usedIn: "Chips, snacks, fried foods, instant foods, bakery products",
    purpose: "Adds fat, texture, and cooking stability.",
    pausticaView:
      "A broad label that may hide the exact oil type. PAUSTICA flags it for transparency.",
  },

  "canola-oil": {
    name: "Canola Oil",
    category: "Refined Oil",
    risk: "Low",
    usedIn: "Snacks, sauces, spreads, baked goods",
    purpose: "Adds fat and improves texture.",
    pausticaView:
      "Generally lower concern than some saturated fats, but PAUSTICA tracks it in processed foods.",
  },

  "soybean-oil": {
    name: "Soybean Oil",
    category: "Refined Oil",
    risk: "Moderate",
    usedIn: "Snacks, sauces, mayonnaise, fried foods, packaged meals",
    purpose: "Adds fat, texture, and cooking stability.",
    pausticaView:
      "Common in processed foods. PAUSTICA flags it as moderate when part of highly processed products.",
  },

  "sunflower-oil": {
    name: "Sunflower Oil",
    category: "Refined Oil",
    risk: "Low",
    usedIn: "Chips, snacks, sauces, bakery products",
    purpose: "Adds fat and improves texture.",
    pausticaView:
      "Generally lower concern, but repeated intake through fried snacks can still matter.",
  },

  "hydrogenated-oil": {
    name: "Hydrogenated Oil",
    category: "Processed Fat",
    risk: "High",
    usedIn: "Bakery products, snacks, spreads, fried foods",
    purpose: "Improves shelf life and texture.",
    pausticaView:
      "PAUSTICA marks hydrogenated oils as high concern because they indicate heavily processed fats.",
  },

  "partially-hydrogenated-oil": {
    name: "Partially Hydrogenated Oil",
    category: "Trans Fat Source",
    risk: "High",
    usedIn: "Bakery products, snacks, fried foods, spreads",
    purpose: "Improves texture and shelf stability.",
    pausticaView:
      "PAUSTICA flags this as high concern because partially hydrogenated oils are strongly associated with trans fat concerns.",
  },

  "whey-protein": {
    name: "Whey Protein",
    category: "Protein Ingredient",
    risk: "Low",
    usedIn: "Protein powders, protein bars, shakes, fitness foods",
    purpose: "Adds protein and supports muscle-focused nutrition.",
    pausticaView:
      "Generally useful for protein intake, but PAUSTICA also checks sweeteners, fillers, and additives around it.",
  },

  "soy-protein-isolate": {
    name: "Soy Protein Isolate",
    category: "Protein Ingredient",
    risk: "Low",
    usedIn: "Protein bars, meat alternatives, shakes, processed vegetarian foods",
    purpose: "Adds concentrated plant protein.",
    pausticaView:
      "A concentrated protein ingredient. PAUSTICA marks it low risk but tracks it as a processed ingredient.",
  },

  "pea-protein": {
    name: "Pea Protein",
    category: "Protein Ingredient",
    risk: "Low",
    usedIn: "Plant-based protein powders, bars, meat alternatives",
    purpose: "Adds plant-based protein.",
    pausticaView:
      "Generally low concern and useful for plant-based protein, but the full product formulation still matters.",
  },


"corn-syrup": {
  name: "Corn Syrup",
  category: "Added Sugar",
  risk: "High",
  usedIn: "Candies, desserts, soft drinks, bakery products",
  purpose: "Adds sweetness and improves texture.",
  pausticaView:
    "PAUSTICA flags corn syrup because it contributes to added sugar intake.",
},

"fructose": {
  name: "Fructose",
  category: "Added Sugar",
  risk: "Moderate",
  usedIn: "Sweetened beverages, desserts, processed foods",
  purpose: "Provides sweetness.",
  pausticaView:
    "Naturally found in fruit, but added fructose is worth monitoring in processed foods.",
},

"mono-and-diglycerides": {
  name: "Mono and Diglycerides",
  category: "Emulsifier",
  risk: "Moderate",
  usedIn: "Bread, ice cream, baked goods, snacks",
  purpose: "Improves texture and prevents separation.",
  pausticaView:
    "Common in processed foods and signals industrial formulation.",
},

"soy-lecithin": {
  name: "Soy Lecithin",
  category: "Emulsifier",
  risk: "Low",
  usedIn: "Chocolate, baked goods, protein bars",
  purpose: "Helps ingredients mix evenly.",
  pausticaView:
    "Generally low concern and commonly used in packaged foods.",
},

"lecithin": {
  name: "Lecithin",
  category: "Emulsifier",
  risk: "Low",
  usedIn: "Chocolate, bakery products, spreads",
  purpose: "Improves texture and consistency.",
  pausticaView:
    "Usually low concern but indicates food processing.",
},

"polysorbate-80": {
  name: "Polysorbate 80",
  category: "Emulsifier",
  risk: "Moderate",
  usedIn: "Ice cream, sauces, desserts",
  purpose: "Improves texture and stability.",
  pausticaView:
    "PAUSTICA flags it as moderate because it is a highly processed additive.",
},

"propylene-glycol": {
  name: "Propylene Glycol",
  category: "Stabilizer",
  risk: "Moderate",
  usedIn: "Flavorings, frostings, beverages",
  purpose: "Maintains moisture and stability.",
  pausticaView:
    "Common additive used in processed foods and flavor systems.",
},

"modified-corn-starch": {
  name: "Modified Corn Starch",
  category: "Thickener",
  risk: "Moderate",
  usedIn: "Soups, sauces, snacks, desserts",
  purpose: "Improves texture and stability.",
  pausticaView:
    "Indicates industrial food processing and formulation.",
},

"modified-food-starch": {
  name: "Modified Food Starch",
  category: "Thickener",
  risk: "Moderate",
  usedIn: "Sauces, soups, desserts, packaged meals",
  purpose: "Improves consistency and texture.",
  pausticaView:
    "PAUSTICA flags it because it commonly appears in highly processed foods.",
},

"gelatin": {
  name: "Gelatin",
  category: "Gelling Agent",
  risk: "Low",
  usedIn: "Desserts, candies, marshmallows",
  purpose: "Creates gel texture.",
  pausticaView:
    "Generally low concern but important for dietary preferences.",
},

"sodium-caseinate": {
  name: "Sodium Caseinate",
  category: "Milk Protein",
  risk: "Low",
  usedIn: "Protein products, coffee creamers, desserts",
  purpose: "Adds protein and improves texture.",
  pausticaView:
    "Useful protein ingredient but indicates food formulation.",
},

"casein": {
  name: "Casein",
  category: "Milk Protein",
  risk: "Low",
  usedIn: "Protein powders, dairy foods, nutrition products",
  purpose: "Provides slow-digesting protein.",
  pausticaView:
    "Generally low concern and common in protein products.",
},

"inulin": {
  name: "Inulin",
  category: "Dietary Fiber",
  risk: "Low",
  usedIn: "Protein bars, yogurts, functional foods",
  purpose: "Adds fiber and supports texture.",
  pausticaView:
    "Generally beneficial but may cause digestive discomfort in some individuals.",
},

"guarana": {
  name: "Guarana",
  category: "Stimulant",
  risk: "Moderate",
  usedIn: "Energy drinks, supplements",
  purpose: "Provides caffeine.",
  pausticaView:
    "PAUSTICA flags guarana because it contributes to stimulant intake.",
},

"caffeine": {
  name: "Caffeine",
  category: "Stimulant",
  risk: "Moderate",
  usedIn: "Energy drinks, coffee beverages, supplements",
  purpose: "Improves alertness and energy.",
  pausticaView:
    "Useful in moderation but important to monitor in energy drinks.",
},

"taurine": {
  name: "Taurine",
  category: "Functional Ingredient",
  risk: "Low",
  usedIn: "Energy drinks",
  purpose: "Common ingredient in energy formulations.",
  pausticaView:
    "Generally low concern but often appears alongside caffeine.",
},

"maltitol": {
  name: "Maltitol",
  category: "Sugar Alcohol",
  risk: "Moderate",
  usedIn: "Sugar-free chocolates, candies",
  purpose: "Provides sweetness with fewer calories.",
  pausticaView:
    "Can cause digestive discomfort in larger amounts.",
},

"isomalt": {
  name: "Isomalt",
  category: "Sugar Alcohol",
  risk: "Moderate",
  usedIn: "Sugar-free candies and confectionery",
  purpose: "Adds sweetness and bulk.",
  pausticaView:
    "PAUSTICA flags it because sugar alcohols may affect digestion.",
},

"glycerin": {
  name: "Glycerin",
  category: "Humectant",
  risk: "Low",
  usedIn: "Protein bars, baked goods, candies",
  purpose: "Retains moisture.",
  pausticaView:
    "Generally low concern and commonly used for texture.",
},

"sodium-phosphate": {
  name: "Sodium Phosphate",
  category: "Acidity Regulator",
  risk: "Moderate",
  usedIn: "Processed meats, cheese products, baked goods",
  purpose: "Controls acidity and improves texture.",
  pausticaView:
    "PAUSTICA flags it because it commonly appears in heavily processed foods.",
},

"disodium-phosphate": {
  name: "Disodium Phosphate",
  category: "Acidity Regulator",
  risk: "Moderate",
  usedIn: "Cheese products, processed foods",
  purpose: "Controls acidity and texture.",
  pausticaView:
    "Often found in processed food formulations.",
},

"trisodium-phosphate": {
  name: "Trisodium Phosphate",
  category: "Food Additive",
  risk: "Moderate",
  usedIn: "Processed foods, cereals, meats",
  purpose: "Acidity control and texture improvement.",
  pausticaView:
    "PAUSTICA flags it because it indicates industrial processing.",
},

"yeast-extract": {
  name: "Yeast Extract",
  category: "Flavor Enhancer",
  risk: "Moderate",
  usedIn: "Soups, chips, seasoning mixes",
  purpose: "Enhances savory flavor.",
  pausticaView:
    "Functions similarly to flavor enhancers and often appears in snack foods.",
},

"dried-glucose-syrup": {
  name: "Dried Glucose Syrup",
  category: "Added Sugar",
  risk: "High",
  usedIn: "Snacks, candies, desserts",
  purpose: "Adds sweetness and texture.",
  pausticaView:
    "Contributes to added sugar intake and processing complexity.",
},

"coconut-oil": {
  name: "Coconut Oil",
  category: "Oil",
  risk: "Moderate",
  usedIn: "Chocolate, snacks, desserts",
  purpose: "Adds texture and flavor.",
  pausticaView:
    "Contains significant saturated fat and should be considered in overall diet quality.",
},

"milk-solids": {
  name: "Milk Solids",
  category: "Dairy Ingredient",
  risk: "Low",
  usedIn: "Chocolate, dairy products, desserts",
  purpose: "Adds dairy flavor and texture.",
  pausticaView:
    "Generally low concern and commonly used in dairy-based foods.",
},

"skim-milk-powder": {
  name: "Skim Milk Powder",
  category: "Dairy Ingredient",
  risk: "Low",
  usedIn: "Chocolate, beverages, dairy products",
  purpose: "Adds dairy protein and texture.",
  pausticaView:
    "Common dairy ingredient with generally low concern.",
},

"whole-milk-powder": {
  name: "Whole Milk Powder",
  category: "Dairy Ingredient",
  risk: "Low",
  usedIn: "Chocolate, infant foods, desserts",
  purpose: "Provides dairy solids and richness.",
  pausticaView:
    "Generally low concern and commonly used in packaged foods.",
},

"cocoa-butter": {
  name: "Cocoa Butter",
  category: "Fat",
  risk: "Low",
  usedIn: "Chocolate, confectionery",
  purpose: "Provides texture and mouthfeel.",
  pausticaView:
    "Generally low concern and naturally associated with chocolate.",
},

"alkalized-cocoa": {
  name: "Alkalized Cocoa",
  category: "Processed Cocoa",
  risk: "Low",
  usedIn: "Chocolate drinks, desserts, cookies",
  purpose: "Reduces acidity and changes flavor profile.",
  pausticaView:
    "Generally low concern but indicates additional processing.",
},

"artificial-colors": {
  name: "Artificial Colors",
  category: "Color Additive",
  risk: "Moderate",
  usedIn: "Candies, beverages, desserts, cereals",
  purpose: "Improves visual appearance.",
  pausticaView:
    "PAUSTICA flags artificial colors because many users prefer minimizing synthetic additives.",
},
};