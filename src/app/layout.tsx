import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientBody from "./ClientBody";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Masafumi Nozawa (Fumi Nozawa) | Digital Marketer & Developer",
  description: "Portfolio of Masafumi Nozawa (Fumi Nozawa) - Freelance Digital Marketer & Web Engineer specializing in SEO, GEO, Japan Market Entry, and AI-driven growth strategies.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QDXNCB397Q"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QDXNCB397Q');
          `}
        </Script>
        <Script
          src="https://chat-pi-ivory-40.vercel.app/api/embed/6c6a027d-76dc-496a-a2d7-8005ea99a800.js"
          strategy="afterInteractive"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
