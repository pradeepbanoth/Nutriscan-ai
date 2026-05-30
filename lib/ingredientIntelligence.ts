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
};