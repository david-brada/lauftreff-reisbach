"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Mountain } from "lucide-react";

const navItems = [
  { href: "/", label: "Start" },
  { href: "/aktivitaeten", label: "Aktivitäten" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/challenges", label: "Challenges" },
  { href: "/strecken", label: "Strecken" },
  { href: "/statistiken", label: "Statistiken" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <Mountain className="w-7 h-7" />
            <span className="hidden sm:inline">Lauftreff Reisbach</span>
            <span className="sm:hidden">LT Reisbach</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100"
            aria-label="Menü"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text hover:bg-stone-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
