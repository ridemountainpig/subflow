import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { createLocalizedMetadata, type AppLocale } from "@/lib/seo";

const CHANGELOG_DESCRIPTIONS: Record<AppLocale, string> = {
    en: "Latest Subflow product updates — analytics, Raycast extension, Smart Add, shared subscriptions, email reminders, and more. See what is new in subscription tracking and recurring payment management.",
    zh: "Subflow 最新產品更新——訂閱分析、Raycast 擴充功能、智慧新增、共享訂閱、電子郵件提醒等等。看看訂閱追蹤與定期付款管理有什麼新功能。",
    ja: "Subflow の最新の製品アップデート — サブスク分析、Raycast 拡張機能、スマート追加、共有サブスク、メール通知などの新機能をまとめてチェックできます。",
    es: "Últimas novedades de Subflow: análisis de suscripciones, extensión para Raycast, Smart Add, suscripciones compartidas, recordatorios por correo y más. Descubre qué hay de nuevo en el seguimiento de suscripciones y la gestión de pagos recurrentes.",
};

const CHANGELOG_KEYWORDS: Record<AppLocale, string[]> = {
    en: [
        "Subflow changelog",
        "subscription tracker updates",
        "subscription analytics changelog",
        "recurring payment app release notes",
    ],
    zh: [
        "Subflow 更新日誌",
        "訂閱追蹤更新",
        "訂閱分析更新",
        "定期付款管理更新",
    ],
    ja: [
        "Subflow 更新履歴",
        "サブスク追跡アップデート",
        "サブスク分析リリースノート",
        "定期支払いアプリ更新",
    ],
    es: [
        "Subflow novedades",
        "actualizaciones del rastreador de suscripciones",
        "notas de versión de pagos recurrentes",
        "novedades de análisis de suscripciones",
    ],
};

export async function generateMetadata(): Promise<Metadata> {
    const locale = (await getLocale()) as AppLocale;
    const t = await getTranslations("ChangelogPage");

    const title = `${t("title")} | Subflow`;

    return createLocalizedMetadata({
        locale,
        pathname: "/changelog",
        title,
        description: CHANGELOG_DESCRIPTIONS[locale],
        keywords: CHANGELOG_KEYWORDS[locale],
    });
}

export default function ChangelogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
