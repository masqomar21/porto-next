"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon, Menu, X } from "lucide-react";

const sectionLinkMap: Record<
  string,
  { label: string; href: string; type: string }
> = {
  about: { label: "About", href: "#about", type: "section" },
  experience: { label: "Experience", href: "#experience", type: "section" },
  skills: { label: "Skills", href: "#skills", type: "section" },
  projects: { label: "Projects", href: "#projects", type: "section" },
  media: { label: "Media", href: "#media", type: "section" },
  contact: { label: "Contact", href: "#contact", type: "section" },
};

export default function Navbar({
  navbarData,
}: {
  navbarData: {
    title?: string;
    imageUrl?: string;
    darkImageUrl?: string;
    sectionOrder?: string[];
  };
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const activeTheme = mounted ? (resolvedTheme || theme) : "light";
  const activeLogo =
    activeTheme === "dark"
      ? navbarData?.darkImageUrl || navbarData?.imageUrl
      : navbarData?.imageUrl || navbarData?.darkImageUrl;

  const sectionOrder = navbarData?.sectionOrder || [
    "hero",
    "about",
    "experience",
    "skills",
    "projects",
    "blog",
    "media",
    "contact",
  ];

  const links: { label: string; href: string; type: string }[] = [];
  sectionOrder.forEach((sectionId) => {
    if (sectionLinkMap[sectionId]) {
      links.push(sectionLinkMap[sectionId]);
    }
  });
  links.push({ label: "Blog", href: "/blog", type: "page" });
  links.push({ label: "Media", href: "/media", type: "page" });

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!activeLogo || !mounted) return;
    const existingLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
    if (existingLinks.length > 0) {
      existingLinks.forEach((link) => {
        link.href = activeLogo;
      });
    } else {
      const newLink = document.createElement("link");
      newLink.rel = "icon";
      newLink.href = activeLogo;
      document.head.appendChild(newLink);
    }
  }, [activeLogo, mounted]);

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
        className={`fixed top-0 left-0 right-0 z-[1000] h-16 flex items-center px-6 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/60 shadow-2xs"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <Link
            href="/"
            className="font-sans font-bold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity flex items-center gap-2.5"
          >
            {activeLogo ? (
              <img
                src={activeLogo}
                alt="Logo"
                className="w-7 h-7 rounded-xl object-cover border border-border/60 bg-muted/40 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : null}
            <span>{navbarData.title || "Portfolio"}</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-5 text-xs font-mono text-muted-foreground">
              {links.map((l) =>
                l.type === "section" ? (
                  <button
                    key={l.label}
                    onClick={() => handleScroll(l.href)}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    {l.label}
                  </button>
                ) : (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/60 hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {activeTheme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[998] bg-background/60 backdrop-blur-sm sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[999] w-64 bg-background border-l border-border/40 p-6 pt-20 flex flex-col gap-4 shadow-xl sm:hidden transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-3 font-mono text-xs">
          {links.map((l) =>
            l.type === "section" ? (
              <button
                key={l.label}
                onClick={() => {
                  setMenuOpen(false);
                  handleScroll(l.href);
                }}
                className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {l.label}
              </button>
            ) : (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </>
  );
}
