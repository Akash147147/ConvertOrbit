"use client";

import Link from "next/link";
import { Orbit, Search, Shield, Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border glass-panel transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-accent-blue to-accent-indigo text-white shadow-md shadow-accent-blue/15 transition-all duration-300 group-hover:shadow-accent-blue/30 group-hover:rotate-12">
                <Orbit className="h-5 w-5" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-800 bg-clip-text text-transparent">
                File<span className="bg-gradient-to-r from-accent-blue to-accent-indigo bg-clip-text text-transparent">Forge</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#all-tools" className="text-sm font-medium text-slate-600 transition-colors hover:text-accent-blue">
                All Tools
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-accent-blue">
                How It Works
              </Link>
              <Link href="/#security" className="text-sm font-medium text-slate-600 transition-colors hover:text-accent-blue">
                Privacy First
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                placeholder="Search tools... (Ctrl+K)"
                className="w-56 rounded-xl border border-card-border bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-accent-blue/50 focus:bg-white focus:ring-2 focus:ring-accent-blue/10"
                onClick={() => {
                  const searchEl = document.getElementById("search-input-field");
                  if (searchEl) {
                    searchEl.scrollIntoView({ behavior: "smooth" });
                    searchEl.focus();
                  } else {
                    window.location.href = "/#all-tools";
                  }
                }}
                readOnly
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-accent-blue">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>100% Client Side</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
