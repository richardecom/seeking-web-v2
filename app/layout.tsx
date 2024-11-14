"use client";
// import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Loader from '@/components/Loader'
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/context/UserContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <UserProvider>
          {loading ? <Loader /> : children}
        </UserProvider>
        <Toaster/>
      </body>
    </html>
  );
}