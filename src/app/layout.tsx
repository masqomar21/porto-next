import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import NavbarModel from "@/models/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | Portfolio",
    default: "Developer Portfolio",
  },
  description: "Full-stack developer portfolio and blog.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let contactData = {};
  let navbarData = {};
  try {
    await connectDB();
    const contact = await Contact.findOne({}).lean();
    const navbar = await NavbarModel.findOne({}).lean();
    if (contact) {
      contactData = JSON.parse(JSON.stringify(contact));
    }

    if (navbar) {
      navbarData = JSON.parse(JSON.stringify(navbar));
    }
  } catch (error) {
    console.error("Failed to fetch contact data for footer:", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <Navbar navbarData={navbarData} />
          <main className="flex-1">{children}</main>
          <Footer contactData={contactData} />
        </ThemeProvider>
      </body>
    </html>
  );
}
