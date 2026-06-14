import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";
import { elastic, PRODUCT_INDEX } from "@/lib/elasticsearch";
import { createSlug } from "@/lib/createSlug";
import { ingredientData } from "@/lib/ingredientData";

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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProductsWithIngredient(ingredientName: string) {
  if (!elastic) {
  return [];
}
try {
    const result = await elastic.search<ProductSource>({
      index: PRODUCT_INDEX,
      size: 8,
      query: {
        match: {
          ingredients: {
            query: ingredientName,
          },
        },
      },
    });

    return result.hits.hits
      .map((hit) => hit._source)
      .filter((product): product is ProductSource => Boolean(product?.name));
  } catch {
    return [];
  }
}

function getRelatedIngredients(currentSlug: string) {
  const current = ingredientData[currentSlug];

  if (!current) return [];

  return Object.entries(ingredientData)
    .filter(([slug, item]) => {
      return slug !== currentSlug && item.category === current.category;
    })
    .slice(0, 4);
}

export async function generateMetadata(
  props: IngredientPageProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const ingredientName = formatIngredientName(slug);

  return {
  title: `${ingredientName}: Uses, Risk Level & Food Products | PAUSTICA`,
  description: `Learn what ${ingredientName} is, why it is used in packaged foods, its risk level, common uses, and products that may contain it.`,
  alternates: {
    canonical: `/ingredient/${slug}`,
  },
  openGraph: {
    title: `${ingredientName} Ingredient Guide | PAUSTICA`,
    description: `Uses, risk level, common food products, and PAUSTICA's view on ${ingredientName}.`,
    type: "article",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${ingredientName} Ingredient Guide | PAUSTICA`,
    description: `Understand ${ingredientName}, its food uses, and risk level.`,
    images: ["/og-image.png"],
  },
};
}

export default async function IngredientPage({
  params,
}: IngredientPageProps) {
  const { slug } = await params;
  const ingredientName = formatIngredientName(slug);
  const ingredient = ingredientData[slug];
  const relatedProducts = await getProductsWithIngredient(ingredientName);
  const relatedIngredients = getRelatedIngredients(slug);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `${ingredient?.name || ingredientName} Ingredient Guide`,
  description: `Learn about ${ingredient?.name || ingredientName}, its food uses, risk level, and common products.`,
  author: {
    "@type": "Organization",
    name: "PAUSTICA",
  },
  publisher: {
    "@type": "Organization",
    name: "PAUSTICA",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": `https://nutriscan-ai-orpin.vercel.app/ingredient/${slug}`,
  },
};

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(jsonLd),
  }}
/>

  return (
    <main className="min-h-screen bg-[#fff7ed] px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-sm font-medium"
        >
          <Link href="/" className="text-orange-600 font-bold">
            Home
          </Link>

          <span className="text-gray-400">/</span>
          <span className="text-gray-500">Ingredients</span>
          <span className="text-gray-400">/</span>

          <span className="text-gray-900 font-bold">{ingredientName}</span>
        </nav>

        <section className="rounded-[36px] bg-white border border-orange-100 shadow-xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />

          <div className="p-6 sm:p-10">
            <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
              Ingredient Guide
            </p>

            <h1 className="heading-font text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-5">
              {ingredient?.name || ingredientName}
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed max-w-3xl">
              PAUSTICA ingredient pages explain what food ingredients are, why
              they appear in packaged foods, and what users should understand
              before making daily food choices.
            </p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[28px] bg-white border border-orange-100 shadow-lg p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">
              Category
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {ingredient?.category || "Ingredient"}
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-orange-100 shadow-lg p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">
              Risk Level
            </h2>

            <p
              className={`font-black text-lg ${
                ingredient?.risk === "High"
                  ? "text-red-600"
                  : ingredient?.risk === "Moderate"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {ingredient?.risk || "Unknown"}
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-orange-100 shadow-lg p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">
              Common Uses
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {ingredient?.usedIn ||
                "Information will be added as the ingredient database expands."}
            </p>
          </div>

          <div className="rounded-[28px] bg-white border border-orange-100 shadow-lg p-6">
            <h2 className="text-xl font-black text-gray-900 mb-3">
              Purpose
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {ingredient?.purpose ||
                "Information will be added as the ingredient database expands."}
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white border border-orange-100 shadow-xl p-6 sm:p-8">
          <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
            PAUSTICA View
          </p>

          <h2 className="text-2xl font-black text-gray-900 mb-4">
            What users should know
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {ingredient?.pausticaView ||
              "PAUSTICA is continuously expanding its ingredient knowledge base."}
          </p>
        </section>

        {relatedIngredients.length > 0 && (
  <section className="mt-8 rounded-[32px] bg-white border border-orange-100 shadow-xl p-6 sm:p-8">
    <h2 className="text-2xl font-black text-gray-900 mb-6">
      Related Ingredients
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
      {relatedIngredients.map(([relatedSlug, item]) => (
        <Link
          key={relatedSlug}
          href={`/ingredient/${relatedSlug}`}
          className="rounded-3xl bg-orange-50 border border-orange-100 p-5 hover:bg-orange-100 transition"
        >
          <p className="text-sm font-black text-orange-600 mb-2">
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

<section className="mt-8 rounded-[32px] bg-white border border-orange-100 shadow-xl p-6 sm:p-8">
  <p className="text-sm font-black text-orange-600 uppercase tracking-wide mb-3">
    Important Note
  </p>

  <h2 className="text-2xl font-black text-gray-900 mb-4">
    Ingredient information is educational.
  </h2>

  <p className="text-gray-600 leading-relaxed">
    PAUSTICA ingredient guides are designed to help users understand packaged
    food labels more clearly. They are not medical advice, and individual health
    needs can vary. For medical or dietary concerns, speak with a qualified
    healthcare professional.
  </p>
</section>

        <section className="mt-8 rounded-[32px] bg-gray-950 shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-black text-white mb-4">
            Products containing {ingredient?.name || ingredientName}
          </h2>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {relatedProducts.map((product) => (
                <Link
                  key={product.name}
                  href={`/product/${createSlug(product.name || "")}`}
                  className="rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition"
                >
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name || ingredientName}
                      width={120}
                      height={120}
                      className="h-28 w-full object-contain rounded-2xl bg-white mb-4"
                      unoptimized
                    />
                  ) : (
                    <div className="h-28 rounded-2xl bg-white/10 mb-4" />
                  )}

                  <h3 className="font-black text-white line-clamp-2">
                    {product.name || "Unknown Product"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400 line-clamp-1">
                    {product.brand || "Unknown Brand"}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-gray-300 leading-relaxed mb-6">
                No indexed products containing this ingredient were found yet.
              </p>

              <Link
                href="/"
                className="inline-flex rounded-2xl bg-orange-500 px-6 py-4 text-white font-black"
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