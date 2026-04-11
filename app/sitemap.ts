import { MetadataRoute } from "next";
import { changelogs } from "@/data/changelogs";
import { featurePageSlugs, featurePageUpdatedAt } from "@/data/feature-pages";

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

    const featureUrls = featurePageSlugs.flatMap((slug) =>
        ["en", "zh", "ja", "es"].map((locale) => ({
            url: `https://subflow.ing/${locale}/${slug}`,
            lastModified: new Date(
                `${featurePageUpdatedAt[slug]}T00:00:00.000Z`,
            ),
            priority: 0.7,
        })),
    );

    return [
        {
            url: "https://subflow.ing/en",
            lastModified: productLastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/zh",
            lastModified: productLastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/ja",
            lastModified: productLastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/es",
            lastModified: productLastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/en/privacy",
            priority: 0.4,
        },
        {
            url: "https://subflow.ing/zh/privacy",
            priority: 0.4,
        },
        {
            url: "https://subflow.ing/ja/privacy",
            priority: 0.4,
        },
        {
            url: "https://subflow.ing/es/privacy",
            priority: 0.4,
        },
        {
            url: "https://subflow.ing/en/changelog",
            lastModified: productLastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/zh/changelog",
            lastModified: productLastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/ja/changelog",
            lastModified: productLastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/es/changelog",
            lastModified: productLastModified,
            priority: 0.8,
        },
        ...featureUrls,
    ];
}
