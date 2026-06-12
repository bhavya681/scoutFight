import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import { Providers } from "@/components/providers";
import { TalentAiPanel } from "@/components/ai/talent-ai-panel";
import { CompareBar } from "@/components/compare/compare-bar";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION, APP_LOGO } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: `${APP_NAME} — ${APP_TAGLINE}`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "wrestler recruiting",
    "MMA talent scout",
    "combat sports recruiter tool",
    "fighter discovery",
    "boxing scout platform",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: APP_NAME,
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: APP_LOGO,
        width: 1200,
        height: 1050,
        alt: `${APP_NAME} — ${APP_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — ${APP_TAGLINE}`,
    description: APP_DESCRIPTION,
    images: [APP_LOGO],
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/apple-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f4f5" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable} h-full`}>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans antialiased"
      >
        <Providers>
          {children}
          <CompareBar />
          <TalentAiPanel />
        </Providers>
      </body>
    </html>
  );
}
