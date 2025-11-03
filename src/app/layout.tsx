import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NotificationProvider } from "@/contexts/NotificationContext";
import NotificationToast from "@/components/enhanced/NotificationToast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetaBite - DNA-Powered Nutrition",
  description: "Personalized nutrition and lifestyle recommendations based on your DNA analysis. Track meals, activities, and get genetic insights for optimal health.",
  keywords: ["DNA", "nutrition", "health", "personalized", "genetics", "wellness", "MetaBite"],
  authors: [{ name: "MetaBite Team" }],
  openGraph: {
    title: "MetaBite - DNA-Powered Nutrition",
    description: "Personalized nutrition and lifestyle recommendations based on your DNA analysis",
    url: "https://metabite.app",
    siteName: "MetaBite",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MetaBite - DNA-Powered Nutrition",
    description: "Personalized nutrition and lifestyle recommendations based on your DNA analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NotificationProvider userId="user-123">
          {children}
          <NotificationToast />
          <Toaster />
        </NotificationProvider>
      </body>
    </html>
  );
}
