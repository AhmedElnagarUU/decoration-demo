import { ContactForm } from "@/features/contact/components/ContactForm";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <div className="bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-muted">{t("subtitle")}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <ContactForm />

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest">
                {t("address")}
              </h3>
              <p className="mt-2 text-muted">
                42 Design District, Zamalek
                <br />
                Cairo, Egypt 11211
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest">
                {t("phoneLabel")}
              </h3>
              <p className="mt-2 text-muted">+20 2 1234 5678</p>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-widest">
                {t("emailLabel")}
              </h3>
              <p className="mt-2 text-muted">hello@elara.com</p>
            </div>

            <div className="aspect-video overflow-hidden rounded-sm bg-border">
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.8!2d31.22!3d30.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDAzJzM2LjAiTiAzMcKwMTMnMTIuMCJF!5e0!3m2!1sen!2seg!4v1"
                className="h-full w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
