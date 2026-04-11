/* eslint-disable @next/next/no-img-element */

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { GitHubLight, XLight, ZeaburLight } from "@ridemountainpig/svgl-react";
import { getFeaturePages } from "@/data/feature-pages";
import type { AppLocale } from "@/lib/seo";

export default function Footer() {
    const t = useTranslations("Footer");
    const locale = useLocale() as AppLocale;
    const featurePages = getFeaturePages(locale);

    return (
        <footer className="bg-subflow-50 flex w-full flex-col items-center justify-center pb-6">
            <div className="bg-subflow-900 h-10 w-full rounded-b-full"></div>
            <div className="mt-10 flex w-[95%] flex-col lg:w-[90%]">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
                    <div className="flex flex-col gap-7">
                        <div className="-ml-3 flex items-center justify-center gap-x-2 md:justify-start">
                            <img
                                src="/subflow-light.svg"
                                alt="Subflow"
                                className="h-14 w-14"
                            />
                            <span className="text-subflow-900 text-3xl font-bold tracking-widest">
                                Subflow
                            </span>
                        </div>

                        <div className="text-subflow-800 flex flex-col items-center gap-y-3 text-center text-xs font-bold tracking-widest sm:text-sm md:items-start">
                            <span>{t("subtitle")}</span>
                            <span>{t("freeForeverAndSupport")}</span>
                            <a
                                href="https://www.buymeacoffee.com/yencheng"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                                    alt="Buy Me A Coffee"
                                    className="w-40 md:w-50"
                                />
                            </a>
                        </div>
                    </div>
                    <div className="grid gap-8 pt-2 sm:grid-cols-2 sm:gap-8 lg:gap-10">
                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h3 className="text-subflow-800 text-sm font-bold tracking-[0.22em] uppercase">
                                {t("featureGuides")}
                            </h3>
                            <div className="bg-subflow-800/15 mt-3 h-px w-14 rounded-full md:w-16" />
                            <div className="mt-4 flex flex-col items-center gap-3 md:items-start lg:gap-3.5">
                                {featurePages.map((page) => (
                                    <Link
                                        key={page.slug}
                                        href={`/${page.slug}`}
                                        className="text-subflow-800 hover:text-subflow-950 inline-flex w-fit items-center gap-2 py-1 text-sm font-semibold tracking-wide transition-colors"
                                    >
                                        <span>{page.navTitle}</span>
                                        <ArrowUpRight
                                            size={16}
                                            strokeWidth={2.4}
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h3 className="text-subflow-800 text-sm font-bold tracking-[0.22em] uppercase">
                                {t("resources")}
                            </h3>
                            <div className="bg-subflow-800/15 mt-3 h-px w-14 rounded-full md:w-16" />
                            <div className="mt-4 flex flex-col items-center gap-3 text-sm font-semibold tracking-wide md:items-start lg:gap-3.5">
                                <Link
                                    href="/changelog"
                                    className="text-subflow-800 hover:text-subflow-950 inline-flex w-fit items-center gap-2 py-1 transition-colors"
                                >
                                    <span>{t("changelog")}</span>
                                    <ArrowUpRight size={16} strokeWidth={2.4} />
                                </Link>
                                <Link
                                    href="/privacy"
                                    className="text-subflow-800 hover:text-subflow-950 inline-flex w-fit items-center gap-2 py-1 transition-colors"
                                >
                                    <span>{t("privacyPolicy")}</span>
                                    <ArrowUpRight size={16} strokeWidth={2.4} />
                                </Link>
                                <a
                                    href="https://github.com/ridemountainpig/subflow"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-subflow-800 hover:text-subflow-950 inline-flex w-fit items-center gap-2 py-1 transition-colors"
                                >
                                    <span>GitHub</span>
                                    <GitHubLight className="h-4 w-4" />
                                </a>
                                <a
                                    href="https://zeabur.com/referral?referralCode=ridemountainpig"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-subflow-800 hover:text-subflow-950 inline-flex w-fit items-center gap-2 py-1 transition-colors"
                                >
                                    <span>{t("deployedOn")} Zeabur</span>
                                    <ZeaburLight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-subflow-900 mt-10 flex w-full flex-col gap-4 border-t border-black/10 pt-6 text-xs font-bold tracking-widest md:flex-row md:items-center md:justify-between lg:text-sm">
                    <span className="text-center md:text-left">
                        Copyright © {new Date().getFullYear()} Subflow.{" "}
                        {t("allRightsReserved")}
                    </span>
                    <div className="flex items-center justify-center gap-3 md:justify-end">
                        <span>
                            {t("createdBy")}{" "}
                            <a
                                href="https://github.com/ridemountainpig"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Ridemountainpig
                            </a>
                        </span>
                        <a
                            href="https://x.com/ridemountainpig"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-subflow-800 hover:text-subflow-950 transition-colors"
                        >
                            <XLight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
