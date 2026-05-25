import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://convertorbit.com";
  
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  const tools = [
    "heic-to-jpg",
    "png-to-ico",
    "compress-image-exact-kb",
    "mov-to-mp4",
    "pdf-compressor",
    "word-to-pdf",
    "pdf-to-word"
  ];

  const toolPaths = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPaths, ...toolPaths];
}
