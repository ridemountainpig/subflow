import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        {
            url: "https://www.subflow.ing/en",
            lastModified,
            priority: 1,
        },
        {
            url: "https://www.subflow.ing/zh",
            lastModified,
            priority: 1,
        },
    ];
}
