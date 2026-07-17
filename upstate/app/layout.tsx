import type { Metadata } from "next";
import { Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { content } from "@/content";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Upstate — Energy Anywhere | 100mg Caffeine Capsules",
  description: `${content.product.name}: ${content.product.caffeineMgPerCapsule}mg caffeine per capsule, ${content.product.capsulesPerBottle} capsules per bottle. Zero sugar. NZ-wide shipping.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      {/*
        Analytics slot — intentionally empty.
        When a pixel/analytics script is approved, add it here via next/script:
        <Script src="..." strategy="afterInteractive" />
      */}
      <body className="bg-ink text-steel">{children}</body>
    </html>
  );
}
