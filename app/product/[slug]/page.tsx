import Image from "next/image";
import Link from "next/link";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";
import { createSlug } from "@/lib/createSlug";


type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductData = {
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
};

function formatProductName(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProductFromSearch(slug: string): Promise<ProductData | null> {
  const query = formatProductName(slug);
  if (!elastic) {
  return null;
}

  try {
    const result = await elastic.search<ProductData>({
      index: PRODUCT_INDEX,
      size: 1,
      query: {
        multi_match: {
          query,
          fields: ["name^4", "brand^2", "category", "ingredients"],
          fuzziness: "AUTO",
        },
      },
    });

    const product = result.hits.hits[0]?._source;

    if (!product) return null;

    return product;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
 if (!elastic) {
  return [];
}
 try {
    const result = await elastic.search<ProductData>({
      index: PRODUCT_INDEX,
      size: 50,
      query: {
        match_all: {},
      },
    });

    return result.hits.hits
      .map((hit) => hit._source?.name)
      .filter(Boolean)
      .map((name) => ({
        slug: name!
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      }));
  } catch {
    return [];
  }
}

import type { Metadata } from "next";

export async function generateMetadata(
  props: ProductPageProps
): Promise<Metadata> {
  const { slug } = await props.params;

  const productName = formatProductName(slug);

  return {
    title: `${productName} Review, Ingredients, Nutrition & Health Score | PAUSTICA`,
    description:`${productName} ingredient analysis, nutrition facts, NOVA processing level, additives, health score and healthier alternatives. See if ${productName} is a healthy choice with PAUSTICA.`,
  alternates: {
  canonical: `/product/${slug}`,
},
   openGraph: {
  title: `${productName} Review & Health Score`,
  description: `Ingredients, nutrition facts, additives, NOVA processing level and healthier alternatives for ${productName}.`,
  type: "website",
  images: ["/og-image.png"],
},
  };
}

async function getRelatedProducts(product: ProductData | null) {
  if (!product || !elastic) {
    return [];
  }

  try {
    const result = await elastic.search<ProductData>({
      index: PRODUCT_INDEX,
      size: 4,
      query: {
        bool: {
          should: [
            {
              match: {
                category: {
                  query: product.category || product.name,
                  boost: 3,
                },
              },
            },
            {
              match: {
                brand: {
                  query: product.brand,
                  boost: 2,
                },
              },
            },
            {
              multi_match: {
                query: `${product.name} ${product.category || ""}`,
                fields: ["name^3", "category^2", "brand"],
                fuzziness: "AUTO",
              },
            },
          ],
          must_not: [
            {
              match: {
                name: product.name,
              },
            },
          ],
        },
      },
    });

  return result.hits.hits
  .map((hit) => hit._source)
  .filter((item): item is ProductData => Boolean(item?.name));
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const fallbackName = formatProductName(slug);
  const product = await getProductFromSearch(slug);
  const relatedProducts = await getRelatedProducts(product);

  const productName = product?.name || fallbackName;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  aggregateRating: {
  "@type": "AggregateRating",
  ratingValue:
    product?.nutriscore?.toUpperCase() === "A"
      ? 5
      : product?.nutriscore?.toUpperCase() === "B"
      ? 4
      : product?.nutriscore?.toUpperCase() === "C"
      ? 3
      : product?.nutriscore?.toUpperCase() === "D"
      ? 2
      : 1,
  reviewCount: 1,
},
  name: productName,
  brand: {
    "@type": "Brand",
    name: product?.brand || "Unknown Brand",
  },
  image: product?.image || undefined,
  description: `PAUSTICA analysis for ${productName}, including ingredients, nutrition, processing level, and healthier alternatives.`,
};

  return (
    <main className="min-h-screen bg-[#fff7ed] px-4 sm:px-6 py-20">
     
      <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd),
  }}
/>

      <div className="max-w-6xl mx-auto">
<nav
  aria-label="Breadcrumb"
  className="mb-6 flex items-center gap-2 text-sm font-medium"
>
  <Link
    href="/"
    className="text-orange-600 hover:text-orange-700 transition"
  >
    Home
  </Link>

  <span className="text-gray-400">/</span>

  <span className="text-gray-500">Products</span>

  <span className="text-gray-400">/</span>

  <span className="text-gray-900 font-bold">
    {productName}
  </span>
</nav>
        <Link
          href="/"
          className="inline-flex rounded-full bg-white border border-orange-100 px-5 py-3 text-sm font-black text-orange-600 shadow-sm mb-8"
        >
          Back to PAUSTICA
        </Link>

        <section className="rounded-3xl bg-white border border-orange-100 shadow-sm overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

          <div className="p-6 sm:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="rounded-3xl bg-orange-50 border border-orange-100 p-8 flex items-center justify-center">
                {product?.image ? (
                  <Image
                    src={product.image}
                    alt={productName}
                    width={180}
                    height={180}
                    className="object-contain rounded-3xl"
                    unoptimized
                  />
                ) : (
                  <Image
                    src="/logo.png"
                    alt={productName}
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                )}
              </div>

              <div className="lg:col-span-2">
                <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
                  Product Analysis
                </p>

                <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-3">
                  {productName}
                </h1>

                <p className="text-lg text-gray-500 mb-8">
                  {product?.brand || "Product data will appear when available."}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Nutri-Score", product?.nutriscore?.toUpperCase() || "Pending"],
                    ["NOVA", product?.nova || "Pending"],
                    ["Sugar", product ? `${product.sugar}g` : "Pending"],
                    ["Salt", product ? `${product.salt}g` : "Pending"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-orange-50 border border-orange-100 p-4"
                    >
                      <p className="text-xs font-bold text-gray-400 mb-1">
                        {label}
                      </p>

                      <p className="font-black text-orange-600">{value}</p>
                    </div>
                  ))}
                </div>

                {!product && (
                  <p className="mt-6 text-sm text-gray-500">
                    We could not find this product yet. Try scanning it from the
                    homepage or searching a more specific product name.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-white border border-orange-100 shadow-sm p-8">

<p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
Health Verdict
</p>

<h2 className="text-3xl font-black text-gray-900 mb-5">

{Number(product?.nova) >= 4
 ? "Limit consumption"
 : Number(product?.nova) >= 3
 ? "Consume in moderation"
 : "Generally a better choice"}

</h2>

<p className="text-gray-600 leading-relaxed">

This verdict is based on ingredients, processing level,
and available nutrition information.

</p>

</section>

       {product && (
  <section className="mt-8 rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      Processing Analysis
    </p>

    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-5">
      How processed is {productName}?
    </h2>

    <div className="rounded-3xl bg-orange-50 border border-orange-100 p-6">
      <p className="text-sm font-bold text-gray-500 mb-2">
        NOVA Classification
      </p>

      <p className="text-5xl font-black text-orange-600 mb-4">
        {product.nova || "N/A"}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
  <span className="rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-black text-gray-700">
    {Number(product.nova) >= 4
      ? "Ultra-processed"
      : Number(product.nova) >= 3
      ? "Processed"
      : "Less processed"}
  </span>

  <span className="rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-black text-gray-700">
    Based on available product data
  </span>

  <span className="rounded-full bg-white border border-orange-100 px-4 py-2 text-sm font-black text-gray-700">
    Updated from search index
  </span>
</div>

      <p className="text-gray-700 leading-relaxed">
        {Number(product.nova) >= 4
          ? "This product appears to be ultra-processed. Ultra-processed foods often contain industrial ingredients, additives, sweeteners, flavor enhancers, or preservatives."
          : Number(product.nova) >= 3
          ? "This product appears to be processed. It may include added ingredients such as salt, sugar, oils, or preservatives."
          : "This product appears to be minimally processed or less processed based on available data."}
      </p>
    </div>
  </section>
)}


{product?.ingredients && (
  <section className="mt-8 rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8">
    <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
      Ingredient Highlights
    </p>

    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6">
      Notable ingredients detected
    </h2>

    <div className="flex flex-wrap gap-3">
      {product.ingredients
        .split(",")
        .slice(0, 8)
        .map((ingredient, index) => (
         <Link
  key={index}
  href={`/ingredient/${createSlug(ingredient.trim())}`}
  className="rounded-full bg-orange-50 border border-orange-100 px-4 py-2 font-bold text-gray-700 hover:bg-orange-100 transition"
>
  {ingredient.trim()}
</Link>
        ))}

    </div>

    <p className="mt-5 text-gray-500">
      PAUSTICA highlights commonly listed ingredients so users can quickly
      understand what is inside a product.
    </p>
  </section>
)}

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Ingredients
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {product?.ingredients || "Ingredient data is not available yet."}
            </p>
          </div>

          <div className="rounded-3xl bg-gray-950 shadow-sm p-6 sm:p-8">
            <h2 className="text-2xl font-black text-white mb-4">
              Better Alternatives
            </h2>

            <p className="text-gray-300 leading-relaxed mb-6">
             PAUSTICA will recommend healthier alternatives based on
processing level, ingredients, nutrition profile and
similar products in the same category.
            </p> 
           

            <Link
              href="/"
              className="inline-flex w-full justify-center rounded-2xl bg-orange-500 px-6 py-4 text-white font-black"
            >
              Scan Another Product
            </Link>
          </div>
        </section>
      </div>
       {relatedProducts.length > 0 && (
  <section className="mt-8 rounded-3xl bg-white border border-orange-100 shadow-sm p-6 sm:p-8">
    <h2 className="text-2xl font-black text-gray-900 mb-6">
      Related Products
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {relatedProducts.map((item) => (
        <Link
          key={item.name}
          href={`/product/${item.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")}`}
          className="rounded-3xl border border-orange-100 bg-orange-50 p-5 hover:shadow-lg transition"
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              width={120}
              height={120}
              className="h-28 w-full object-contain rounded-2xl bg-white mb-4"
              unoptimized
            />
          ) : (
            <div className="h-28 rounded-2xl bg-white mb-4" />
          )}

          <h3 className="font-black text-gray-900 line-clamp-2">
            {item.name}
          </h3>

          <p className="mt-1 text-sm text-gray-500 line-clamp-1">
            {item.brand || "Unknown Brand"}
          </p>
        </Link>
      ))}
    </div>
  </section>
)}
    </main>
  );
}