import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://convertorbit.com";
  
  const staticPaths = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/transparency`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ];

  const tools = [
    // Universal Dashboard
    "universal-dashboard",

    // Exact compressors
    "compress-image-20kb",
    "compress-image-50kb",
    "compress-image-100kb",
    "signature-resize-20kb",
    "compress-pdf-100kb",
    "compress-pdf-500kb",

    // Passport / Sizing
    "passport-photo-maker",
    "visa-photo-maker",
    "heic-to-jpg",
    "compress-image-exact-kb",
    "mov-to-mp4",

    // Social crop
    "youtube-thumbnail-resizer",
    "linkedin-crop",
    "instagram-resize",

    // Advanced PDF
    "merge-pdf",
    "split-pdf",
    "remove-pages",
    "organize-pdf",
    "pdf-compressor",
    "ocr-pdf",

    // Security / Metadata
    "strip-metadata",
    "convert-dpi",
    "checksum-tool",
    "protect-pdf",
    "sign-pdf",

    // Developer utilities
    "json-formatter",
    "base64-encoder",
    "hash-generator",

    // Additional converters
    "png-to-ico",
    "word-to-pdf",
    "pdf-to-word",
    "jpg-to-pdf"
  ];

  const toolPaths = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPaths, ...toolPaths];
}
