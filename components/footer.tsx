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
            <div className="mt-10 flex w-[85%] flex-col">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="-ml-3 flex items-center gap-x-2">
                            <img
                                src="/subflow-light.svg"
                                alt="Subflow"
                                className="h-14 w-14"
                            />
                            <span className="text-subflow-900 text-3xl font-bold tracking-widest">
                                Subflow
                            </span>
                        </div>
                        <span className="text-subflow-800 mt-2 text-sm font-bold tracking-widest">
                            {t("subtitle")}
                        </span>
                    </div>
                    <CreditCard />
                </div>
                <div className="mt-10 flex w-full justify-between">
                    <span className="text-subflow-900 text-sm font-bold tracking-widest">
                        Copyright © {new Date().getFullYear()} Subflow. All
                        rights reserved.
                    </span>
                    <div className="flex items-center gap-x-2">
                        <span className="text-subflow-900 text-sm font-bold tracking-widest">
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
                        <Minus
                            className="text-subflow-900 -ml-2 h-6 w-6 rotate-90"
                            strokeWidth={1.5}
                        />
                        <span className="text-subflow-900 -ml-2 text-sm font-bold tracking-widest">
                            Deployed on Zeabur
                        </span>
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
        </footer>
    );
}
