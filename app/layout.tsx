import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BidHub - User to User Auction Platform",
  description: "BidHub is a user-to-user auction platform where you can buy and sell items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
