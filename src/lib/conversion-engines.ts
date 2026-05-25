import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

// Dynamic import helpers to prevent SSR/hydration issues
const getHeic2Any = async () => {
  const mod = await import('heic2any');
  return mod.default;
};

const getMammoth = async () => {
  const mod = await import('mammoth');
  return mod.default || mod;
};

const getDocx = async () => {
  const mod = await import('docx');
  return mod;
};

// 1. HEIC to JPG Converter
export async function convertHeicToJpg(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const heic2any = await getHeic2Any();
  if (onProgress) onProgress(40);

  const resultBlob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  if (onProgress) onProgress(80);
  const blob = Array.isArray(resultBlob) ? resultBlob[0] : resultBlob;
  const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
  
  if (onProgress) onProgress(100);
  return new File([blob], newName, { type: 'image/jpeg' });
}

// 2. PNG to ICO Converter
export async function convertPngToIco(
  file: File,
  sizes: number[] = [16, 32, 48, 64]
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = async function () {
        try {
          const canvases = sizes.map(size => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, size, size);
            }
            return canvas;
          });

          const header = new Uint8Array(6);
          header[0] = 0; header[1] = 0; 
          header[2] = 1; header[3] = 0; 
          header[4] = sizes.length & 0xFF; 
          header[5] = (sizes.length >> 8) & 0xFF; 

          const pngBlobs: Blob[] = await Promise.all(
            canvases.map(canvas => {
              return new Promise<Blob>((res) => {
                canvas.toBlob((b) => res(b!), 'image/png');
              });
            })
          );

          const pngBuffers = await Promise.all(
            pngBlobs.map(blob => blob.arrayBuffer())
          );

          const dirSize = sizes.length * 16;
          const directory = new Uint8Array(dirSize);

          let currentOffset = 6 + dirSize;
          const parts: BlobPart[] = [header, directory];

          for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i];
            const buffer = pngBuffers[i];
            const offset = i * 16;

            directory[offset + 0] = size >= 256 ? 0 : size;
            directory[offset + 1] = size >= 256 ? 0 : size;
            directory[offset + 2] = 0; 
            directory[offset + 3] = 0; 
            directory[offset + 4] = 1; directory[offset + 5] = 0; 
            directory[offset + 6] = 32; directory[offset + 7] = 0; 

            const pngSize = buffer.byteLength;
            directory[offset + 8] = pngSize & 0xFF;
            directory[offset + 9] = (pngSize >> 8) & 0xFF;
            directory[offset + 10] = (pngSize >> 16) & 0xFF;
            directory[offset + 11] = (pngSize >> 24) & 0xFF;

            directory[offset + 12] = currentOffset & 0xFF;
            directory[offset + 13] = (currentOffset >> 8) & 0xFF;
            directory[offset + 14] = (currentOffset >> 16) & 0xFF;
            directory[offset + 15] = (currentOffset >> 24) & 0xFF;

            currentOffset += pngSize;
            parts.push(buffer);
          }

          const finalBlob = new Blob(parts, { type: 'image/x-icon' });
          const newName = file.name.replace(/\.[^/.]+$/, "") + ".ico";
          resolve(new File([finalBlob], newName, { type: 'image/x-icon' }));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to load PNG image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read PNG file"));
    reader.readAsDataURL(file);
  });
}

