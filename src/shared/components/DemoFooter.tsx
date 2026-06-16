"use client";

import { SITE_NAME } from "@/lib/constants";
import { useDemoPublishedPrivacyPolicy, useDemoSocialLinks } from "@/lib/demo/hooks";
import type { PrivacyPolicy, SocialLink } from "@/lib/data/types";
import { LogoMark } from "@/shared/components/LogoMark";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export function DemoFooter({
  seedLinks,
  seedPolicy,
}: {
  seedLinks: SocialLink[];
  seedPolicy: PrivacyPolicy | null;
}) {
  const locale = useLocale();
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const enabledLinks = useDemoSocialLinks(seedLinks);
  const publishedPolicy = useDemoPublishedPrivacyPolicy(seedPolicy);

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <LogoMark className="h-4 w-4" />
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
                <Link href={`/${locale}/work`} className="hover:text-accent">
                  {nav("work")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services`} className="hover:text-accent">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="hover:text-accent">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-accent">
                  {nav("contact")}
                </Link>
              </li>
              {publishedPolicy && (
                <li>
                  <Link href={`/${locale}/privacy`} className="hover:text-accent">
                    {nav("privacy")}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-sm uppercase tracking-widest">
              {t("followUs")}
            </h3>
            {enabledLinks.length > 0 ? (
              <div className="flex flex-wrap gap-4 text-sm text-muted">
                {enabledLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">—</p>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted">
          <p>
            &copy; {new Date().getFullYear()} {SITE_NAME}. {t("rights")}
          </p>
          {publishedPolicy && (
            <p className="mt-2">
              <Link href={`/${locale}/privacy`} className="hover:text-accent">
                {nav("privacy")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
