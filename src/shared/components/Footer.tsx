import { SITE_NAME } from "@/lib/constants";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-block h-4 w-4 border-2 border-foreground" />
              <span className="font-serif text-lg font-semibold tracking-[0.15em] uppercase">
                {SITE_NAME}
              </span>
            </div>
            <p className="text-sm text-muted">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm uppercase tracking-widest">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/en/work" className="hover:text-accent">
                  {nav("work")}
                </Link>
              </li>
              <li>
                <Link href="/en/services" className="hover:text-accent">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href="/en/about" className="hover:text-accent">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/en/contact" className="hover:text-accent">
                  {nav("contact")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm uppercase tracking-widest">
              {t("followUs")}
            </h3>
            <div className="flex gap-4 text-sm text-muted">
              <a href="#" className="hover:text-accent">Instagram</a>
              <a href="#" className="hover:text-accent">Pinterest</a>
              <a href="#" className="hover:text-accent">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} {SITE_NAME}. {t("rights")}
        </div>
      </div>
    </footer>
  );
}