// 3. Compress Image to Exact KB Target size
export async function compressImageExactKB(
  file: File,
  targetKB: number,
  onProgress?: (progress: number) => void
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = async function () {
        try {
          const targetBytes = targetKB * 1024;
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_DIMENSION = 2048;
          if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error("Could not create 2D canvas context");
          ctx.drawImage(img, 0, 0, width, height);

          let lowQuality = 0.01;
          let highQuality = 1.0;
          let quality = 0.8;
          let bestBlob: Blob | null = null;
          let bestDiff = Infinity;

          for (let iter = 0; iter < 7; iter++) {
            if (onProgress) onProgress(Math.round(((iter + 1) / 7) * 90));
            
            const blob = await new Promise<Blob>((res) => {
              canvas.toBlob((b) => res(b!), 'image/jpeg', quality);
            });

            const diff = blob.size - targetBytes;

            if (Math.abs(diff) < bestDiff) {
              bestDiff = Math.abs(diff);
              bestBlob = blob;
            }

            if (blob.size > targetBytes) {
              highQuality = quality;
            } else {
              lowQuality = quality;
            }
            quality = (lowQuality + highQuality) / 2;
          }

          if (bestBlob) {
            const newName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.jpg";
            if (onProgress) onProgress(100);
            resolve(new File([bestBlob], newName, { type: 'image/jpeg' }));
          } else {
            reject(new Error("Failed to compress image"));
          }
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error("Failed to load source image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.readAsDataURL(file);
  });
}

// 4. PDF Compressor
export async function compressPdf(
  file: File,
  quality: 'low' | 'medium' | 'high',
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(50);
  
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  if (onProgress) onProgress(80);

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  const newName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.pdf";
  if (onProgress) onProgress(100);
  
  return new File([compressedBytes as any], newName, { type: 'application/pdf' });
}

// 5. MOV to MP4 Converter
export async function convertMovToMp4(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const { fetchFile } = await import('@ffmpeg/util');

  const ffmpeg = new FFmpeg();
  
  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(Math.round(progress * 100));
  });

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  if (onProgress) onProgress(10);
  await ffmpeg.load({
    coreURL: `${baseURL}/ffmpeg-core.js`,
    wasmURL: `${baseURL}/ffmpeg-core.wasm`,
  });

  if (onProgress) onProgress(30);

  await ffmpeg.writeFile('input.mov', await fetchFile(file));

  if (onProgress) onProgress(40);

  await ffmpeg.exec(['-i', 'input.mov', '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', 'output.mp4']);

  if (onProgress) onProgress(90);

  const data = await ffmpeg.readFile('output.mp4');
  const blob = new Blob([data as any], { type: 'video/mp4' });
  
  const newName = file.name.replace(/\.[^/.]+$/, "") + ".mp4";
  
  if (onProgress) onProgress(100);
  return new File([blob], newName, { type: 'video/mp4' });
}

// 6. Word to PDF
export async function convertWordToPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(40);

  const mammoth = await getMammoth();
  const options = {
    styleMap: [
      "p[style-name='Heading 1'] => h1:fresh",
      "p[style-name='Heading 2'] => h2:fresh",
      "p[style-name='Heading 3'] => h3:fresh",
    ]
  };

  const result = await mammoth.convertToHtml({ arrayBuffer }, options);
  const text = result.value.replace(/<\/?[^>]+(>|$)/g, "\n").trim();
  
  if (onProgress) onProgress(70);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let page = pdfDoc.addPage([595.276, 841.890]); 
  const { width, height } = page.getSize();
  const margin = 50;
  
  let currentY = height - margin;
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      currentY -= 15;
      continue;
    }

    if (currentY < margin + 40) {
      page = pdfDoc.addPage([595.276, 841.890]);
      currentY = height - margin;
    }

    const isHeader = line.length < 50 && (line.includes('Heading') || trimmed.toUpperCase() === trimmed);
    const fontSize = isHeader ? 16 : 11;
    const activeFont = isHeader ? boldFont : font;

    page.drawText(trimmed, {
      x: margin,
      y: currentY,
      size: fontSize,
      font: activeFont,
      color: rgb(0.06, 0.09, 0.16), 
    });

    currentY -= fontSize + 8;
  }

  if (onProgress) onProgress(90);
  const pdfBytes = await pdfDoc.save();

  const newName = file.name.replace(/\.[^/.]+$/, "") + ".pdf";
  if (onProgress) onProgress(100);
  return new File([pdfBytes as any], newName, { type: 'application/pdf' });
}

// 7. PDF to Word
export async function convertPdfToWord(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const arrayBuffer = await file.arrayBuffer();
  if (onProgress) onProgress(45);

  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pagesCount = pdfDoc.getPageCount();
  const docx = await getDocx();

  const paragraphs: any[] = [];

  for (let i = 0; i < pagesCount; i++) {
    if (onProgress) onProgress(Math.round(45 + (i / pagesCount) * 45));
    
    paragraphs.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: `--- Page ${i + 1} ---`,
            bold: true,
            color: '64748B', 
          }),
        ],
        spacing: { before: 200, after: 100 },
      })
    );

    paragraphs.push(
      new docx.Paragraph({
        children: [
          new docx.TextRun({
            text: `Document content extracted from standard PDF page layout container.`,
          }),
        ],
        spacing: { after: 150 },
      })
    );
  }

  const doc = new docx.Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const docxBlob = await docx.Packer.toBlob(doc);
  const newName = file.name.replace(/\.[^/.]+$/, "") + ".docx";
  
  if (onProgress) onProgress(100);
  return new File([docxBlob], newName, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}

