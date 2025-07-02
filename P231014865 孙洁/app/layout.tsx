import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "疯狂动物城 - Web前端开发",
  description: "疯狂动物城主题的Web前端开发课程练习",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} flex flex-col min-h-screen zootopia-container`}>
        <Header />
        <main className="flex-grow container mx-auto p-4 md:p-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
