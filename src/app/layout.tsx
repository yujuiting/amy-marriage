import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import { WalletProvider } from "@/components/WalletProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Amy Marriage Yields... | Celebrate Amy's Wedding",
  description: "Send your blessings and congratulations to Amy on her special day!",
  openGraph: {
    title: "Amy Marriage Yields...",
    description: "Celebrate Amy's wedding and send your blessings!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} antialiased`}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
