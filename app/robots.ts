import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/history", "/login"],
      },
    ],
    sitemap: "https://dantey-ai-orpin.vercel.app/sitemap.xml",
  };
}