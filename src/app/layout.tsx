import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@styles/globals.css";
import "@styles/grid.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Suspense } from "react";
import Loader from "@components/Loader";

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

export const metadata: Metadata = {
  title: {
    default: "Job Finder",
    template: "%s | Job Finder",
  },
  description:
    "Job Finder is a place where you can find all the jobs you need for your career.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProviderWrapper>
          <Navbar />
          <Suspense fallback={<Loader />}>
            <div className="flex-grow">{children}</div>
          </Suspense>
        </SessionProviderWrapper>
        <Toaster
          position="bottom-right"
          richColors
        />
      </body>
    </html>
  );
}
