import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { createLocalizedMetadata, type AppLocale } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    const t = await getTranslations("LoginPage");

    return createLocalizedMetadata({
        locale,
        pathname: "/login",
        title: `${t("title")} | Subflow`,
        description: t("secure"),
        noIndex: true,
    });
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
