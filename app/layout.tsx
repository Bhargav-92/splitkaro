import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SplitKaro — Split bills & generate UPI QR codes",
  description:
    "Split any bill equally and generate individual UPI payment QR codes for each person. Works with all UPI apps — PhonePe, Google Pay, Paytm, BHIM, and more.",
  keywords: [
    "UPI",
    "bill split",
    "QR code",
    "payment",
    "India",
    "SplitKaro",
  ],
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 font-sans antialiased">
        <Navbar />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}