/* eslint-disable @next/next/no-img-element */

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Minus, ArrowUpRight } from "lucide-react";
import { GitHubLight, XLight, ZeaburLight } from "@ridemountainpig/svgl-react";
import CreditCard from "@/components/homepage/credit-card";

export default function Footer() {
    const t = useTranslations("Footer");
    return (
        <footer className="bg-subflow-50 flex w-full flex-col items-center justify-center pb-6">
            <div className="bg-subflow-900 h-10 w-full rounded-b-full"></div>
            <div className="mt-10 flex w-[95%] flex-col lg:w-[90%]">
                <div className="flex flex-col items-center justify-between gap-y-6 md:flex-row">
                    <div>
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
                        <div className="text-subflow-800 mt-2 flex flex-col items-center gap-y-3 text-center text-xs font-bold tracking-widest sm:text-sm md:items-start">
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
                    <CreditCard />
                </div>
                <div className="text-subflow-900 mt-10 flex w-full flex-col items-center gap-y-4 text-xs font-bold tracking-widest md:flex-row md:justify-between lg:text-sm">
                    <div className="flex items-center">
                        <span className="text-center lg:text-left">
                            Copyright © {new Date().getFullYear()} Subflow.{" "}
                            {t("allRightsReserved")}
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-y-4 sm:flex-row">
                        <div className="flex items-center gap-x-1 lg:gap-x-2">
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
                            >
                                <XLight className="h-4 w-4" />
                            </a>
                            <a
                                href="https://github.com/ridemountainpig/subflow"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <GitHubLight className="h-4 w-4" />
                            </a>
                        </div>
                        <Minus
                            className="hidden h-6 w-6 rotate-90 sm:block"
                            strokeWidth={1.5}
                        />
                        <Link
                            href="/changelog"
                            className="flex items-center gap-x-1"
                        >
                            <span>{t("changelog")}</span>
                            <ArrowUpRight
                                size={16}
                                strokeWidth={3}
                                className="mt-0.5"
                            />
                        </Link>
                        <Minus
                            className="hidden h-6 w-6 rotate-90 sm:block"
                            strokeWidth={1.5}
                        />
                        <Link
                            href="/privacy"
                            className="flex items-center gap-x-1"
                        >
                            <span>{t("privacyPolicy")}</span>
                            <ArrowUpRight
                                size={16}
                                strokeWidth={3}
                                className="mt-0.5"
                            />
                        </Link>
                        <Minus
                            className="hidden h-6 w-6 rotate-90 sm:block"
                            strokeWidth={1.5}
                        />
                        <a
                            href="https://zeabur.com/referral?referralCode=ridemountainpig"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-x-1 pl-2 lg:gap-x-2"
                        >
                            <span className="-ml-2">
                                {t("deployedOn")} Zeabur
                            </span>
                            <ZeaburLight className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
