"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";

interface AdPlaceholderProps {
  slot: string;
  format?: "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export default function AdPlaceholder({
  slot,
  format = "horizontal",
  className = "",
}: AdPlaceholderProps) {
  const [isAdBlockerActive, setIsAdBlockerActive] = useState(false);

  // Simple ad-block detection mock
  useEffect(() => {
    const testAd = document.createElement("div");
    testAd.innerHTML = "&nbsp;";
    testAd.className = "adsbygoogle";
    testAd.style.position = "absolute";
    testAd.style.left = "-999px";
    testAd.style.top = "-999px";
    document.body.appendChild(testAd);
    
    setTimeout(() => {
      if (testAd.offsetHeight === 0) {
        setIsAdBlockerActive(true);
      }
      document.body.removeChild(testAd);
    }, 100);
  }, []);

  const dimensions = {
    horizontal: "h-[90px] w-full max-w-[728px]",
    vertical: "h-[600px] w-[160px]",
    rectangle: "h-[250px] w-full max-w-[300px]",
  };

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-2 text-center select-none transition-all duration-300 hover:border-slate-300 ${dimensions[format]} ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
        <span>Advertisement</span>
        <HelpCircle className="h-3 w-3" />
      </div>
      
      {/* Real AdSense Element Template (uncomment/integrate real tag in production) */}
      {/* 
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
           data-ad-slot={slot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
      <script>
           (adsbygoogle = window.adsbygoogle || []).push({});
      </script> 
      */}

      <span className="text-[10px] text-slate-400 mt-1 font-mono">
        Slot: {slot} {isAdBlockerActive ? "(AdBlocker Detected)" : ""}
      </span>
    </div>
  );
}
