"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";

const links = [
  { label: "About", href: "#about", type: "section" },
  { label: "Skills", href: "#skills", type: "section" },
  { label: "Projects", href: "#projects", type: "section" },
  { label: "Contact", href: "#contact", type: "section" },
  // { label: 'Projects', href: '/projects', type: 'page' },
  { label: "Blog", href: "/blog", type: "page" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleScroll = (href: string) => {
    setMenuOpen(false);
    if (pathname !== "/") {
      router.push("/" + href);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[1000] h-20 flex items-center px-6 md:px-12 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-foreground/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-serif italic font-bold text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          Portfolio.
        </Link>

        <div className="flex items-center gap-4 md:gap-8 ml-auto">
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) =>
              l.type === "section" ? (
                <button
                  key={l.label}
                  onClick={() => handleScroll(l.href)}
                  className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ),
            )}
            {/* <Link
              href="/projects"
              className="text-xs font-mono uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              Projects
            </Link> */}
          </div>

          {/* Theme Toggle Button */}
          {mounted ? (
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          ) : (
            <div className="w-10 h-10 rounded-full border border-foreground/10 bg-transparent" />
          )}

          {/* Desktop Admin Button */}
          {/* <Link
            href="/admin"
            className="hidden md:inline-block px-5 py-2.5 bg-foreground text-background hover:opacity-90 rounded-full text-xs font-mono uppercase tracking-widest transition-all"
          >
            Admin
          </Link> */}

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-foreground hover:bg-foreground/5 rounded-full cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[998] bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[999] w-full sm:w-80 bg-background border-l border-foreground/10 p-6 pt-24 flex flex-col gap-6 shadow-2xl md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6 font-mono text-sm uppercase tracking-widest">
          {links.map((l) =>
            l.type === "section" ? (
              <button
                key={l.label}
                onClick={() => {
                  setMenuOpen(false);
                  handleScroll(l.href);
                }}
                className="text-left py-2 border-b border-foreground/5 text-foreground/75 hover:text-foreground transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 border-b border-foreground/5 text-foreground/75 hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ),
          )}
          {/* <Link
            href="/projects"
            onClick={() => setMenuOpen(false)}
            className="py-2 border-b border-foreground/5 text-foreground/75 hover:text-foreground transition-colors"
          >
            Projects
          </Link> */}
          {/* <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="mt-4 py-3 bg-foreground text-background rounded-full text-xs text-center font-bold transition-all"
          >
            Admin
          </Link> */}
        </div>
      </div>
    </>
  );
}
