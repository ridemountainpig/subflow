import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: "https://subflow.ing/en",
            lastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/zh",
            lastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/ja",
            lastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/es",
            lastModified,
            priority: 1,
        },
        {
            url: "https://subflow.ing/en/changelog",
            lastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/zh/changelog",
            lastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/ja/changelog",
            lastModified,
            priority: 0.8,
        },
        {
            url: "https://subflow.ing/es/changelog",
            lastModified,
            priority: 0.8,
        },
    ];
}
