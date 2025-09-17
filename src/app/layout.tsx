import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import  Footer  from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Village Kart",
  description: "GramBazaar (Village Kart) is a Next.js 15 MERN Stack e-commerce platform built as a full-stack project. It allows users to explore rural products, book and pay securely via Stripe Sandbox, and provides a separate Admin Dashboard for managing the platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-200 flex flex-col min-h-screen `}
      >
        <Navbar/>
        <Toaster position="top-right"/>
        <main className="flex-1">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
