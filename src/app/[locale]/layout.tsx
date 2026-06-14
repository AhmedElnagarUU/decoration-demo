import { IS_PRODUCTION } from "@/lib/config";
import { pixels } from "@/lib/pixels/service";
import { AnalyticsTracker } from "@/shared/components/AnalyticsTracker";
import { Footer } from "@/shared/components/Footer";
import { MainWithOffset } from "@/shared/components/MainWithOffset";
import { PixelInjector } from "@/shared/components/PixelInjector";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { notFound } from "next/navigation";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const enabledPixels = IS_PRODUCTION ? await pixels.getEnabledPixels() : [];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <SiteHeader />
          <MainWithOffset>{children}</MainWithOffset>
          <Footer />
          <AnalyticsTracker />
          {enabledPixels.length > 0 && <PixelInjector pixels={enabledPixels} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
