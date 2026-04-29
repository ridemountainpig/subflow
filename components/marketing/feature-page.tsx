"use client";

import type { ComponentType, ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import SplitText from "@/components/homepage/split-text";
import type {
    FeatureIconName,
    LocalizedFeaturePage,
} from "@/data/feature-pages";
import {
    ArrowUpRightIcon,
    CalendarSync,
    ChevronDown,
    ChevronLeft,
    Coins,
    Mail,
    PieChart,
    Sparkles,
    Users,
} from "lucide-react";

type FeaturePageViewProps = {
    feature: LocalizedFeaturePage;
    backLabel: string;
    structuredData: object;
    relatedPages: LocalizedFeaturePage[];
};

const iconMap: Record<
    FeatureIconName,
    ComponentType<{ className?: string }>
> = {
    calendar: CalendarSync,
    mail: Mail,
    users: Users,
    sparkles: Sparkles,
    "pie-chart": PieChart,
    coins: Coins,
};

const richTextClassName =
    "text-subflow-300 text-sm leading-relaxed tracking-wide sm:text-base";

const anchorPattern =
    /<a\s+href="([^"]+)"(?:\s+target="([^"]+)")?(?:\s+rel="([^"]+)")?>(.*?)<\/a>/g;

function renderRichText(text: string): ReactNode[] {
    const parts: ReactNode[] = [];
    let cursor = 0;

    for (const match of text.matchAll(anchorPattern)) {
        const [fullMatch, href, target, rel, label] = match;
        const index = match.index ?? 0;

        if (index > cursor) {
            parts.push(text.slice(cursor, index));
        }

        parts.push(
            <a
                key={`${href}-${index}`}
                href={href}
                target={target}
                rel={rel}
                aria-label={label}
                title={label}
                className="text-subflow-100 hover:text-subflow-50 underline underline-offset-4 transition-colors"
            >
                {label}
            </a>,
        );

        cursor = index + fullMatch.length;
    }

    if (cursor < text.length) {
        parts.push(text.slice(cursor));
    }

    return parts;
}

