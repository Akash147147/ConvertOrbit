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
    "hash-generator"
  ];

  const toolPaths = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPaths, ...toolPaths];
}
