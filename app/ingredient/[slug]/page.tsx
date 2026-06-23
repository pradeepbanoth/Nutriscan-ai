import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createSlug } from "@/lib/createSlug";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";
import { ingredientData } from "@/lib/ingredientData";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://nutriscan-ai-orpin.vercel.app";

type IngredientPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductSource = {
  name?: string;
  brand?: string;
  image?: string;
  ingredients?: string;
  nutriscore?: string;
  nova?: number | null;
};

function formatIngredientName(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProductsWithIngredient(ingredientName: string) {
  if (!elastic) return [];

  try {
    const result = await elastic.search<ProductSource>({
      index: PRODUCT_INDEX,
      size: 8,
      query: {
        bool: {
          should: [
            {
              match_phrase: {
                ingredients: {
                  query: ingredientName,
                  boost: 4,
                },
              },
            },
            {
              match: {
                ingredients: {
                  query: ingredientName,
                  fuzziness: "AUTO",
                  boost: 1,
                },
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
    });

    return result.hits.hits
      .map((hit) => hit._source)
      .filter((product): product is ProductSource => Boolean(product?.name));
  } catch (error) {
    console.error("Ingredient product lookup failed:", error);
    return [];
  }
}

function getRelatedIngredients(currentSlug: string) {
  const current = ingredientData[currentSlug];

  if (!current) return [];

  return Object.entries(ingredientData)
    .filter(([slug, item]) => slug !== currentSlug && item.category === current.category)
    .slice(0, 4);
}

export async function generateMetadata({
  params,
}: IngredientPageProps): Promise<Metadata> {
  const { slug } = await params;
  const ingredient = ingredientData[slug];
  const ingredientName = ingredient?.name || formatIngredientName(slug);

  return {
    title: `${ingredientName}: Uses, Risk Level & Food Products | PAUSTICA`,
    description: `Learn what ${ingredientName} is, why it is used in packaged foods, its risk level, common uses, and products that may contain it.`,
    alternates: {
      canonical: `${siteUrl}/ingredient/${slug}`,
    },
    openGraph: {
      title: `${ingredientName} Ingredient Guide | PAUSTICA`,
      description: `Understand ${ingredientName}, its food uses, risk level, and common packaged food products.`,
      url: `${siteUrl}/ingredient/${slug}`,
      siteName: "PAUSTICA",
      type: "article",
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${ingredientName} Ingredient Guide`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${ingredientName} Ingredient Guide | PAUSTICA`,
      description: `Understand ${ingredientName}, its food uses, and risk level.`,
      images: [`${siteUrl}/og-image.png`],
    },
    robots: {
      index: Boolean(ingredient),
      follow: true,
    },
  };
}

export default async function IngredientPage({ params }: IngredientPageProps) {
  const { slug } = await params;
  const ingredient = ingredientData[slug];

  if (!ingredient) {
    notFound();
  }

  const ingredientName = ingredient.name || formatIngredientName(slug);
  const relatedProducts = await getProductsWithIngredient(ingredientName);
  const relatedIngredients = getRelatedIngredients(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${ingredientName} Ingredient Guide`,
    description: `Learn about ${ingredientName}, its food uses, risk level, and common products.`,
    author: {
      "@type": "Organization",
      name: "PAUSTICA",
    },
    publisher: {
      "@type": "Organization",
      name: "PAUSTICA",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/ingredient/${slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-[#fff7ed] px-4 py-20 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold">
          <Link href="/" className="text-orange-600">
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Ingredients</span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">{ingredientName}</span>
        </nav>

        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

          <div className="p-6 sm:p-10">
            <p className="mb-3 text-sm font-black uppercase tracking-wide text-orange-600">
              Ingredient Guide
            </p>

            <h1 className="mb-5 text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">
              {ingredientName}
            </h1>

            <p className="max-w-3xl text-lg leading-relaxed text-gray-500">
              Understand what this ingredient is, why it appears in packaged
              foods, and how PAUSTICA evaluates its risk in everyday food
              choices.
            </p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard title="Category" value={ingredient.category || "Ingredient"} />
          <InfoCard title="Risk Level" value={ingredient.risk || "Unknown"} risk={ingredient.risk} />
          <InfoCard title="Common Uses" value={ingredient.usedIn || "Information will be added as the database expands."} />
          <InfoCard title="Purpose" value={ingredient.purpose || "Information will be added as the database expands."} />
        </section>

        <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-orange-600">
            PAUSTICA View
          </p>

          <h2 className="mb-4 text-2xl font-black text-gray-900">
            What users should know
          </h2>

          <p className="leading-relaxed text-gray-600">
            {ingredient.pausticaView ||
              "PAUSTICA is continuously expanding its ingredient knowledge base."}
          </p>
        </section>

        {relatedIngredients.length > 0 && (
          <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-2xl font-black text-gray-900">
              Related Ingredients
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              {relatedIngredients.map(([relatedSlug, item]) => (
                <Link
                  key={relatedSlug}
                  href={`/ingredient/${relatedSlug}`}
                  className="rounded-3xl border border-orange-100 bg-orange-50 p-5 transition hover:bg-orange-100"
                >
                  <p className="mb-2 text-sm font-black text-orange-600">
                    {item.category}
                  </p>

                  <h3 className="text-xl font-black text-gray-900">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600">
                    Risk: {item.risk}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm sm:p-8">
          <p className="mb-3 text-sm font-black uppercase tracking-wide text-orange-600">
            Important Note
          </p>

          <h2 className="mb-4 text-2xl font-black text-gray-900">
            Ingredient information is educational.
          </h2>

          <p className="leading-relaxed text-gray-600">
            PAUSTICA ingredient guides help users understand packaged food labels
            more clearly. They are not medical advice. For medical or dietary
            concerns, speak with a qualified healthcare professional.
          </p>
        </section>

        <section className="mt-8 rounded-3xl bg-gray-950 p-6 shadow-sm sm:p-8">
          <h2 className="mb-4 text-2xl font-black text-white">
            Products containing {ingredientName}
          </h2>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              {relatedProducts.map((product) => (
                <Link
                  key={`${product.name}-${product.brand}`}
                  href={`/product/${createSlug(product.name || "")}`}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name || ingredientName}
                      width={120}
                      height={120}
                      className="mb-4 h-28 w-full rounded-2xl bg-white object-contain"
                      unoptimized
                    />
                  ) : (
                    <div className="mb-4 h-28 rounded-2xl bg-white/10" />
                  )}

                  <h3 className="line-clamp-2 font-black text-white">
                    {product.name || "Unknown Product"}
                  </h3>

                  <p className="mt-1 line-clamp-1 text-sm text-gray-400">
                    {product.brand || "Unknown Brand"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <p className="mb-6 leading-relaxed text-gray-300">
                No indexed products containing this ingredient were found yet.
              </p>

              <Link
                href="/scan"
                className="inline-flex rounded-2xl bg-orange-500 px-6 py-4 font-black text-white"
              >
                Search Products
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  title,
  value,
  risk,
}: {
  title: string;
  value: string;
  risk?: string;
}) {
  const riskColor =
    risk === "High"
      ? "text-red-600"
      : risk === "Moderate"
      ? "text-yellow-600"
      : risk === "Low"
      ? "text-green-600"
      : "text-gray-600";

  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-xl font-black text-gray-900">{title}</h2>

      <p className={`leading-relaxed ${risk ? `text-lg font-black ${riskColor}` : "text-gray-600"}`}>
        {value}
      </p>
    </div>
  );
}