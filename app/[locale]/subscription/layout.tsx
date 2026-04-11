import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { createLocalizedMetadata, type AppLocale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    const t = await getTranslations("SubscriptionPage");

    return createLocalizedMetadata({
        locale,
        pathname: "/subscription",
        title: `${t("subscriptionList")} | Subflow`,
        description: t("subscriptionListDescription"),
        noIndex: true,
    });
}

export default function SubscriptionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
