import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav"; // Mobil menüyü içe aktardık

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Espor Arena",
  description: "Global Canlı Espor Skorları",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning eklendi
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          {children}
          <MobileNav /> {/* Mobil menüyü ekledik */}
        </ThemeProvider>
      </body>
    </html>
  );
}