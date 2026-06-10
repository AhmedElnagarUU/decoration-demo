import { AboutSection } from "@/features/home/components/AboutSection";
import { CategoryCards } from "@/features/home/components/CategoryCards";
import { CtaSection } from "@/features/home/components/CtaSection";
import { HeroSection } from "@/features/home/components/HeroSection";
import { OurWorkSection } from "@/features/home/components/OurWorkSection";
import { ServicesSection } from "@/features/home/components/ServicesSection";
import { ShowcaseSection } from "@/features/home/components/ShowcaseSection";
import { StatsSection } from "@/features/home/components/StatsSection";
import { TestimonialsSection } from "@/features/home/components/TestimonialsSection";
import { data } from "@/lib/data";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const projects = await data.getProjects(true);

  return (
    <>
      <HeroSection locale={locale} />
      <CategoryCards locale={locale} />
      <ShowcaseSection locale={locale} />
      <AboutSection locale={locale} />
      <OurWorkSection projects={projects} />
      <ServicesSection />
      <StatsSection />
      <TestimonialsSection />
      <CtaSection locale={locale} />
    </>
  );
}
