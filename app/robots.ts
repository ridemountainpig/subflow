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
                    "/login",
                    "/en/login",
                    "/zh/login",
                    "/ja/login",
                    "/es/login",
                    "/subscription",
                    "/en/subscription",
                    "/zh/subscription",
                    "/ja/subscription",
                    "/es/subscription",
                    "/smart-add",
                    "/en/smart-add",
                    "/zh/smart-add",
                    "/ja/smart-add",
                    "/es/smart-add",
                ],
            },
        ],
        sitemap: "https://subflow.ing/sitemap.xml",
    };
}
