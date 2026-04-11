import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { createLocalizedMetadata, type AppLocale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    const t = await getTranslations("SmartAddPage");

    return createLocalizedMetadata({
        locale,
        pathname: "/smart-add",
        title: `${t("title")} | Subflow`,
        description: t("subtitle"),
        noIndex: true,
    });
}

export default function SmartAddLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
