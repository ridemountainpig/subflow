"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const NEW_FEATURE_NOTIFY_CONTENT = {
    zh: process.env.NEXT_PUBLIC_NEW_FEATURE_NOTIFY_CONTENT_ZH,
    en: process.env.NEXT_PUBLIC_NEW_FEATURE_NOTIFY_CONTENT_EN,
    ja: process.env.NEXT_PUBLIC_NEW_FEATURE_NOTIFY_CONTENT_JA,
} as const;

export default function NewFeatureNotify() {
    const locale = useLocale();
    const [isVisible, setIsVisible] = useState(true);
    const newFeatureNotifyContent =
        NEW_FEATURE_NOTIFY_CONTENT[
            locale as keyof typeof NEW_FEATURE_NOTIFY_CONTENT
        ] ??
        NEW_FEATURE_NOTIFY_CONTENT.en ??
        "";

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    if (!newFeatureNotifyContent) {
        return null;
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="absolute top-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="border-subflow-50/70 text-subflow-900 bg-subflow-50 flex items-center gap-x-2 rounded-full border-2 px-3 py-1">
                        <div className="flex items-center justify-center rounded-full p-0.5 sm:p-1">
                            <Sparkles strokeWidth={2.5} size={16} />
                        </div>
                        <span className="text-xs font-bold tracking-widest sm:text-sm">
                            {newFeatureNotifyContent}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
