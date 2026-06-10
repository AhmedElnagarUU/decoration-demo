import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";

const team = [
  { name: "Nadia El-Sayed", role: "Creative Director" },
  { name: "Omar Hassan", role: "Lead Designer" },
  { name: "Lina Farouk", role: "Project Manager" },
];

const milestones = [
  { year: "2012", event: "Elara founded in Cairo" },
  { year: "2016", event: "Expanded to Alexandria and Giza" },
  { year: "2020", event: "Launched online furniture collection" },
  { year: "2024", event: "150+ projects completed" },
];

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");

  return (
    <div className="bg-background">
      <section className="bg-card py-20 text-center lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl">{t("title")}</h1>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-serif text-2xl uppercase tracking-wide">{t("story")}</h2>
            <p className="mt-6 leading-relaxed text-muted">{t("storyText")}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
              alt="Our studio"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-card py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-12 text-center font-serif text-3xl">{t("team")}</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-border" />
                <h3 className="font-serif text-lg">{member.name}</h3>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="mb-12 text-center font-serif text-3xl">{t("timeline")}</h2>
          <div className="space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-6 border-l-2 border-accent pl-6">
                <span className="font-serif text-xl text-accent">{m.year}</span>
                <p className="text-muted">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent py-20 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="mb-12 text-center font-serif text-3xl">{t("values")}</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[t("value1"), t("value2"), t("value3")].map((value) => (
              <div key={value} className="text-center">
                <p className="text-lg">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
