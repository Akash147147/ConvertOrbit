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
    // Organize
    "merge-pdf",
    "split-pdf",
    "remove-pages",
    "extract-pages",
    "organize-pdf",
    "scan-to-pdf",
    
    // Optimize
    "pdf-compressor",
    "repair-pdf",
    "ocr-pdf",
    
    // Convert to
    "jpg-to-pdf",
    "word-to-pdf",
    "ppt-to-pdf",
    "excel-to-pdf",
    "html-to-pdf",
    
    // Convert from
    "pdf-to-jpg",
    "pdf-to-word",
    "pdf-to-ppt",
    "pdf-to-excel",
    "pdf-to-pdfa",
    
    // Edit
    "rotate-pdf",
    "add-page-numbers",
    "add-watermark",
    "crop-pdf",
    "edit-pdf",
    "pdf-forms",
    
    // Security
    "unlock-pdf",
    "protect-pdf",
    "sign-pdf",
    "redact-pdf",
    "compare-pdf",
    
    // Intelligence
    "ai-summarizer",
    "translate-pdf",

    // Image/Video utilities
    "heic-to-jpg",
    "compress-image-exact-kb",
    "mov-to-mp4"
  ];

  const toolPaths = tools.map((tool) => ({
    url: `${baseUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPaths, ...toolPaths];
}
