export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { ISetting } from "@/lib/database/models/setting.model";
import { getSetting } from "@/lib/actions/setting.actions";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});

function stripHtml(html?: string) {
  return html?.replace(/<[^>]+>/g, "") || "";
}

export async function generateMetadata(): Promise<Metadata> {
  const settings: ISetting | null = await getSetting();

  return {
    title: settings
      ? `${settings.name} | ${settings.tagline || ""}`
      : "E-Books",
    description:
      stripHtml(settings?.description) ||
      "E-Books is a modern online bookstore built for readers who want choice, convenience, and great prices. From bestsellers and fiction to academic titles and self-development books, E-Books brings you a curated collection with fast delivery and a smooth shopping experience. Explore new releases, discover hidden gems, and shop confidently — your next great read is only a click away.",
    keywords: ["Online Book Store", "E-Book", "Book Shop"],
    icons: {
      icon: settings?.favicon,
      shortcut: "/assets/images/logo.png",
      apple: "/assets/images/logo.png",
    },
    alternates: {
      canonical: "https://e-books-six.vercel.app/",
    },
    openGraph: {
      title: settings
        ? `${settings.name} | Books You Love. Prices You’ll Love More.`
        : "E-Books",
      description:
        settings?.description ||
        "E-Books is a modern online bookstore built for readers who want choice, convenience, and great prices. From bestsellers and fiction to academic titles and self-development books, E-Books brings you a curated collection with fast delivery and a smooth shopping experience. Explore new releases, discover hidden gems, and shop confidently — your next great read is only a click away.",
      url: "https://e-books-six.vercel.app/",
      siteName: settings?.name || "E-Books",
      images: [
        {
          url: "https://e-books-six.vercel.app/assets/images/logo.png",
          width: 1200,
          height: 630,
          alt: settings?.name || "E-Books",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings ? `${settings.name} | Shop Books Online` : "E-Books",
      description:
        settings?.description ||
        "E-Books is a modern online bookstore built for readers who want choice, convenience, and great prices. From bestsellers and fiction to academic titles and self-development books, E-Books brings you a curated collection with fast delivery and a smooth shopping experience. Explore new releases, discover hidden gems, and shop confidently — your next great read is only a click away.",
      images: ["/assets/images/logo.png"],
    },
  };
}

export async function generateStaticParams() {
  // optional for i18n or static params, else omit if unused
  return [];
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${dmSerif.variable} font-sans`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