export default function FeaturePage({
    feature,
    backLabel,
    structuredData,
    relatedPages,
}: FeaturePageViewProps) {
    const locale = useLocale();
    const isZhOrJa = locale === "zh" || locale === "ja";

    return (
        <div className="bg-subflow-900 flex min-h-screen w-full flex-col items-center">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <div className="w-full max-w-2xl px-6 pt-8">
                <Link
                    href="/"
                    className="text-subflow-500 hover:text-subflow-300 inline-flex items-center gap-1 text-sm font-medium tracking-widest transition-colors"
                >
                    <ChevronLeft size={16} />
                    {backLabel}
                </Link>
            </div>

            <div className="flex w-full max-w-2xl flex-col items-center gap-y-4 px-6 py-10 text-center">
                <span className="text-subflow-500 text-xs font-semibold tracking-[0.32em] uppercase">
                    {feature.navTitle}
                </span>
                <h1 className="sr-only">{feature.title}</h1>
                <SplitText
                    text={feature.title}
                    delay={80}
                    duration={1}
                    splitType={isZhOrJa ? "chars" : "words"}
                    className="text-subflow-50 text-center text-2xl leading-tight font-bold tracking-widest sm:text-3xl lg:text-4xl"
                />
                <p className="text-subflow-300 text-sm leading-relaxed tracking-wide sm:text-base">
                    {feature.description}
                </p>
                <p className="text-subflow-500 text-sm leading-relaxed tracking-wide">
                    {feature.intro}
                </p>
            </div>

            <div className="w-full max-w-2xl px-6 pb-10">
                <div className="bg-subflow-800 border-subflow-700 overflow-hidden rounded-3xl border shadow-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={feature.heroImage}
                        alt={feature.heroImageAlt}
                        className="block h-auto w-full"
                    />
                </div>
            </div>

            <div className="w-full max-w-2xl px-6 pb-16">
                {feature.sections.map((section, index) => {
                    const Icon = iconMap[section.icon];
                    const isLastItem =
                        index === feature.sections.length - 1 &&
                        feature.steps.length === 0;

                    return (
                        <motion.section
                            key={section.title}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                delay: index * 0.06,
                            }}
                            viewport={{ once: true, margin: "-60px" }}
                            className="relative mb-10 flex gap-5"
                        >
                            <div className="flex flex-col items-center">
                                <div className="bg-subflow-800 border-subflow-700 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                                    <Icon className="text-subflow-200 h-[18px] w-[18px]" />
                                </div>
                                {!isLastItem && (
                                    <div className="bg-subflow-800 mt-2 min-h-[24px] w-px flex-1" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1 pt-1 pb-2">
                                <span className="text-subflow-500 mb-1 block text-xs font-semibold tracking-[0.24em] uppercase">
                                    {`0${index + 1}`}
                                </span>
                                <h2 className="text-subflow-50 mb-3 text-xl font-bold tracking-wide sm:text-2xl">
                                    {section.title}
                                </h2>
                                <p className="text-subflow-300 mb-4 text-sm leading-relaxed tracking-wide sm:text-base">
                                    {section.description}
                                </p>

                                {section.note && (
                                    <div className="bg-subflow-800 border-subflow-700 text-subflow-200 mb-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed tracking-wide">
                                        {section.note}
                                    </div>
                                )}

                                {section.images && section.images.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        {section.images.map((img, i) => (
                                            <div
                                                key={img}
                                                className="bg-subflow-800 border-subflow-700 overflow-hidden rounded-2xl border shadow-xl"
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={img}
                                                    alt={
                                                        section.imageAlts?.[
                                                            i
                                                        ] || section.title
                                                    }
                                                    className="block h-auto w-full"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    section.image && (
                                        <div className="bg-subflow-800 border-subflow-700 overflow-hidden rounded-2xl border shadow-xl">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={section.image}
                                                alt={
                                                    section.imageAlt ||
                                                    section.title
                                                }
                                                className="block h-auto w-full"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.section>
                    );
                })}

                {feature.steps.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-60px" }}
                        className="mb-10"
                    >
                        <div className="pt-1">
                            <h2 className="text-subflow-50 mb-4 text-xl font-bold tracking-wide sm:text-2xl">
                                {feature.stepsTitle}
                            </h2>

                            <div className="bg-subflow-800 border-subflow-700 rounded-3xl border p-5 sm:p-6">
                                <ol className="space-y-4">
                                    {feature.steps.map((step, index) => (
                                        <li
                                            key={step}
                                            className="flex items-start gap-4"
                                        >
                                            <span className="bg-subflow-900 border-subflow-700 text-subflow-200 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tracking-wide">
                                                {index + 1}
                                            </span>
                                            <p
                                                className={`${richTextClassName} pt-1`}
                                            >
                                                {renderRichText(step)}
                                            </p>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </motion.section>
                )}

                {feature.faqs.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-60px" }}
                        className="mb-10"
                    >
                        <div className="pt-1">
                            <h2 className="text-subflow-50 mb-4 text-xl font-bold tracking-wide sm:text-2xl">
                                FAQ
                            </h2>
                            <div className="space-y-3">
                                {feature.faqs.map((faq) => (
                                    <details
                                        key={faq.question}
                                        className="bg-subflow-800 border-subflow-700 group rounded-2xl border"
                                    >
                                        <summary className="text-subflow-50 flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold tracking-wide select-none">
                                            {faq.question}
                                            <ChevronDown className="text-subflow-500 ml-3 h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
                                        </summary>
                                        <p
                                            className={`${richTextClassName} border-subflow-700 border-t px-4 py-3`}
                                        >
                                            {renderRichText(faq.answer)}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </motion.section>
                )}

                <div className="mt-8 flex justify-center">
                    <Link
                        href={feature.ctaHref}
                        className="bg-subflow-50 text-subflow-900 hover:bg-subflow-200 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors"
                    >
                        {feature.ctaLabel}
                    </Link>
                </div>

                {relatedPages.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        viewport={{ once: true, margin: "-60px" }}
                        className="mt-10"
                    >
                        <h2 className="text-subflow-500 mb-4 text-xs font-semibold tracking-[0.24em] uppercase">
                            {feature.relatedTitle}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {relatedPages.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/${related.slug}`}
                                    className="bg-subflow-800 border-subflow-700 hover:border-subflow-500 group flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors"
                                >
                                    <div>
                                        <p className="text-subflow-50 text-sm font-semibold tracking-wide">
                                            {related.navTitle}
                                        </p>
                                        <p className="text-subflow-500 mt-0.5 line-clamp-1 text-xs leading-relaxed tracking-wide">
                                            {related.description}
                                        </p>
                                    </div>
                                    <ArrowUpRightIcon className="text-subflow-500 group-hover:text-subflow-300 ml-3 h-4 w-4 shrink-0 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </motion.section>
                )}
            </div>
        </div>
    );
}
