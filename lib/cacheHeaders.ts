export const cacheHeaders = {
  search: {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
  },

  product: {
    "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
  },

  nutrition: {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  },

  short: {
    "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600",
  },
};