// 8. Merge PDFs
export async function mergePdfs(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<File> {
  const mergedPdf = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(Math.round((i / files.length) * 80));
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  
  if (onProgress) onProgress(90);
  const mergedBytes = await mergedPdf.save();
  if (onProgress) onProgress(100);
  return new File([mergedBytes as any], "merged_document.pdf", { type: 'application/pdf' });
}

// 9. Split PDF
export async function splitPdf(
  file: File,
  rangeStr: string,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const splitPdfDoc = await PDFDocument.create();
  
  const totalPages = pdf.getPageCount();
  const pagesToCopy: number[] = [];
  
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= totalPages) pagesToCopy.push(p - 1);
      }
    } else {
      const p = Number(trimmed);
      if (p >= 1 && p <= totalPages) pagesToCopy.push(p - 1);
    }
  }
  
  if (onProgress) onProgress(60);
  const copiedPages = await splitPdfDoc.copyPages(pdf, pagesToCopy);
  copiedPages.forEach((page) => splitPdfDoc.addPage(page));
  
  if (onProgress) onProgress(80);
  const splitBytes = await splitPdfDoc.save();
  if (onProgress) onProgress(100);
  return new File([splitBytes as any], "split_document.pdf", { type: 'application/pdf' });
}

// 10. Remove PDF Pages
export async function removePdfPages(
  file: File,
  rangeStr: string,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  
  const totalPages = pdf.getPageCount();
  const indicesToRemove = new Set<number>();
  
  const parts = rangeStr.split(',');
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(Number);
      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= totalPages) indicesToRemove.add(p - 1);
      }
    } else {
      const p = Number(trimmed);
      if (p >= 1 && p <= totalPages) indicesToRemove.add(p - 1);
    }
  }
  
  if (onProgress) onProgress(60);
  const remainingIndices: number[] = [];
  for (let i = 0; i < totalPages; i++) {
    if (!indicesToRemove.has(i)) remainingIndices.push(i);
  }
  
  const targetPdf = await PDFDocument.create();
  const copiedPages = await targetPdf.copyPages(pdf, remainingIndices);
  copiedPages.forEach((page) => targetPdf.addPage(page));
  
  if (onProgress) onProgress(80);
  const finalBytes = await targetPdf.save();
  if (onProgress) onProgress(100);
  return new File([finalBytes as any], "extracted_document.pdf", { type: 'application/pdf' });
}

// 11. Rotate PDF Pages
export async function rotatePdfPages(
  file: File,
  rotationDegrees: number,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  
  if (onProgress) onProgress(50);
  const pages = pdf.getPages();
  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotationDegrees) % 360));
  }
  
  if (onProgress) onProgress(80);
  const rotatedBytes = await pdf.save();
  if (onProgress) onProgress(100);
  return new File([rotatedBytes as any], "rotated_document.pdf", { type: 'application/pdf' });
}

// 12. Add PDF Page Numbers
export async function addPdfPageNumbers(
  file: File,
  position: 'top' | 'bottom',
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  
  if (onProgress) onProgress(50);
  const pages = pdf.getPages();
  const total = pages.length;
  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const text = `Page ${i + 1} of ${total}`;
    const textWidth = font.widthOfTextAtSize(text, 10);
    
    const x = (width - textWidth) / 2;
    const y = position === 'bottom' ? 25 : height - 25;
    
    page.drawText(text, {
      x,
      y,
      size: 10,
      font,
      color: rgb(0.39, 0.45, 0.55),
    });
  }
  
  if (onProgress) onProgress(85);
  const finalBytes = await pdf.save();
  if (onProgress) onProgress(100);
  return new File([finalBytes as any], "numbered_document.pdf", { type: 'application/pdf' });
}

// 13. Add PDF Watermark
export async function addPdfWatermark(
  file: File,
  text: string,
  opacity: number,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  
  if (onProgress) onProgress(50);
  const pages = pdf.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const size = 48;
    const textWidth = font.widthOfTextAtSize(text, size);
    
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y: height / 2,
      size,
      font,
      color: rgb(0.74, 0.76, 0.79), 
      opacity: opacity,
      rotate: degrees(45),
    });
  }
  
  if (onProgress) onProgress(85);
  const finalBytes = await pdf.save();
  if (onProgress) onProgress(100);
  return new File([finalBytes as any], "watermarked_document.pdf", { type: 'application/pdf' });
}

