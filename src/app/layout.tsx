import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Elara — Modern Furniture & Interior Design",
  description:
    "Elevate your home with modern furniture, decor, and interior design services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
