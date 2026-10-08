import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Sarabun } from "next/font/google";
import "./globals.css";

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
  description: "แพลตฟอร์มซื้อ-ขาย-เช่าอสังหาริมทรัพย์แบบแผนที่ เริ่มต้นที่อุดรธานี",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${jakarta.variable} ${sarabun.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
