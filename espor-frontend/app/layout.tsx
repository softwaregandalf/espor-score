import type { Metadata } from "next";
import { Inter, Rajdhani, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import MainLayout from "@/components/MainLayout";

// Özel Fontlarımızı Yüklüyoruz
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const rajdhani = Rajdhani({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-rajdhani" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "NEXUS PRO | Espor Arena",
  description: "Global Canlı Espor Skorları ve İstatistikleri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font değişkenlerini HTML etiketine gömüyoruz
    <html lang="tr" suppressHydrationWarning className={`${inter.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased text-white selection:bg-cyan-500/30 selection:text-cyan-200" style={{ background: 'var(--es-bg)' }}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}