import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/_next/",
                    "/en/login",
                    "/zh/login",
                    "/ja/login",
                    "/en/subscription",
                    "/zh/subscription",
                    "/ja/subscription",
                ],
            },
        ],
        sitemap: "https://www.subflow.ing/sitemap.xml",
    };
}
