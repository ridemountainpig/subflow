/* eslint-disable @next/next/no-img-element */

import { useTranslations } from "next-intl";
import { Minus } from "lucide-react";
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
                        <span>
                            Copyright © {new Date().getFullYear()} Subflow. All
                            rights reserved.
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-x-1 gap-y-4 sm:flex-row lg:gap-x-2">
                        <div className="flex items-center gap-x-1 lg:gap-x-2">
                            <span>
                                Created by{" "}
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
                            className="-ml-2 hidden h-6 w-6 rotate-90 sm:block"
                            strokeWidth={1.5}
                        />
                        <div className="flex items-center gap-x-1 lg:gap-x-2">
                            <span className="-ml-2">Deployed on Zeabur</span>
                            <a
                                href="https://zeabur.com/referral?referralCode=ridemountainpig"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ZeaburLight className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
