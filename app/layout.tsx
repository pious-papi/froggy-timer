import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const pixelfont = VT323({
  variable: "--font-pixelfont",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ribbit focus",
  description: "A lofi pomodoro timer for busy minds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pixelfont.variable} font-pixel bg-[#ffffff] text-[#000000] h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
