import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkedIn Growth Tool — AI-Powered Profile & Content Optimizer",
  description:
    "Grow your LinkedIn presence with AI-powered profile optimization, content creation, analytics tracking, and personalized growth coaching. Powered by Google Gemini.",
  keywords: ["LinkedIn", "growth", "AI", "profile optimizer", "content creator", "Gemini"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
