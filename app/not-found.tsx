/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/footer";
import { ArrowRightIcon } from "lucide-react";
import SplitText from "@/components/homepage/split-text";

export default function NotFound() {
    const t = useTranslations("NotFoundPage");

    return (
        <>
            <div className="bg-subflow-900 flex h-[calc(100vh-7.25rem)] flex-col items-center justify-center gap-y-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-subflow-800 flex h-22 w-22 items-center justify-center rounded-2xl"
                >
                    <img
                        src="/subflow-dark.svg"
                        alt="Subflow"
                        className="h-20 w-20"
                    />
                </motion.div>
                <SplitText
                    text={t("title")}
                    delay={50}
                    duration={1}
                    splitType="words"
                    className="text-subflow-50 text-center text-[55px] leading-tight font-bold tracking-widest"
                />
                <SplitText
                    text={t("description")}
                    delay={50}
                    duration={1}
                    splitType="words"
                    className="text-subflow-500 text-center text-lg font-bold tracking-widest"
                />
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Link
                        href="/"
                        className="border-subflow-50/70 hover:bg-subflow-50 group text-subflow-50 flex cursor-pointer items-center gap-x-2 rounded-xl border-2 p-2 px-3 duration-300"
                    >
                        <span className="group-hover:text-subflow-900 text-base font-bold tracking-widest">
                            {t("back")}
                        </span>
                        <div className="bg-subflow-50/40 group-hover:bg-subflow-400 flex items-center justify-center rounded-full p-1">
                            <ArrowRightIcon strokeWidth={3.5} size={18} />
                        </div>
                    </Link>
                </motion.div>
            </div>
            <Footer />
        </>
    );
}
