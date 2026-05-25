import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, EyeOff, Key, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-slate-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-md">
              <Shield className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Privacy Policy & Trust Agreement
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
              At FileForge, we believe privacy is a fundamental human right. That is why your files never touch our servers.
            </p>
          </div>

          {/* Key Promises Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <EyeOff className="h-5 w-5 text-emerald-600" />, title: "Zero Retention", desc: "No files are saved, cached, or transferred. All bytes stay local." },
              { icon: <Database className="h-5 w-5 text-sky-600" />, title: "No Accounts", desc: "Use all features without registering, login credentials, or tracking cookies." },
              { icon: <Key className="h-5 w-5 text-indigo-600" />, title: "Client Sandbox", desc: "Processing is completed inside your browser's private sandbox." }
            ].map((p, idx) => (
              <div key={idx} className="bg-white border border-card-border p-6 rounded-2xl shadow-sm space-y-3">
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl w-fit">
                  {p.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800">{p.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Document Content */}
          <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50 space-y-8 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">1. Information We Do Not Collect</h2>
              <p>
                Unlike standard utility platforms, **FileForge** operates using Next-Gen browser capabilities (FileReader, Canvas, Web Crypto API, WebAssembly). We do **not** upload, transfer, or process your files on any external server. 
              </p>
              <p>
                Your files remain completely in your browser's temporary memory space and are automatically purged when the tab is closed or a new file is loaded.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">2. Analytics and Audits</h2>
              <p>
                We do not implement trackers, third-party cookies, or fingerprinting scripts. We maintain lightweight, server-level access logs purely for security, DDoS protection, and rate limiting validation, which contain no personal identifiers or document content.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">3. Local Storage</h2>
              <p>
                We occasionally utilize standard browser LocalStorage to cache client preferences (such as dark mode choices, default custom KB selections, or specific visa template settings). This data never leaves your device and can be cleared in your browser settings at any time.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">4. Contact & Transparency</h2>
              <p>
                For questions regarding this policy or our underlying client-side execution algorithms, please refer to our Transparency and Security pages. Your trust is our greatest asset.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
