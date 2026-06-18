export const ingredientIntelligence: Record<
  string,
  {
    risk: "Low" | "Medium" | "High";
    why: string;
    scientificView: string;
    recommendation: string;
  }
> = {
  "palm oil": {
    risk: "Medium",
    why: "Palm oil is high in saturated fat. Frequent intake may contribute to higher calorie and saturated fat consumption.",
    scientificView: "Generally safe in moderation, but regular high intake may not be ideal for heart health.",
    recommendation: "Consume occasionally and prefer products with healthier oils when possible.",
  },

  "high fructose corn syrup": {
    risk: "High",
    why: "High fructose corn syrup is a concentrated sweetener that can increase sugar intake quickly.",
    scientificView: "High intake of added sugars is linked with obesity, insulin resistance, and metabolic risk.",
    recommendation: "Avoid frequent consumption and choose lower-sugar alternatives.",
  },

  msg: {
    risk: "Medium",
    why: "MSG is a flavor enhancer used in processed foods. Some people may feel sensitivity symptoms.",
    scientificView: "Generally recognized as safe for most people, but processed foods containing MSG may also be high in salt.",
    recommendation: "Safe occasionally, but avoid relying heavily on highly processed snacks.",
  },

  "monosodium glutamate": {
    risk: "Medium",
    why: "Monosodium glutamate is another name for MSG and is used to enhance savory flavor.",
    scientificView: "Generally considered safe for most people, though some individuals report sensitivity.",
    recommendation: "Consume in moderation, especially if the product is also salty or ultra-processed.",
  },

  aspartame: {
    risk: "Medium",
    why: "Aspartame is an artificial sweetener used in low-calorie products.",
    scientificView: "Approved for use within accepted daily intake limits, but some users prefer avoiding artificial sweeteners.",
    recommendation: "Use occasionally and avoid excessive intake.",
  },

  "sodium benzoate": {
    risk: "Medium",
    why: "Sodium benzoate is a preservative used to extend shelf life.",
    scientificView: "Allowed in regulated amounts, but frequent intake of preservative-heavy foods is not ideal.",
    recommendation: "Choose fresher or less processed foods when possible.",
  },

  "artificial flavor": {
    risk: "Medium",
    why: "Artificial flavors are added to improve taste but usually indicate higher processing.",
    scientificView: "Many are permitted in food use, but they do not add nutritional value.",
    recommendation: "Prefer foods with natural ingredients and fewer additives.",
  },

  "artificial colour": {
    risk: "Medium",
    why: "Artificial colours improve appearance but are usually found in highly processed foods.",
    scientificView: "Some artificial colours are debated for sensitivity in children and frequent intake is best limited.",
    recommendation: "Prefer products without artificial colours, especially for children.",
  },

  "artificial color": {
    risk: "Medium",
    why: "Artificial colors improve appearance but usually indicate higher processing.",
    scientificView: "Some artificial colors are debated for sensitivity in children and frequent intake is best limited.",
    recommendation: "Prefer naturally colored foods and limit frequent consumption.",
  },

  "yellow 5": {
    risk: "Medium",
    why: "Yellow 5 is a synthetic food dye often used in processed snacks and drinks.",
    scientificView: "Approved in regulated amounts, but some people may be sensitive to synthetic dyes.",
    recommendation: "Limit products with synthetic dyes, especially for children.",
  },

  "red 40": {
    risk: "Medium",
    why: "Red 40 is a synthetic food dye commonly used in candies, drinks, and snacks.",
    scientificView: "Approved in regulated amounts, but synthetic dyes remain controversial for frequent child consumption.",
    recommendation: "Prefer dye-free alternatives where possible.",
  },

  sucralose: {
    risk: "Medium",
    why: "Sucralose is an artificial sweetener used to reduce sugar content.",
    scientificView: "Approved within daily intake limits, but long-term high intake remains debated.",
    recommendation: "Use occasionally and prefer naturally low-sugar foods.",
  },

  maltodextrin: {
    risk: "Medium",
    why: "Maltodextrin is a processed carbohydrate that can raise blood sugar quickly.",
    scientificView: "Commonly used as a thickener or filler, but it has a high glycemic index.",
    recommendation: "Limit if you are managing blood sugar or weight.",
  },

  "corn syrup": {
    risk: "High",
    why: "Corn syrup is an added sugar that increases total sugar load.",
    scientificView: "Frequent added sugar intake is linked with metabolic health risks.",
    recommendation: "Choose lower-sugar products when possible.",
  },

  "acesulfame k": {
  risk: "Medium",
  why: "Artificial sweetener commonly used in diet beverages and sugar-free foods.",
  scientificView: "Approved by regulators, but often found in highly processed foods.",
  recommendation: "Consume in moderation.",
},

"potassium sorbate": {
  risk: "Low",
  why: "Preservative used to prevent mold and yeast growth.",
  scientificView: "Generally regarded as safe in approved quantities.",
  recommendation: "Safe for occasional consumption.",
},

"carrageenan": {
  risk: "Medium",
  why: "Thickening agent used in dairy alternatives and processed foods.",
  scientificView: "Food-grade carrageenan is approved, though some debate exists regarding digestive sensitivity.",
  recommendation: "Monitor if you experience digestive discomfort.",
},

"ins 211": {
  risk: "Medium",
  why: "INS 211 is sodium benzoate, a common preservative.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Limit frequent intake of heavily preserved foods.",
},

"ins 621": {
  risk: "Medium",
  why: "INS 621 is monosodium glutamate (MSG), a flavor enhancer.",
  scientificView: "Generally recognized as safe for most consumers.",
  recommendation: "Consume in moderation.",
},

"ins 950": {
  risk: "Medium",
  why: "INS 950 is acesulfame potassium, an artificial sweetener.",
  scientificView: "Approved within regulatory limits.",
  recommendation: "Limit frequent intake of artificially sweetened products.",
},

"ins 951": {
  risk: "Medium",
  why: "INS 951 is aspartame, a low-calorie sweetener.",
  scientificView: "Approved by food safety authorities within daily intake limits.",
  recommendation: "Consume in moderation.",
},

"ins 330": {
  risk: "Low",
  why: "Citric acid used for acidity regulation.",
  scientificView: "Widely regarded as safe.",
  recommendation: "Generally safe.",
},

"titanium dioxide": {
  risk: "Medium",
  why: "Used as a whitening agent in some processed foods.",
  scientificView: "Regulatory treatment varies across regions.",
  recommendation: "Limit unnecessary intake.",
},

"polysorbate 80": {
  risk: "Medium",
  why: "Emulsifier used to improve texture and stability.",
  scientificView: "Approved in regulated quantities.",
  recommendation: "Consume processed foods in moderation.",
},

"potassium benzoate": {
  risk: "Medium",
  why: "Preservative used in beverages and packaged foods.",
  scientificView: "Generally safe in approved amounts.",
  recommendation: "Limit excessive intake.",
},

"xanthan gum": {
  risk: "Low",
  why: "Common thickener used in sauces and gluten-free foods.",
  scientificView: "Generally considered safe.",
  recommendation: "Safe for most consumers.",
},

"guar gum": {
  risk: "Low",
  why: "Plant-derived thickening agent.",
  scientificView: "Widely used and generally safe.",
  recommendation: "Safe for regular consumption.",
},

"erythritol": {
  risk: "Low",
  why: "Sugar alcohol used as a low-calorie sweetener.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Consume in moderation if sensitive to sugar alcohols.",
},

"stevia": {
  risk: "Low",
  why: "Natural sweetener extracted from stevia leaves.",
  scientificView: "Widely accepted as safe.",
  recommendation: "Good alternative to added sugar.",
},



"ins 202": {
  risk: "Low",
  why: "INS 202 is potassium sorbate, a common preservative.",
  scientificView: "Allowed in regulated amounts and widely used in packaged foods.",
  recommendation: "Acceptable occasionally. Choose fresh foods when possible.",
},

"bha": {
  risk: "Medium",
  why: "BHA is an antioxidant preservative used to prevent fats from becoming rancid.",
  scientificView: "Regulatory views vary, and some consumers prefer avoiding it.",
  recommendation: "Limit frequent intake of foods containing BHA.",
},

"bht": {
  risk: "Medium",
  why: "BHT is a synthetic antioxidant preservative used in packaged foods.",
  scientificView: "Approved in some regions within limits, but frequent intake of preservative-heavy foods is not ideal.",
  recommendation: "Consume occasionally and prefer minimally processed options.",
},

"tert-butylhydroquinone": {
  risk: "Medium",
  why: "TBHQ is a preservative used to extend shelf life of oils and fried snacks.",
  scientificView: "Approved within limits, but usually found in ultra-processed foods.",
  recommendation: "Limit frequent consumption of foods containing TBHQ.",
},

"tbhq": {
  risk: "Medium",
  why: "TBHQ is used to preserve oils and prevent oxidation in snacks and fried products.",
  scientificView: "Permitted in regulated amounts, but often signals heavy processing.",
  recommendation: "Avoid daily intake of TBHQ-containing packaged snacks.",
},

"sodium nitrite": {
  risk: "High",
  why: "Sodium nitrite is used in processed meats for preservation and color.",
  scientificView: "Processed meats with nitrites are associated with higher long-term health risk when consumed frequently.",
  recommendation: "Limit processed meats and choose fresh protein sources more often.",
},

"sodium nitrate": {
  risk: "Medium",
  why: "Sodium nitrate is used as a preservative, especially in cured meats.",
  scientificView: "Frequent intake of cured and processed meats is generally discouraged.",
  recommendation: "Consume rarely and prefer fresh, unprocessed foods.",
},

"potassium nitrate": {
  risk: "Medium",
  why: "Potassium nitrate is a curing preservative used in some processed meats.",
  scientificView: "Usually safe within limits, but cured meats should not be daily staples.",
  recommendation: "Limit frequent consumption.",
},

"calcium propionate": {
  risk: "Low",
  why: "Calcium propionate is used to prevent mold growth in bread and bakery products.",
  scientificView: "Generally recognized as safe in permitted amounts.",
  recommendation: "Usually safe, but choose fresh bakery products when possible.",
},

"ins 282": {
  risk: "Low",
  why: "INS 282 is calcium propionate, commonly used in bread preservation.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Acceptable occasionally; fresh foods are better for daily use.",
},

"sodium metabisulphite": {
  risk: "Medium",
  why: "Sodium metabisulphite is a preservative used in dried foods, juices, and packaged products.",
  scientificView: "Can trigger sensitivity in some people, especially those sensitive to sulphites.",
  recommendation: "Avoid if sensitive to sulphites or asthma-prone.",
},

"sodium metabisulfite": {
  risk: "Medium",
  why: "Sodium metabisulfite is a sulphite preservative used to prevent spoilage and browning.",
  scientificView: "Permitted in foods, but sulphite-sensitive individuals may react.",
  recommendation: "Limit if you are sensitive to preservatives or sulphites.",
},

"sulphur dioxide": {
  risk: "Medium",
  why: "Sulphur dioxide is a preservative used in dried fruits, juices, and beverages.",
  scientificView: "Allowed in limits, but may affect sulphite-sensitive people.",
  recommendation: "Avoid if you have sulphite sensitivity.",
},

"sulfur dioxide": {
  risk: "Medium",
  why: "Sulfur dioxide is used as a preservative in some packaged and dried foods.",
  scientificView: "Can cause sensitivity reactions in some individuals.",
  recommendation: "Consume cautiously if sensitive to sulphites.",
},

"potassium metabisulphite": {
  risk: "Medium",
  why: "Potassium metabisulphite is a sulphite preservative used in beverages and processed foods.",
  scientificView: "Approved in regulated amounts but may trigger sensitivity.",
  recommendation: "Avoid if sulphite-sensitive.",
},

"potassium metabisulfite": {
  risk: "Medium",
  why: "Potassium metabisulfite is used to preserve color and freshness.",
  scientificView: "Sulphites are generally safe for most people but may affect sensitive individuals.",
  recommendation: "Limit if you notice sensitivity.",
},

"benzoic acid": {
  risk: "Medium",
  why: "Benzoic acid is a preservative used in acidic foods and beverages.",
  scientificView: "Allowed in regulated amounts, but frequent preservative-heavy foods are not ideal.",
  recommendation: "Consume occasionally and prefer fresher options.",
},

"sorbic acid": {
  risk: "Low",
  why: "Sorbic acid is a preservative used to prevent mold and yeast.",
  scientificView: "Generally considered safe in approved amounts.",
  recommendation: "Usually safe for most people.",
},

"acesulfame potassium": {
  risk: "Medium",
  why: "Acesulfame potassium is an artificial sweetener used in sugar-free drinks and snacks.",
  scientificView: "Approved within daily intake limits, but usually found in highly processed foods.",
  recommendation: "Use occasionally and avoid relying heavily on artificially sweetened products.",
},

"saccharin": {
  risk: "Medium",
  why: "Saccharin is a non-nutritive sweetener used in low-calorie foods.",
  scientificView: "Approved in regulated amounts, but frequent intake is not necessary for most users.",
  recommendation: "Consume occasionally and prefer naturally low-sugar foods.",
},

"cyclamate": {
  risk: "Medium",
  why: "Cyclamate is an artificial sweetener used in some countries.",
  scientificView: "Regulatory approval varies by region.",
  recommendation: "Limit intake and check local food standards.",
},

"neotame": {
  risk: "Medium",
  why: "Neotame is an intense artificial sweetener used in processed foods.",
  scientificView: "Approved within intake limits, but adds no nutritional value.",
  recommendation: "Use rarely and prefer simple ingredient products.",
},

"advantame": {
  risk: "Medium",
  why: "Advantame is a high-intensity artificial sweetener.",
  scientificView: "Approved in regulated quantities, but mainly appears in processed foods.",
  recommendation: "Consume occasionally.",
},

"isomalt": {
  risk: "Low",
  why: "Isomalt is a sugar alcohol used in sugar-free sweets.",
  scientificView: "Generally safe, but excess intake may cause digestive discomfort.",
  recommendation: "Limit portions if sensitive to sugar alcohols.",
},

"sorbitol": {
  risk: "Low",
  why: "Sorbitol is a sugar alcohol used as a sweetener and humectant.",
  scientificView: "Generally safe, but high intake can cause bloating or laxative effects.",
  recommendation: "Consume moderately.",
},

"xylitol": {
  risk: "Low",
  why: "Xylitol is a sugar alcohol often used in chewing gum.",
  scientificView: "Generally safe for humans in moderate amounts.",
  recommendation: "Use moderately and avoid excessive intake.",
},

"mannitol": {
  risk: "Low",
  why: "Mannitol is a sugar alcohol used in sugar-free products.",
  scientificView: "Generally safe, but may cause digestive discomfort in large amounts.",
  recommendation: "Consume in small portions.",
},

"maltitol": {
  risk: "Low",
  why: "Maltitol is a sugar alcohol used in sugar-free chocolates and sweets.",
  scientificView: "Can raise blood sugar less than sugar but may cause digestive issues.",
  recommendation: "Limit intake, especially if managing blood sugar.",
},

"lactitol": {
  risk: "Low",
  why: "Lactitol is a sugar alcohol used in reduced-sugar foods.",
  scientificView: "Generally permitted but may cause digestive discomfort in excess.",
  recommendation: "Consume moderately.",
},

"thaumatin": {
  risk: "Low",
  why: "Thaumatin is a natural sweetener and flavor modifier.",
  scientificView: "Generally considered safe in food use.",
  recommendation: "Usually acceptable in small amounts.",
},

"glucose-fructose syrup": {
  risk: "High",
  why: "Glucose-fructose syrup is an added sugar syrup that increases total sugar intake.",
  scientificView: "High intake of added sugars is linked with metabolic health risks.",
  recommendation: "Avoid frequent consumption.",
},

"invert syrup": {
  risk: "High",
  why: "Invert syrup is an added sugar used in sweets and baked goods.",
  scientificView: "Frequent added sugar intake can increase calorie load and metabolic risk.",
  recommendation: "Choose lower-sugar alternatives.",
},

"rice syrup": {
  risk: "Medium",
  why: "Rice syrup is a concentrated sweetener used in packaged foods.",
  scientificView: "It still contributes added sugar even when marketed as natural.",
  recommendation: "Consume occasionally.",
},

"agave syrup": {
  risk: "Medium",
  why: "Agave syrup is a sweetener high in fructose.",
  scientificView: "Natural origin does not make it free from added sugar concerns.",
  recommendation: "Use sparingly.",
},

"maple syrup": {
  risk: "Medium",
  why: "Maple syrup is a natural sweetener but still adds sugar.",
  scientificView: "Better than some refined syrups, but excess intake still increases sugar load.",
  recommendation: "Use in small amounts.",
},

"caramel colour": {
  risk: "Medium",
  why: "Caramel colour is used to darken beverages and processed foods.",
  scientificView: "Permitted in regulated amounts, but often appears in ultra-processed drinks.",
  recommendation: "Limit frequent intake of heavily colored drinks.",
},

"caramel color": {
  risk: "Medium",
  why: "Caramel color is a food coloring used in colas, sauces, and snacks.",
  scientificView: "Approved in regulated limits, but usually signals processing.",
  recommendation: "Prefer less processed alternatives.",
},

"tartrazine": {
  risk: "Medium",
  why: "Tartrazine is a synthetic yellow food dye.",
  scientificView: "Approved in regulated amounts, but some individuals may be sensitive.",
  recommendation: "Limit frequent intake, especially for children.",
},

"sunset yellow": {
  risk: "Medium",
  why: "Sunset yellow is a synthetic orange-yellow dye used in snacks and drinks.",
  scientificView: "Permitted in many regions, but synthetic dyes remain debated.",
  recommendation: "Prefer dye-free products when possible.",
},

"allura red": {
  risk: "Medium",
  why: "Allura red is a synthetic red dye used in candies, drinks, and desserts.",
  scientificView: "Approved in limits, but frequent intake of synthetic dyes is best minimized.",
  recommendation: "Limit, especially in children's foods.",
},

"brilliant blue": {
  risk: "Medium",
  why: "Brilliant blue is a synthetic blue food color.",
  scientificView: "Allowed in regulated amounts, but adds no nutritional value.",
  recommendation: "Choose naturally colored foods more often.",
},

"ponceau 4r": {
  risk: "Medium",
  why: "Ponceau 4R is a synthetic red food color.",
  scientificView: "Regulatory acceptance varies by region.",
  recommendation: "Limit frequent intake.",
},

"carmoisine": {
  risk: "Medium",
  why: "Carmoisine is a synthetic red coloring used in processed foods.",
  scientificView: "Approved in some regions, but synthetic dyes may cause sensitivity in some people.",
  recommendation: "Use caution with frequent consumption.",
},

"quinoline yellow": {
  risk: "Medium",
  why: "Quinoline yellow is a synthetic yellow-green dye.",
  scientificView: "Permitted in some regions but debated for frequent intake.",
  recommendation: "Prefer products without synthetic dyes.",
},

"indigo carmine": {
  risk: "Medium",
  why: "Indigo carmine is a synthetic blue food dye.",
  scientificView: "Approved within limits, but not nutritionally useful.",
  recommendation: "Consume occasionally.",
},

"erythrosine": {
  risk: "Medium",
  why: "Erythrosine is a synthetic red dye used in some sweets and decorations.",
  scientificView: "Regulatory treatment varies across regions.",
  recommendation: "Limit unnecessary intake.",
},

"ins 102": {
  risk: "Medium",
  why: "INS 102 is tartrazine, a synthetic yellow dye.",
  scientificView: "Approved in regulated amounts, but some people may be sensitive.",
  recommendation: "Limit frequent intake.",
},

"ins 110": {
  risk: "Medium",
  why: "INS 110 is sunset yellow, a synthetic food color.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Prefer dye-free products when possible.",
},

"ins 129": {
  risk: "Medium",
  why: "INS 129 is allura red, a synthetic red color.",
  scientificView: "Approved in limits but often found in highly processed foods.",
  recommendation: "Limit frequent intake.",
},

"ins 133": {
  risk: "Medium",
  why: "INS 133 is brilliant blue, a synthetic dye.",
  scientificView: "Permitted in regulated quantities.",
  recommendation: "Consume occasionally.",
},

"ins 124": {
  risk: "Medium",
  why: "INS 124 is ponceau 4R, a synthetic red dye.",
  scientificView: "Regulatory limits apply and acceptance varies by region.",
  recommendation: "Limit frequent intake.",
},

"ins 122": {
  risk: "Medium",
  why: "INS 122 is carmoisine, a synthetic red color.",
  scientificView: "Approved in some regions but may cause sensitivity in some users.",
  recommendation: "Avoid frequent intake.",
},

"ins 104": {
  risk: "Medium",
  why: "INS 104 is quinoline yellow, a synthetic color.",
  scientificView: "Regulatory acceptance varies.",
  recommendation: "Choose naturally colored foods when possible.",
},

"ins 132": {
  risk: "Medium",
  why: "INS 132 is indigo carmine, a synthetic color.",
  scientificView: "Allowed in regulated amounts.",
  recommendation: "Consume occasionally.",
},

"ins 127": {
  risk: "Medium",
  why: "INS 127 is erythrosine, a synthetic red dye.",
  scientificView: "Regulatory treatment varies by region.",
  recommendation: "Limit unnecessary intake.",
},

"natamycin": {
  risk: "Low",
  why: "Natamycin is an antifungal preservative used on some dairy and bakery products.",
  scientificView: "Generally permitted in regulated use.",
  recommendation: "Usually acceptable in small amounts.",
},

"nisin": {
  risk: "Low",
  why: "Nisin is a preservative used to inhibit bacterial growth.",
  scientificView: "Generally considered safe in approved applications.",
  recommendation: "Acceptable in regulated amounts.",
},

"propionic acid": {
  risk: "Low",
  why: "Propionic acid helps prevent mold growth in bakery products.",
  scientificView: "Generally recognized as safe in regulated quantities.",
  recommendation: "Usually safe, but fresh foods are better for daily use.",
},

"potassium propionate": {
  risk: "Low",
  why: "Potassium propionate is a preservative used in bread and baked goods.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Acceptable occasionally.",
},

"sodium propionate": {
  risk: "Low",
  why: "Sodium propionate is used to prevent mold growth.",
  scientificView: "Generally considered safe in permitted amounts.",
  recommendation: "Usually safe.",
},

"ethyl paraben": {
  risk: "Medium",
  why: "Ethyl paraben is a preservative used in some foods and beverages.",
  scientificView: "Permitted in certain regions within limits.",
  recommendation: "Limit frequent intake of preservative-heavy products.",
},

"methyl paraben": {
  risk: "Medium",
  why: "Methyl paraben is a preservative used to prevent microbial growth.",
  scientificView: "Approved in some uses, but some consumers prefer avoiding parabens.",
  recommendation: "Consume occasionally.",
},

"propyl paraben": {
  risk: "Medium",
  why: "Propyl paraben is a preservative used in some processed foods.",
  scientificView: "Regulatory limits apply and views vary across regions.",
  recommendation: "Limit unnecessary intake.",
},

"sodium sulfite": {
  risk: "Medium",
  why: "Sodium sulfite is a sulphite preservative.",
  scientificView: "Can affect sulphite-sensitive individuals.",
  recommendation: "Avoid if sensitive to sulphites.",
},

"potassium sulfite": {
  risk: "Medium",
  why: "Potassium sulfite is used to preserve color and prevent spoilage.",
  scientificView: "May trigger sensitivity in some people.",
  recommendation: "Limit if sulphite-sensitive.",
},

"calcium disodium edta": {
  risk: "Medium",
  why: "Calcium disodium EDTA is used to preserve flavor and color.",
  scientificView: "Approved in regulated amounts, but usually found in processed foods.",
  recommendation: "Consume occasionally.",
},

"disodium edta": {
  risk: "Medium",
  why: "Disodium EDTA is used as a stabilizer and preservative.",
  scientificView: "Permitted within limits but adds no nutritional value.",
  recommendation: "Limit frequent intake.",
},

"ins 200": {
  risk: "Low",
  why: "INS 200 is sorbic acid, a preservative.",
  scientificView: "Generally regarded as safe in regulated amounts.",
  recommendation: "Usually acceptable.",
},

"ins 210": {
  risk: "Medium",
  why: "INS 210 is benzoic acid, a preservative.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Limit frequent intake of preserved beverages and snacks.",
},

"ins 220": {
  risk: "Medium",
  why: "INS 220 is sulphur dioxide, a preservative.",
  scientificView: "May affect sulphite-sensitive people.",
  recommendation: "Avoid if sensitive to sulphites.",
},

"ins 223": {
  risk: "Medium",
  why: "INS 223 is sodium metabisulphite.",
  scientificView: "Permitted in regulated amounts but may trigger sensitivity.",
  recommendation: "Limit if sensitive to sulphites.",
},

"ins 224": {
  risk: "Medium",
  why: "INS 224 is potassium metabisulphite.",
  scientificView: "Can affect sulphite-sensitive people.",
  recommendation: "Avoid if sensitive to sulphites.",
},

"ins 250": {
  risk: "High",
  why: "INS 250 is sodium nitrite, used in cured meats.",
  scientificView: "Frequent intake of nitrite-preserved processed meats is discouraged.",
  recommendation: "Limit processed meats.",
},

"ins 251": {
  risk: "Medium",
  why: "INS 251 is sodium nitrate, used in cured products.",
  scientificView: "Cured meats should not be frequent staples.",
  recommendation: "Consume rarely.",
},

"soy lecithin": {
  risk: "Low",
  why: "Soy lecithin is an emulsifier used to improve texture.",
  scientificView: "Generally considered safe in typical food amounts.",
  recommendation: "Usually acceptable unless avoiding soy.",
},

"sunflower lecithin": {
  risk: "Low",
  why: "Sunflower lecithin is an emulsifier used in chocolates and spreads.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"mono and diglycerides": {
  risk: "Medium",
  why: "Mono and diglycerides are emulsifiers used in processed foods.",
  scientificView: "Permitted in foods, but often signal higher processing.",
  recommendation: "Limit heavily processed foods.",
},

"diglycerides": {
  risk: "Medium",
  why: "Diglycerides are emulsifiers used to improve texture.",
  scientificView: "Generally permitted, but common in processed foods.",
  recommendation: "Consume occasionally.",
},

"monoglycerides": {
  risk: "Medium",
  why: "Monoglycerides are emulsifiers used in bakery and snack products.",
  scientificView: "Approved in food use, but not nutritionally beneficial.",
  recommendation: "Limit frequent intake of processed foods.",
},

"datem": {
  risk: "Medium",
  why: "DATEM is an emulsifier used in bread and bakery products.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Prefer simpler bakery products when possible.",
},

"ssl": {
  risk: "Medium",
  why: "SSL is sodium stearoyl lactylate, an emulsifier used in baked goods.",
  scientificView: "Approved in regulated quantities.",
  recommendation: "Consume occasionally.",
},

"sodium stearoyl lactylate": {
  risk: "Medium",
  why: "Sodium stearoyl lactylate is an emulsifier used to improve dough and texture.",
  scientificView: "Permitted in food use.",
  recommendation: "Limit frequent intake of ultra-processed bakery items.",
},

"calcium stearoyl lactylate": {
  risk: "Medium",
  why: "Calcium stearoyl lactylate is an emulsifier used in bread and desserts.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Consume occasionally.",
},

"pgpr": {
  risk: "Medium",
  why: "PGPR is an emulsifier commonly used in chocolate products.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Limit frequent intake of highly processed sweets.",
},

"polyglycerol polyricinoleate": {
  risk: "Medium",
  why: "Polyglycerol polyricinoleate is an emulsifier used in chocolate.",
  scientificView: "Approved within limits.",
  recommendation: "Consume occasionally.",
},

"lecithin": {
  risk: "Low",
  why: "Lecithin is an emulsifier used in many packaged foods.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"microcrystalline cellulose": {
  risk: "Low",
  why: "Microcrystalline cellulose is used as a bulking agent and stabilizer.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"cellulose gum": {
  risk: "Low",
  why: "Cellulose gum is used as a thickener and stabilizer.",
  scientificView: "Generally permitted in food use.",
  recommendation: "Usually safe.",
},

"carboxymethyl cellulose": {
  risk: "Medium",
  why: "Carboxymethyl cellulose is a thickener used in processed foods.",
  scientificView: "Approved in regulated amounts, though some users may prefer limiting emulsifier-heavy foods.",
  recommendation: "Consume occasionally.",
},

"pectin": {
  risk: "Low",
  why: "Pectin is a plant-derived gelling agent used in jams and desserts.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"gelatin": {
  risk: "Low",
  why: "Gelatin is a gelling agent derived from animal collagen.",
  scientificView: "Generally safe for most people.",
  recommendation: "Avoid only if following vegetarian or vegan diets.",
},

"agar agar": {
  risk: "Low",
  why: "Agar agar is a seaweed-derived gelling agent.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"modified starch": {
  risk: "Low",
  why: "Modified starch is used as a thickener or stabilizer.",
  scientificView: "Generally permitted, but common in processed foods.",
  recommendation: "Usually acceptable in moderation.",
},

"modified corn starch": {
  risk: "Low",
  why: "Modified corn starch is used to improve texture and stability.",
  scientificView: "Generally safe in regulated use.",
  recommendation: "Acceptable occasionally.",
},

"hydrogenated oil": {
  risk: "High",
  why: "Hydrogenated oil may contain unhealthy trans fats depending on processing.",
  scientificView: "Trans fats are linked with increased cardiovascular risk.",
  recommendation: "Avoid frequent consumption.",
},

"partially hydrogenated vegetable oil": {
  risk: "High",
  why: "Partially hydrogenated oils are a major source of industrial trans fats.",
  scientificView: "Industrial trans fats are strongly discouraged for heart health.",
  recommendation: "Avoid products containing this ingredient.",
},

"vegetable shortening": {
  risk: "High",
  why: "Vegetable shortening may contain hydrogenated fats.",
  scientificView: "Products with shortening are often high in saturated or trans fats.",
  recommendation: "Limit frequent intake.",
},

"interesterified fat": {
  risk: "Medium",
  why: "Interesterified fat is processed to change fat texture and melting behavior.",
  scientificView: "Used as an alternative to trans fats, but still common in processed foods.",
  recommendation: "Consume occasionally.",
},

"vanaspati": {
  risk: "High",
  why: "Vanaspati is a hydrogenated vegetable fat used in some snacks and bakery foods.",
  scientificView: "May contribute unhealthy fats depending on formulation.",
  recommendation: "Avoid frequent consumption.",
},

"palmolein oil": {
  risk: "Medium",
  why: "Palmolein oil is a palm oil fraction used for frying and snacks.",
  scientificView: "High in saturated fat compared with many liquid oils.",
  recommendation: "Consume occasionally.",
},

"refined palm oil": {
  risk: "Medium",
  why: "Refined palm oil is commonly used in processed snacks and bakery items.",
  scientificView: "Frequent high intake of saturated fat is not ideal.",
  recommendation: "Limit frequent consumption.",
},

"cottonseed oil": {
  risk: "Medium",
  why: "Cottonseed oil is a refined seed oil used in processed foods.",
  scientificView: "Generally permitted, but highly refined oils add calories without much nutrition.",
  recommendation: "Consume moderately.",
},

"refined flour": {
  risk: "Medium",
  why: "Refined flour has less fiber than whole grain flour.",
  scientificView: "Frequent intake of refined carbohydrates can reduce diet quality.",
  recommendation: "Prefer whole grains more often.",
},

"maida": {
  risk: "Medium",
  why: "Maida is refined wheat flour commonly used in biscuits, noodles, and bakery foods.",
  scientificView: "Low in fiber and often found in highly processed foods.",
  recommendation: "Limit frequent intake and prefer whole grain options.",
},

"enriched wheat flour": {
  risk: "Medium",
  why: "Enriched wheat flour is refined flour with some nutrients added back.",
  scientificView: "Still lower in fiber than whole grain flour.",
  recommendation: "Prefer whole wheat or whole grain products.",
},

"bleached flour": {
  risk: "Medium",
  why: "Bleached flour is refined flour treated for color and texture.",
  scientificView: "Usually low in fiber compared with whole grains.",
  recommendation: "Limit frequent intake.",
},

"yeast extract": {
  risk: "Medium",
  why: "Yeast extract is used to enhance savory flavor.",
  scientificView: "Often contains naturally occurring glutamates.",
  recommendation: "Limit if sensitive to flavor enhancers or sodium.",
},

"disodium inosinate": {
  risk: "Medium",
  why: "Disodium inosinate is a flavor enhancer often used with MSG.",
  scientificView: "Permitted in regulated amounts, but usually appears in salty processed snacks.",
  recommendation: "Consume occasionally.",
},

"disodium guanylate": {
  risk: "Medium",
  why: "Disodium guanylate is a flavor enhancer used in savory snacks.",
  scientificView: "Common in ultra-processed foods and often paired with MSG.",
  recommendation: "Limit frequent intake.",
},

"hydrolyzed vegetable protein": {
  risk: "Medium",
  why: "Hydrolyzed vegetable protein is used as a savory flavor enhancer.",
  scientificView: "May contain free glutamates and is common in processed foods.",
  recommendation: "Consume occasionally.",
},

"autolyzed yeast extract": {
  risk: "Medium",
  why: "Autolyzed yeast extract enhances savory flavor.",
  scientificView: "Contains naturally occurring glutamates.",
  recommendation: "Limit if sensitive to flavor enhancers.",
},

"malt extract": {
  risk: "Medium",
  why: "Malt extract is used for sweetness and flavor.",
  scientificView: "Can contribute added sugars depending on quantity.",
  recommendation: "Consume moderately.",
},

"smoke flavor": {
  risk: "Medium",
  why: "Smoke flavor is added to mimic smoked taste.",
  scientificView: "Generally permitted, but often appears in processed meats and snacks.",
  recommendation: "Limit heavily processed smoked-flavor foods.",
},

"natural flavor": {
  risk: "Low",
  why: "Natural flavor is used to improve taste.",
  scientificView: "Permitted in food use, though it may not reveal exact composition.",
  recommendation: "Usually acceptable, but simpler ingredient lists are better.",
},

"flavour enhancer": {
  risk: "Medium",
  why: "Flavor enhancers intensify taste in processed foods.",
  scientificView: "Often found in salty snacks and instant foods.",
  recommendation: "Limit frequent intake.",
},

"flavor enhancer": {
  risk: "Medium",
  why: "Flavor enhancers are used to make processed foods taste stronger.",
  scientificView: "Usually permitted, but they often appear in high-salt foods.",
  recommendation: "Consume occasionally.",
},

"ins 260": {
  risk: "Low",
  why: "INS 260 is acetic acid, used as an acidity regulator.",
  scientificView: "Generally considered safe in normal food amounts.",
  recommendation: "Usually acceptable.",
},

"acetic acid": {
  risk: "Low",
  why: "Acetic acid is used for acidity and preservation.",
  scientificView: "Common in vinegar and generally safe in food use.",
  recommendation: "Usually safe.",
},

"ins 270": {
  risk: "Low",
  why: "INS 270 is lactic acid, used as an acidity regulator.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Usually acceptable.",
},

"lactic acid": {
  risk: "Low",
  why: "Lactic acid helps control acidity and flavor.",
  scientificView: "Widely used and generally safe.",
  recommendation: "Usually acceptable.",
},

"ins 296": {
  risk: "Low",
  why: "INS 296 is malic acid, used for tart flavor.",
  scientificView: "Generally considered safe in regulated amounts.",
  recommendation: "Usually acceptable.",
},

"malic acid": {
  risk: "Low",
  why: "Malic acid adds tartness to foods and drinks.",
  scientificView: "Commonly found naturally in fruits and safe in normal use.",
  recommendation: "Usually safe.",
},

"ins 300": {
  risk: "Low",
  why: "INS 300 is ascorbic acid, also known as vitamin C.",
  scientificView: "Generally safe and used as an antioxidant.",
  recommendation: "Usually acceptable.",
},

"ascorbic acid": {
  risk: "Low",
  why: "Ascorbic acid is vitamin C and helps prevent oxidation.",
  scientificView: "Safe in typical food amounts.",
  recommendation: "Usually beneficial or acceptable.",
},

"ins 301": {
  risk: "Low",
  why: "INS 301 is sodium ascorbate, an antioxidant.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"sodium ascorbate": {
  risk: "Low",
  why: "Sodium ascorbate is used to prevent oxidation.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"ins 306": {
  risk: "Low",
  why: "INS 306 refers to tocopherols, antioxidant vitamin E compounds.",
  scientificView: "Generally safe and used to protect fats from oxidation.",
  recommendation: "Usually acceptable.",
},

"tocopherol": {
  risk: "Low",
  why: "Tocopherol is a vitamin E compound used as an antioxidant.",
  scientificView: "Generally safe in food amounts.",
  recommendation: "Usually acceptable.",
},

"mixed tocopherols": {
  risk: "Low",
  why: "Mixed tocopherols are antioxidants used to preserve oils.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Usually acceptable.",
},

"ins 307": {
  risk: "Low",
  why: "INS 307 is alpha-tocopherol, a vitamin E antioxidant.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"alpha tocopherol": {
  risk: "Low",
  why: "Alpha tocopherol is used as an antioxidant.",
  scientificView: "A form of vitamin E and generally safe.",
  recommendation: "Usually acceptable.",
},

"ins 322": {
  risk: "Low",
  why: "INS 322 is lecithin, an emulsifier.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable unless avoiding soy or egg sources.",
},

"ins 331": {
  risk: "Low",
  why: "INS 331 refers to sodium citrates, acidity regulators.",
  scientificView: "Generally safe in regulated food use.",
  recommendation: "Usually acceptable.",
},

"sodium citrate": {
  risk: "Low",
  why: "Sodium citrate controls acidity and improves texture.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"ins 332": {
  risk: "Low",
  why: "INS 332 refers to potassium citrates.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"potassium citrate": {
  risk: "Low",
  why: "Potassium citrate is used as an acidity regulator.",
  scientificView: "Generally safe in regulated amounts.",
  recommendation: "Usually acceptable.",
},

"ins 341": {
  risk: "Medium",
  why: "INS 341 refers to calcium phosphates, often used as stabilizers or anti-caking agents.",
  scientificView: "Allowed in foods, but phosphate additives may be worth limiting in highly processed diets.",
  recommendation: "Consume processed foods containing phosphate additives occasionally.",
},

"calcium phosphate": {
  risk: "Medium",
  why: "Calcium phosphate is used for texture, fortification, and anti-caking.",
  scientificView: "Generally permitted, but phosphate additives are common in processed foods.",
  recommendation: "Limit frequent intake from ultra-processed foods.",
},

"ins 339": {
  risk: "Medium",
  why: "INS 339 refers to sodium phosphates.",
  scientificView: "Approved in foods, but high phosphate additive intake may not be ideal.",
  recommendation: "Limit processed foods with phosphate additives.",
},

"sodium phosphate": {
  risk: "Medium",
  why: "Sodium phosphate is used as a stabilizer and moisture regulator.",
  scientificView: "Permitted in food use but common in processed foods.",
  recommendation: "Consume occasionally.",
},

"disodium phosphate": {
  risk: "Medium",
  why: "Disodium phosphate is used to adjust acidity and improve texture.",
  scientificView: "Allowed within limits, but phosphate additives can add to processed food load.",
  recommendation: "Limit frequent intake.",
},

"trisodium phosphate": {
  risk: "Medium",
  why: "Trisodium phosphate is used as an acidity regulator and stabilizer.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Avoid frequent consumption of phosphate-heavy processed foods.",
},

"ins 340": {
  risk: "Medium",
  why: "INS 340 refers to potassium phosphates.",
  scientificView: "Approved in foods, but phosphate additives are best limited in heavily processed diets.",
  recommendation: "Consume occasionally.",
},

"potassium phosphate": {
  risk: "Medium",
  why: "Potassium phosphate is used as a stabilizer and acidity regulator.",
  scientificView: "Generally permitted but common in processed foods.",
  recommendation: "Limit frequent intake.",
},

"ins 450": {
  risk: "Medium",
  why: "INS 450 refers to diphosphates used as raising agents and stabilizers.",
  scientificView: "Permitted in food use, but phosphate additives should not dominate the diet.",
  recommendation: "Consume occasionally.",
},

"diphosphates": {
  risk: "Medium",
  why: "Diphosphates are used in bakery products and processed meats.",
  scientificView: "Allowed in regulated amounts.",
  recommendation: "Limit frequent intake of phosphate-rich processed foods.",
},

"ins 451": {
  risk: "Medium",
  why: "INS 451 refers to triphosphates, used for texture and moisture retention.",
  scientificView: "Permitted in regulated quantities.",
  recommendation: "Consume occasionally.",
},

"triphosphates": {
  risk: "Medium",
  why: "Triphosphates improve texture and water retention in processed foods.",
  scientificView: "Generally allowed, but highly processed foods should be limited.",
  recommendation: "Limit frequent intake.",
},

"ins 452": {
  risk: "Medium",
  why: "INS 452 refers to polyphosphates, often used in processed foods.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Avoid frequent intake from processed meats and packaged foods.",
},

"polyphosphates": {
  risk: "Medium",
  why: "Polyphosphates help retain moisture and stabilize texture.",
  scientificView: "Allowed in foods but indicate processing.",
  recommendation: "Consume occasionally.",
},

"ins 401": {
  risk: "Low",
  why: "INS 401 is sodium alginate, a thickener from seaweed.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"sodium alginate": {
  risk: "Low",
  why: "Sodium alginate is used as a thickener and stabilizer.",
  scientificView: "Seaweed-derived and generally safe.",
  recommendation: "Usually acceptable.",
},

"ins 402": {
  risk: "Low",
  why: "INS 402 is potassium alginate.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Usually acceptable.",
},

"potassium alginate": {
  risk: "Low",
  why: "Potassium alginate is a thickening and stabilizing agent.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"ins 407": {
  risk: "Medium",
  why: "INS 407 is carrageenan, used as a thickener.",
  scientificView: "Food-grade carrageenan is approved, though some people report digestive sensitivity.",
  recommendation: "Monitor if you experience digestive discomfort.",
},

"ins 410": {
  risk: "Low",
  why: "INS 410 is locust bean gum, a thickener.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"locust bean gum": {
  risk: "Low",
  why: "Locust bean gum is a plant-derived thickener.",
  scientificView: "Generally safe in typical food amounts.",
  recommendation: "Usually acceptable.",
},

"ins 412": {
  risk: "Low",
  why: "INS 412 is guar gum.",
  scientificView: "Generally safe and widely used.",
  recommendation: "Usually acceptable.",
},

"ins 415": {
  risk: "Low",
  why: "INS 415 is xanthan gum.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"ins 440": {
  risk: "Low",
  why: "INS 440 is pectin, a plant-based gelling agent.",
  scientificView: "Generally safe.",
  recommendation: "Usually acceptable.",
},

"ins 471": {
  risk: "Medium",
  why: "INS 471 refers to mono- and diglycerides, emulsifiers.",
  scientificView: "Permitted in food use but often found in processed foods.",
  recommendation: "Limit frequent intake of ultra-processed foods.",
},

"ins 472e": {
  risk: "Medium",
  why: "INS 472e is DATEM, an emulsifier used in bakery foods.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Prefer simpler bakery products when possible.",
},

"ins 476": {
  risk: "Medium",
  why: "INS 476 is PGPR, an emulsifier used in chocolate.",
  scientificView: "Permitted within limits.",
  recommendation: "Consume processed sweets occasionally.",
},

"ins 481": {
  risk: "Medium",
  why: "INS 481 is sodium stearoyl lactylate.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Limit frequent intake of processed bakery products.",
},

"ins 482": {
  risk: "Medium",
  why: "INS 482 is calcium stearoyl lactylate.",
  scientificView: "Permitted in food use.",
  recommendation: "Consume occasionally.",
},

"ins 491": {
  risk: "Medium",
  why: "INS 491 is sorbitan monostearate, an emulsifier.",
  scientificView: "Approved in regulated amounts.",
  recommendation: "Limit frequent intake of emulsifier-heavy processed foods.",
},

"sorbitan monostearate": {
  risk: "Medium",
  why: "Sorbitan monostearate is used as an emulsifier.",
  scientificView: "Generally permitted, but common in processed foods.",
  recommendation: "Consume occasionally.",
},

"ins 492": {
  risk: "Medium",
  why: "INS 492 is sorbitan tristearate, an emulsifier.",
  scientificView: "Allowed in regulated quantities.",
  recommendation: "Limit heavily processed foods.",
},

"sorbitan tristearate": {
  risk: "Medium",
  why: "Sorbitan tristearate helps stabilize processed foods.",
  scientificView: "Permitted in food use.",
  recommendation: "Consume occasionally.",
},

"ins 433": {
  risk: "Medium",
  why: "INS 433 is polysorbate 80, an emulsifier.",
  scientificView: "Approved in regulated amounts, but emulsifier-heavy foods should be limited.",
  recommendation: "Consume occasionally.",
},

"ins 435": {
  risk: "Medium",
  why: "INS 435 is polysorbate 60, an emulsifier.",
  scientificView: "Permitted in regulated use.",
  recommendation: "Limit frequent intake.",
},

"polysorbate 60": {
  risk: "Medium",
  why: "Polysorbate 60 is used as an emulsifier in desserts and bakery foods.",
  scientificView: "Approved in regulated quantities.",
  recommendation: "Consume occasionally.",
},

"ins 466": {
  risk: "Medium",
  why: "INS 466 is carboxymethyl cellulose, a thickener.",
  scientificView: "Approved in foods, though some users prefer limiting processed emulsifiers.",
  recommendation: "Consume occasionally.",
},

"ins 500": {
  risk: "Low",
  why: "INS 500 refers to sodium carbonates, raising agents.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"sodium bicarbonate": {
  risk: "Low",
  why: "Sodium bicarbonate is a raising agent used in bakery foods.",
  scientificView: "Generally safe in typical food amounts.",
  recommendation: "Usually acceptable.",
},

"baking soda": {
  risk: "Low",
  why: "Baking soda is used as a leavening agent.",
  scientificView: "Safe in normal food use.",
  recommendation: "Usually acceptable.",
},

"ins 503": {
  risk: "Low",
  why: "INS 503 refers to ammonium carbonates used as raising agents.",
  scientificView: "Generally safe in baked goods.",
  recommendation: "Usually acceptable.",
},

"ammonium bicarbonate": {
  risk: "Low",
  why: "Ammonium bicarbonate is a raising agent in biscuits and crackers.",
  scientificView: "Generally permitted in food use.",
  recommendation: "Usually acceptable.",
},

"ins 450i": {
  risk: "Medium",
  why: "INS 450i is disodium diphosphate, often used as a raising agent.",
  scientificView: "Permitted in regulated amounts.",
  recommendation: "Limit frequent processed bakery foods.",
},

"disodium diphosphate": {
  risk: "Medium",
  why: "Disodium diphosphate is used as a raising agent and stabilizer.",
  scientificView: "Approved in food use, but phosphate additives are worth limiting.",
  recommendation: "Consume occasionally.",
},

"ins 508": {
  risk: "Low",
  why: "INS 508 is potassium chloride, used as a salt substitute.",
  scientificView: "Generally safe for most people, but some kidney patients need caution.",
  recommendation: "Usually acceptable unless medically advised otherwise.",
},

"potassium chloride": {
  risk: "Low",
  why: "Potassium chloride is used to reduce sodium in some products.",
  scientificView: "Safe for most people, but caution may be needed for kidney disease.",
  recommendation: "Follow medical advice if you have kidney concerns.",
},

"ins 551": {
  risk: "Low",
  why: "INS 551 is silicon dioxide, an anti-caking agent.",
  scientificView: "Generally considered safe in food use.",
  recommendation: "Usually acceptable.",
},

"silicon dioxide": {
  risk: "Low",
  why: "Silicon dioxide prevents powders from clumping.",
  scientificView: "Generally regarded as safe.",
  recommendation: "Usually acceptable.",
},

"ins 552": {
  risk: "Low",
  why: "INS 552 is calcium silicate, an anti-caking agent.",
  scientificView: "Generally permitted in food use.",
  recommendation: "Usually acceptable.",
},

"calcium silicate": {
  risk: "Low",
  why: "Calcium silicate prevents clumping in powders.",
  scientificView: "Generally safe in regulated amounts.",
  recommendation: "Usually acceptable.",
},

"ins 553": {
  risk: "Low",
  why: "INS 553 refers to magnesium silicates used as anti-caking agents.",
  scientificView: "Generally permitted.",
  recommendation: "Usually acceptable.",
},

"magnesium silicate": {
  risk: "Low",
  why: "Magnesium silicate is used to prevent clumping.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},


"ins 627": {
  risk: "Medium",
  why: "INS 627 is disodium guanylate, a flavor enhancer.",
  scientificView: "Permitted in regulated amounts, usually used with MSG.",
  recommendation: "Limit frequent intake of salty processed snacks.",
},

"ins 631": {
  risk: "Medium",
  why: "INS 631 is disodium inosinate, a flavor enhancer.",
  scientificView: "Approved in food use, but usually appears in ultra-processed foods.",
  recommendation: "Consume occasionally.",
},

"ins 635": {
  risk: "Medium",
  why: "INS 635 is a combination of flavor enhancers.",
  scientificView: "Permitted in food use but commonly found in salty snacks and instant foods.",
  recommendation: "Limit frequent intake.",
},

"ribonucleotides": {
  risk: "Medium",
  why: "Ribonucleotides are flavor enhancers used in savory processed foods.",
  scientificView: "Allowed in foods but usually found with MSG-like enhancers.",
  recommendation: "Consume occasionally.",
},

"ins 901": {
  risk: "Low",
  why: "INS 901 is beeswax, used as a glazing agent.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"beeswax": {
  risk: "Low",
  why: "Beeswax is used as a coating or glazing agent.",
  scientificView: "Generally safe in food amounts.",
  recommendation: "Usually acceptable.",
},

"ins 903": {
  risk: "Low",
  why: "INS 903 is carnauba wax, used as a glazing agent.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"carnauba wax": {
  risk: "Low",
  why: "Carnauba wax is used to polish candies and coatings.",
  scientificView: "Generally safe in small food amounts.",
  recommendation: "Usually acceptable.",
},

"ins 904": {
  risk: "Low",
  why: "INS 904 is shellac, used as a glazing agent.",
  scientificView: "Generally permitted in food use.",
  recommendation: "Avoid only if following strict vegan preferences.",
},

"shellac": {
  risk: "Low",
  why: "Shellac is used as a shiny coating on candies and pills.",
  scientificView: "Generally considered safe in small amounts.",
  recommendation: "Usually acceptable unless avoiding animal-derived ingredients.",
},

"ins 905": {
  risk: "Medium",
  why: "INS 905 refers to mineral oil-based glazing agents.",
  scientificView: "Food-grade versions may be permitted, but unnecessary intake is best limited.",
  recommendation: "Consume occasionally.",
},

"mineral oil": {
  risk: "Medium",
  why: "Mineral oil may be used as a glazing or release agent.",
  scientificView: "Food-grade forms are regulated, but frequent unnecessary intake is not ideal.",
  recommendation: "Limit frequent intake.",
},

"ins 941": {
  risk: "Low",
  why: "INS 941 is nitrogen, used as a packaging gas.",
  scientificView: "Generally safe and inert.",
  recommendation: "No concern in normal use.",
},

"nitrogen": {
  risk: "Low",
  why: "Nitrogen is used as a packaging gas to preserve freshness.",
  scientificView: "Inert and safe in packaging use.",
  recommendation: "No concern.",
},

"ins 948": {
  risk: "Low",
  why: "INS 948 is oxygen, used as a packaging gas.",
  scientificView: "Generally safe.",
  recommendation: "No concern.",
},

"packaging gas": {
  risk: "Low",
  why: "Packaging gases help maintain freshness and shelf life.",
  scientificView: "Generally safe when food-grade gases are used.",
  recommendation: "No major concern.",
},

"dimethylpolysiloxane": {
  risk: "Medium",
  why: "Dimethylpolysiloxane is an anti-foaming agent used in some fried foods and oils.",
  scientificView: "Permitted in regulated amounts, but often appears in processed or fried foods.",
  recommendation: "Limit frequent intake of deep-fried processed foods.",
},

"ins 900": {
  risk: "Medium",
  why: "INS 900 is dimethylpolysiloxane, an anti-foaming agent.",
  scientificView: "Approved in food use within limits.",
  recommendation: "Consume occasionally.",
},

"annatto": {
  risk: "Low",
  why: "Annatto is a natural color derived from seeds.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"ins 160b": {
  risk: "Low",
  why: "INS 160b is annatto, a natural coloring.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"beta carotene": {
  risk: "Low",
  why: "Beta carotene is a natural orange pigment and vitamin A precursor.",
  scientificView: "Generally safe in foods.",
  recommendation: "Usually acceptable.",
},

"ins 160a": {
  risk: "Low",
  why: "INS 160a refers to carotenes, natural colorants.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},

"paprika extract": {
  risk: "Low",
  why: "Paprika extract is a natural color used in snacks and sauces.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"ins 160c": {
  risk: "Low",
  why: "INS 160c is paprika extract, a natural color.",
  scientificView: "Generally safe.",
  recommendation: "Usually acceptable.",
},

"beetroot red": {
  risk: "Low",
  why: "Beetroot red is a natural food color.",
  scientificView: "Generally considered safe.",
  recommendation: "Usually acceptable.",
},

"ins 162": {
  risk: "Low",
  why: "INS 162 is beetroot red, a natural color.",
  scientificView: "Generally safe in food use.",
  recommendation: "Usually acceptable.",
},
};