import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "zh"],
    defaultLocale: "en",
    localeCookie: {
        name: "subflow-locale",
        maxAge: 60 * 60 * 24 * 30,
    },
});
