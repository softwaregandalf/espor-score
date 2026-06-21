import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider"; // 🚀 EKLENDİ

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEXUS PRO | Espor Ekosistemi",
  description: "Global Espor Canlı Skor, Sonuçlar ve Haberler",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* 🚀 EKLENDİ: Tüm proje dil sistemi ile sarmalandı */}
          <LanguageProvider>
            <MainLayout>{children}</MainLayout>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}