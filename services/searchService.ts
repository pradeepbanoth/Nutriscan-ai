type SearchProduct = {
  product_name: string;
  brands: string;
  image_front_url: string;
  ingredients_text: string;
  nutriscore_grade: string;
  nova_group: string | number;
  nutriments: {
    sugars_100g: number;
    fat_100g: number;
    salt_100g: number;
  };
};

export async function searchProductByName({
  query,
  signal,
}: {
  query: string;
  signal?: AbortSignal;
}): Promise<SearchProduct | null> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    signal,
  });

  const data = await res.json();

  if (!data.success || !data.product) {
    return null;
  }

  const p = data.product;

  return {
    product_name: p.name,
    brands: p.brand,
    image_front_url: p.image,
    ingredients_text: p.ingredients,
    nutriscore_grade: p.nutriscore,
    nova_group: p.nova,
    nutriments: {
      sugars_100g: p.sugar,
      fat_100g: p.fat,
      salt_100g: p.salt,
    },
  };
}
