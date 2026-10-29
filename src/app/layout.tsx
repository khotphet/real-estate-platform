import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sarabun } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MapNest — ค้นหาบ้าน คอนโด ที่ดิน บนแผนที่",
  description: "แพลตฟอร์มซื้อ-ขาย-เช่าอสังหาริมทรัพย์แบบแผนที่ ทั่วประเทศไทย ทั้ง 77 จังหวัด",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${jakarta.variable} ${sarabun.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
