import { IS_PRODUCTION } from "@/lib/config";
import { pixels } from "@/lib/pixels/service";
import { AnalyticsTracker } from "@/shared/components/AnalyticsTracker";
import { Footer } from "@/shared/components/Footer";
import { LocaleHtmlAttributes } from "@/shared/components/LocaleHtmlAttributes";
import { MainWithOffset } from "@/shared/components/MainWithOffset";
import { PixelInjector } from "@/shared/components/PixelInjector";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

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
    <div className="flex min-h-full flex-col" dir={dir}>
      <LocaleHtmlAttributes locale={locale} dir={dir} />
      <NextIntlClientProvider messages={messages}>
        <SiteHeader />
        <MainWithOffset>{children}</MainWithOffset>
        <Footer />
        <AnalyticsTracker />
        {enabledPixels.length > 0 && <PixelInjector pixels={enabledPixels} />}
      </NextIntlClientProvider>
    </div>
  );
}
