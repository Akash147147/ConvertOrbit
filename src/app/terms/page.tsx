import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Award, HelpCircle } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 py-16 bg-slate-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-sm font-medium text-slate-500 max-w-xl mx-auto">
              Simple, transparent usage rules for a safer web. No accounts, no data limits, and total user ownership.
            </p>
          </div>

          {/* Document Content */}
          <div className="bg-white border border-card-border rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-100/50 space-y-8 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">1. Acceptance of Terms</h2>
              <p>
                By accessing and utilizing **FileForge**, you agree to be bound by these terms. Since FileForge runs entirely in your local browser sandbox, these terms govern the interface use and client-side scripts loaded on your device.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">2. Permitted Use</h2>
              <p>
                You are granted full permission to process unlimited files (documents, images, videos) using our platform. Because all processing is client-side, we impose no daily quotas, file size boundaries, or registration requirements. 
              </p>
              <p>
                You are strictly prohibited from using browser automation or scripting to maliciously scrape our site or overwhelm our content delivery networks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">3. Intellectual Property and Content</h2>
              <p>
                At no point does FileForge acquire any rights or intellectual property over the files you upload. Since files never reach our servers, you retain 100% ownership and copyright of your assets throughout the operation.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-slate-800">4. Disclaimer of Warranties</h2>
              <p>
                FileForge is provided "as is". While our browser-based engines are optimized for speed and precise output alignment, we make no representations or warranties concerning file safety or absolute conversion fidelity for highly specialized, legacy encodings.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
