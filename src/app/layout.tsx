import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zuplo AI Console",
  description: "Zuplo AI Console",
  icons: {
    icon: "https://cdn.zuplo.com/www/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <div className="border-b">
            <div className="flex items-center justify-center h-10 py-6 gap-4 relative mx-auto max-w-screen-xl">
              <img
                src="https://portal.zuplo.com/zuplo.svg"
                alt="Zuplo Logo"
                className="h-8 w-auto absolute left-0"
              />
              <div className="flex items-center gap-2">
                <button className="text-[#FF00BD] p-1 px-2 rounded text-xs font-medium bg-[#FFE3FC]">
                  Console
                </button>
                <button className="hover:text-[#FF00BD] p-1 px-2 rounded text-xs font-medium ">
                  Services
                </button>
                <button className="hover:text-[#FF00BD] p-1 px-2 rounded text-xs font-medium ">
                  Settings
                </button>
              </div>
            </div>
          </div>
          <div className="bg-neutral-100">{children}</div>
        </div>
      </body>
    </html>
  );
}
