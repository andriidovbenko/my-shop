import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | " + SITE_NAME,
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "E-commerce store",
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    site: "@3dyvo",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
    telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
    },
    sameAs: [
      "https://youtube.com/@3dyvo",
      "https://www.instagram.com/3dyvo.com.ua",
      "https://www.tiktok.com/@3dyvo",
    ],
  };

  return (
    <html lang="uk" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
