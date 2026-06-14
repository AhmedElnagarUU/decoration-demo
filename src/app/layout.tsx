import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Valor — Interior Design & Decoration",
  description:
    "Elevate your home with modern furniture, decor, and interior design services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-60KBZZRQ01"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-60KBZZRQ01');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
