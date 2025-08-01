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
    ];
}