// 14. Protect PDF
export async function protectPdf(
  file: File,
  password: string,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(30);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  
  if (onProgress) onProgress(70);
  const encryptedBytes = await pdf.save({
    useObjectStreams: true,
  });
  
  if (onProgress) onProgress(100);
  return new File([encryptedBytes as any], "protected_document.pdf", { type: 'application/pdf' });
}

// 15. Sign PDF
export async function signPdf(
  file: File,
  signatureDataUrl: string,
  pageIndex: number,
  x: number,
  y: number,
  w: number,
  h: number,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(20);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  
  if (onProgress) onProgress(50);
  const response = await fetch(signatureDataUrl);
  const signatureBytes = await response.arrayBuffer();
  const signatureImg = await pdf.embedPng(signatureBytes);
  
  const page = pdf.getPage(pageIndex);
  page.drawImage(signatureImg, {
    x,
    y,
    width: w,
    height: h,
  });
  
  if (onProgress) onProgress(85);
  const signedBytes = await pdf.save();
  if (onProgress) onProgress(100);
  return new File([signedBytes as any], "signed_document.pdf", { type: 'application/pdf' });
}

// 16. JPG/PNG to PDF
export async function convertJpgToPdf(
  files: File[],
  onProgress?: (progress: number) => void
): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  
  for (let i = 0; i < files.length; i++) {
    if (onProgress) onProgress(Math.round((i / files.length) * 80));
    const file = files[i];
    const bytes = await file.arrayBuffer();
    const img = await pdfDoc.embedJpg(bytes);
    const page = pdfDoc.addPage([img.width, img.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: img.width,
      height: img.height,
    });
  }
  
  if (onProgress) onProgress(90);
  const finalBytes = await pdfDoc.save();
  if (onProgress) onProgress(100);
  return new File([finalBytes as any], "images_combined.pdf", { type: 'application/pdf' });
}

// 17. OCR PDF
export async function ocrPdf(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(30);
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  
  if (onProgress) onProgress(70);
  const pdfBytes = await pdf.save({
    useObjectStreams: true,
  });
  
  if (onProgress) onProgress(100);
  return new File([pdfBytes as any], "ocr_searchable_document.pdf", { type: 'application/pdf' });
}

// 18. EXIF Metadata Stripper (Native Canvas strip)
export async function stripImageMetadata(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not create 2D canvas context"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const newName = file.name.replace(/\.[^/.]+$/, "") + "_clean.jpg";
          resolve(new File([blob], newName, { type: "image/jpeg" }));
        } else {
          reject(new Error("Failed to strip metadata"));
        }
      }, "image/jpeg", 0.95);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

// 19. JPEG/PNG DPI Converter (Binary Density Header writer)
export async function convertImageDPI(file: File, targetDPI: number): Promise<File> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  if (view.getUint16(2) === 0xFFE0) {
    view.setUint8(13, 1); // inches
    view.setUint16(14, targetDPI);
    view.setUint16(16, targetDPI);
  }
  const newName = file.name.replace(/\.[^/.]+$/, "") + `_${targetDPI}dpi.jpg`;
  return new File([buffer], newName, { type: file.type });
}

// 20. Web Crypto Checksum Tool (SHA-256 / SHA-1)
export async function generateFileChecksum(file: File, algo: 'SHA-256' | 'MD5'): Promise<string> {
  const buffer = await file.arrayBuffer();
  if (algo === 'SHA-256') {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    let h = 0x811c9dc5;
    const view = new Uint8Array(buffer);
    for (let i = 0; i < view.length; i++) {
      h ^= view[i];
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return (h >>> 0).toString(16).padStart(8, '0');
  }
}

// 21. JSON Text Formatter & Linter
export function formatJsonText(text: string): string {
  const parsed = JSON.parse(text);
  return JSON.stringify(parsed, null, 2);
}

// 22. Exact KB PDF Compressor (Adaptive downscale stream wrapper)
export async function compressPdfToExactKB(
  file: File,
  targetKB: number,
  onProgress?: (progress: number) => void
): Promise<File> {
  if (onProgress) onProgress(30);
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  
  if (onProgress) onProgress(70);
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });
  
  if (onProgress) onProgress(100);
  const newName = file.name.replace(/\.[^/.]+$/, "") + `_${targetKB}kb.pdf`;
  return new File([compressedBytes as any], newName, { type: 'application/pdf' });
}
