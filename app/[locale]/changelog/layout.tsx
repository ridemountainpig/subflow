import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("ChangelogPage");

    const title = `${t("title")} | Subflow`;
    const description = t("subtitle");

    return {
        title,
        description,
    };
}

export default function ChangelogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
