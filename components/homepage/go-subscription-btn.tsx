"use client";

import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

export default function GoSubscriptionBtn() {
    const { userId } = useAuth();
    const t = useTranslations("HomePage");
    const isLoggedIn = !!userId;

    return (
        isLoggedIn && (
            <motion.div
                className="absolute top-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    href="/subscription"
                    className="border-subflow-50/70 hover:bg-subflow-50 group text-subflow-50 flex cursor-pointer items-center gap-x-2 rounded-full border-2 p-1 px-3 duration-300"
                >
                    <span className="group-hover:text-subflow-900 text-xs font-bold tracking-widest sm:text-sm">
                        {t("manageSubscriptions")}
                    </span>
                    <div className="bg-subflow-50/40 group-hover:bg-subflow-400 flex items-center justify-center rounded-full p-0.5 sm:p-1">
                        <ArrowRightIcon strokeWidth={3.5} size={16} />
                    </div>
                </Link>
            </motion.div>
        )
    );
}
