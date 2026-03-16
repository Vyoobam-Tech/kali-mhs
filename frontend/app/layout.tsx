import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { organizationJsonLd } from "@/lib/seo/metadata";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kalimhs.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kali MHS | Premium Roofing & Cladding Solutions",
    template: "%s | Kali MHS",
  },
  description:
    "Kali MHS is a leading manufacturer of metal roofing sheets, sandwich panels, polycarbonate systems, fiber cement sheets, and complete cladding solutions across India.",
  keywords: [
    "metal roofing", "roofing sheets", "sandwich panels", "metal cladding",
    "polycarbonate sheets", "fiber cement", "skylight panels", "roofing manufacturer",
    "industrial roofing", "commercial roofing", "India roofing",
  ],
  authors: [{ name: "Kali MHS" }],
  creator: "Kali MHS",
  publisher: "Kali MHS",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Kali MHS",
    title: "Kali MHS | Premium Roofing & Cladding Solutions",
    description:
      "Premium manufacturer of metal roofing, sandwich panels, and cladding solutions trusted across India.",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Kali MHS — Premium Roofing Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@kalimhs",
    creator: "@kalimhs",
    title: "Kali MHS | Premium Roofing & Cladding Solutions",
    description: "Premium manufacturer of metal roofing and cladding solutions across India.",
    images: ["/og-default.jpg"],
  },
  alternates: { canonical: BASE_URL },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {/* Organization JSON-LD */}
        <script
          id="org-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          <QueryProvider>
              {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
