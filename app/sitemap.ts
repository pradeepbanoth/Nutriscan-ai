import { MetadataRoute } from "next";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";
import { ingredientData } from "@/lib/ingredientData";
import { createCanonicalProductSlug } from "@/lib/createCanonicalProductSlug";

type ProductSource = {
  name?: string;
    brand?: string;
  updatedAt?: string;
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nutriscan-ai-orpin.vercel.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/scan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const result = await elastic.search<ProductSource>({
      index: PRODUCT_INDEX,
      size: 5000,
      query: {
        match_all: {},
      },
    });

  const uniqueUrls = new Set<string>();

const productPages: MetadataRoute.Sitemap = result.hits.hits
  .map((hit) => hit._source)
  .filter(
    (product): product is ProductSource =>
      Boolean(product?.name?.trim())
  )
  .map((product) => {
    const slug = createCanonicalProductSlug(product.name!);

    return {
      url: `${baseUrl}/product/${slug}`,
      lastModified: product.updatedAt
        ? new Date(product.updatedAt)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  })
  .filter((page) => {
    const slug = page.url.split("/").pop();

    if (!slug) return false;
    if (uniqueUrls.has(page.url)) return false;

    uniqueUrls.add(page.url);
    return true;
  });

      const ingredientPages: MetadataRoute.Sitemap = Object.keys(ingredientData).map(
  (slug) => ({
    url: `${baseUrl}/ingredient/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  })
);

return [...staticPages, ...productPages, ...ingredientPages];
} catch {
    const ingredientPages: MetadataRoute.Sitemap = Object.keys(ingredientData).map(
  (slug) => ({
    url: `${baseUrl}/ingredient/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  })
);

return [...staticPages, ...ingredientPages];
  }
}