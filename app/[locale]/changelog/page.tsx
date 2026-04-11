"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { changelogs } from "@/data/changelogs";
import Footer from "@/components/footer";
import SplitText from "@/components/homepage/split-text";
import { motion } from "framer-motion";
import {
    Mail,
    Sparkles,
    Users,
    MailCheck,
    Rocket,
    ChevronLeft,
    LucideProps,
    type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Mail,
    Sparkles,
    Users,
    MailCheck,
    Rocket,
};

function TimelineIcon({ name, ...props }: { name: string } & LucideProps) {
    if (name.startsWith("/") || name.includes(".")) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={name}
                alt="icon"
                width={props.size ?? 18}
                height={props.size ?? 18}
            />
        );
    }

    const Icon = iconMap[name] ?? Sparkles;
    return <Icon {...props} />;
}

function groupByYear(
    items: typeof changelogs,
): { year: string; items: typeof changelogs }[] {
    const map = new Map<string, typeof changelogs>();
    for (const item of items) {
        const year = item.date.slice(0, 4);
        if (!map.has(year)) map.set(year, []);
        map.get(year)!.push(item);
    }
    return Array.from(map.entries()).map(([year, items]) => ({ year, items }));
}

export default function Changelog() {
    const t = useTranslations("ChangelogPage");
    const locale = useLocale();
    const isZhOrJa = locale === "zh" || locale === "ja";
    const groups = groupByYear(changelogs);

    return (
        <div className="bg-subflow-900 flex min-h-screen w-full flex-col items-center">
            <div className="w-full max-w-2xl px-6 pt-8">
                <Link
                    href="/"
                    className="text-subflow-500 hover:text-subflow-300 inline-flex items-center gap-1 text-sm font-medium tracking-widest transition-colors"
                >
                    <ChevronLeft size={16} />
                    {t("back")}
                </Link>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-y-4 py-10">
                <h1 className="sr-only">{t("title")}</h1>
                <SplitText
                    text={t("title")}
                    delay={isZhOrJa ? 100 : 150}
                    duration={1}
                    splitType={isZhOrJa ? "chars" : "words"}
                    className="text-subflow-50 text-center text-2xl leading-tight font-bold tracking-widest sm:text-3xl lg:text-4xl"
                />
                <span className="text-subflow-500 px-4 text-center text-sm font-medium tracking-widest sm:text-base">
                    {t("subtitle")}
                </span>
            </div>

            <div className="w-full max-w-2xl px-6 pb-16">
                {groups.map(({ year, items }) => (
                    <div key={year} className="relative">
                        <div className="mt-2 mb-6 flex items-center gap-4">
                            <h3 className="text-subflow-200 font-mono text-lg font-bold tracking-widest">
                                {year}
                            </h3>
                            <div className="bg-subflow-700 h-px flex-1" />
                        </div>

                        {items.map((item, i) => {
                            const title =
                                item.title[locale as keyof typeof item.title] ||
                                item.title.en;
                            const content =
                                item.content[
                                    locale as keyof typeof item.content
                                ] || item.content.en;
                            const isLastItem = i === items.length - 1;

                            return (
                                <motion.div
                                    key={item.date}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: "easeOut",
                                        delay: i * 0.07,
                                    }}
                                    viewport={{ once: true, margin: "-60px" }}
                                    className="relative mb-10 flex gap-5"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-subflow-800 border-subflow-700 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                                            <TimelineIcon
                                                name={item.icon}
                                                size={item.size ?? 18}
                                                className="text-subflow-200"
                                            />
                                        </div>
                                        {!isLastItem && (
                                            <div className="bg-subflow-800 mt-2 min-h-[24px] w-px flex-1" />
                                        )}
                                    </div>

                                    <div className="pt-1 pb-2">
                                        <time className="text-subflow-500 mb-1 block text-xs font-semibold tracking-widest">
                                            {new Date(
                                                item.date,
                                            ).toLocaleDateString(locale, {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                timeZone: "UTC",
                                            })}
                                        </time>
                                        <h4 className="text-subflow-50 mb-2 text-lg font-bold tracking-wide">
                                            {title}
                                        </h4>
                                        <p className="text-subflow-400 text-sm leading-relaxed tracking-wide">
                                            {content}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <Footer />
        </div>
    );
}
