import { supabase } from "@/app/lib/supabase";

export type SearchProduct = {
  barcode?: string;
  name: string;
  brand: string;
  category?: string;
  image: string;
  ingredients: string;
  nutriscore: string;
  nova: string | number;
  sugar: number;
  fat: number;
  salt: number;
  source?: string;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function pickBestProduct(products: SearchProduct[], query: string) {
  const cleanQuery = normalize(query);

  const exact = products.find(
    (product) => normalize(product.name) === cleanQuery
  );

  if (exact) return exact;

  const startsWith = products.find((product) =>
    normalize(product.name).startsWith(cleanQuery)
  );

  if (startsWith) return startsWith;

  const contains = products.find((product) =>
    normalize(product.name).includes(cleanQuery)
  );

  if (contains) return contains;

  return products[0] || null;
}

export async function searchProductByName({
  query,
  signal,
}: {
  query: string;
  signal?: AbortSignal;
}): Promise<SearchProduct | null> {
  const {
  data: { session },
} = await supabase.auth.getSession();

const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
  signal,
  headers: session
    ? {
        Authorization: `Bearer ${session.access_token}`,
      }
    : {},
});

  if (!res.ok) return null;

  const data = await res.json();

  const products: SearchProduct[] = (data.products || []).map(
    (product: Partial<SearchProduct>) => ({
      barcode: product.barcode || "",
      name: product.name || "Unknown Product",
      brand: product.brand || "Unknown Brand",
      category: product.category || "",
      image: product.image || "",
      ingredients: product.ingredients || "",
      nutriscore: product.nutriscore || "unknown",
      nova: product.nova ?? "N/A",
      sugar: Number(product.sugar ?? 0),
      fat: Number(product.fat ?? 0),
      salt: Number(product.salt ?? 0),
      source: product.source || "elasticsearch",
    })
  );

  return pickBestProduct(products, query);
}