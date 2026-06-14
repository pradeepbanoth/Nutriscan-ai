import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/history",
          "/login",
          "/dashboard",
          "/auth",
        ],
      },
    ],
    sitemap: "https://nutriscan-ai-orpin.vercel.app/sitemap.xml",
  };
}