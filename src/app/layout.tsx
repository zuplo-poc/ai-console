import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

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
            <div className="flex items-center justify-between h-10 py-6 gap-4 relative mx-auto max-w-(--breakpoint-xl)">
              <Image
                src="https://portal.zuplo.com/zuplo.svg"
                alt="Zuplo Logo"
                width={120}
                height={32}
                className="h-8 w-auto"
              />
              <div className="flex items-center gap-2">
                <button className="text-[#FF00BD] p-1 px-2 rounded text-sm font-medium bg-[#FFE3FC]">
                  Console
                </button>
                <button className="hover:text-[#FF00BD] p-1 px-2 rounded text-sm font-medium ">
                  Services
                </button>
                <button className="hover:text-[#FF00BD] p-1 px-2 rounded text-sm font-medium ">
                  Settings
                </button>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  Peter Siki
                </span>
                <Image
                  src="https://cdn.zuplo.com/www/images/headshot-peter.jpg"
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            </div>
          </div>
          <div className="bg-neutral-100">{children}</div>
        </div>
      </body>
    </html>
  );
}
