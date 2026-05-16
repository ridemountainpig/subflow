import { MetadataRoute } from "next";
import { changelogs } from "@/data/changelogs";
import { featurePageSlugs, featurePageUpdatedAt } from "@/data/feature-pages";
import { SITE_ORIGIN, SUPPORTED_LOCALES } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

function buildAlternates(pathname = "") {
    const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const path = normalized === "/" ? "" : normalized;
    const languages = Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
            locale,
            `${SITE_ORIGIN}/${locale}${path}`,
        ]),
    );
    return {
        ...languages,
        "x-default": `${SITE_ORIGIN}/en${path}`,
    };
}

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
        url: `${SITE_ORIGIN}/${locale}`,
        lastModified: productLastModified,
        changeFrequency: "weekly",
        priority: 1,
        alternates: { languages: buildAlternates("") },
    }));

    const privacyEntries: SitemapEntry[] = SUPPORTED_LOCALES.map((locale) => ({
        url: `${SITE_ORIGIN}/${locale}/privacy`,
        lastModified: privacyLastModified,
        changeFrequency: "yearly",
        priority: 0.4,
        alternates: { languages: buildAlternates("/privacy") },
    }));

    const changelogEntries: SitemapEntry[] = SUPPORTED_LOCALES.map(
        (locale) => ({
            url: `${SITE_ORIGIN}/${locale}/changelog`,
            lastModified: productLastModified,
            changeFrequency: "weekly",
            priority: 0.8,
            alternates: { languages: buildAlternates("/changelog") },
        }),
    );

    const featureEntries: SitemapEntry[] = featurePageSlugs.flatMap((slug) =>
        SUPPORTED_LOCALES.map((locale) => ({
            url: `${SITE_ORIGIN}/${locale}/${slug}`,
            lastModified: new Date(
                `${featurePageUpdatedAt[slug]}T00:00:00.000Z`,
            ),
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: { languages: buildAlternates(`/${slug}`) },
        })),
    );

    return [
        ...homeEntries,
        ...changelogEntries,
        ...featureEntries,
        ...privacyEntries,
    ];
}
