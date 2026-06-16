import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav"; // Mobil menüyü içe aktardık

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
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <Navbar />
          {children}
          <MobileNav /> {/* Mobil menüyü ekledik */}
        </ThemeProvider>
      </body>
    </html>
  );
}