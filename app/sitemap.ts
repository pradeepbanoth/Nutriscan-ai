import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://dantey-ai-orpin.vercel.app", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://dantey-ai-orpin.vercel.app/scan", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://dantey-ai-orpin.vercel.app/privacy", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: "https://dantey-ai-orpin.vercel.app/terms", lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}