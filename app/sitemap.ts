import { MetadataRoute } from "next";
import { changelogs } from "@/data/changelogs";
import { featurePageSlugs, featurePageUpdatedAt } from "@/data/feature-pages";
import {
    SUPPORTED_LOCALES,
    getLanguageAlternates,
    getLocalizedUrl,
} from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
    const latestChangelogDate =
        changelogs.reduce(
            (latestDate, item) =>
                item.date > latestDate ? item.date : latestDate,
            changelogs[0]?.date ?? new Date().toISOString().slice(0, 10),
        ) || new Date().toISOString().slice(0, 10);
    const productLastModified = new Date(
        `${latestChangelogDate}T00:00:00.000Z`,
    );
    const privacyLastModified = new Date("2026-01-01T00:00:00.000Z");

    const homeEntries: SitemapEntry[] = SUPPORTED_LOCALES.map((locale) => ({
        url: getLocalizedUrl(locale),
        lastModified: productLastModified,
        changeFrequency: "weekly",
        priority: 1,
        alternates: { languages: getLanguageAlternates() },
    }));

    const privacyEntries: SitemapEntry[] = SUPPORTED_LOCALES.map((locale) => ({
        url: getLocalizedUrl(locale, "/privacy"),
        lastModified: privacyLastModified,
        changeFrequency: "yearly",
        priority: 0.4,
        alternates: { languages: getLanguageAlternates("/privacy") },
    }));

    const changelogEntries: SitemapEntry[] = SUPPORTED_LOCALES.map(
        (locale) => ({
            url: getLocalizedUrl(locale, "/changelog"),
            lastModified: productLastModified,
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: { languages: getLanguageAlternates("/changelog") },
        }),
    );

    const featureEntries: SitemapEntry[] = featurePageSlugs.flatMap((slug) =>
        SUPPORTED_LOCALES.map((locale) => ({
            url: getLocalizedUrl(locale, `/${slug}`),
            lastModified: new Date(
                `${featurePageUpdatedAt[slug]}T00:00:00.000Z`,
            ),
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: { languages: getLanguageAlternates(`/${slug}`) },
        })),
    );

    return [
        ...homeEntries,
        ...changelogEntries,
        ...featureEntries,
        ...privacyEntries,
    ];
}
