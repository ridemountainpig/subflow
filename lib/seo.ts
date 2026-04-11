import type { Metadata } from "next";

export const SITE_ORIGIN = "https://subflow.ing";
export const SITE_URL = new URL(SITE_ORIGIN);
export const SUPPORTED_LOCALES = ["en", "zh", "ja", "es"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: AppLocale = "en";

const OPEN_GRAPH_LOCALES: Record<AppLocale, string> = {
    en: "en_US",
    zh: "zh_TW",
    ja: "ja_JP",
    es: "es_ES",
};

const DEFAULT_OG_IMAGE_ALT: Record<AppLocale, string> = {
    en: "Subflow Open Graph image",
    zh: "Subflow 開放圖像",
    ja: "Subflow OG画像",
    es: "Imagen Open Graph de Subflow",
};

const HOME_SEO_COPY: Record<
    AppLocale,
    { title: string; description: string; keywords: string[] }
> = {
    en: {
        title: "Subflow | Subscription Tracker & Recurring Payment Manager",
        description:
            "Track subscriptions, recurring payments, and monthly spending with Subflow. Stay on top of bills, reminders, and shared subscriptions in one place.",
        keywords: [
            "subscription tracker",
            "subscription management app",
            "recurring payment tracker",
            "monthly subscription manager",
            "subscription expense tracker",
            "bill reminder app",
            "shared subscription manager",
        ],
    },
    zh: {
        title: "Subflow 訂閱管理工具 | 追蹤定期付款與訂閱支出",
        description:
            "使用 Subflow 追蹤訂閱、定期付款與每月支出，集中管理提醒、共享訂閱與各種訂閱費用。",
        keywords: [
            "訂閱管理工具",
            "訂閱追蹤",
            "定期付款管理",
            "每月支出追蹤",
            "訂閱支出管理",
            "帳單提醒",
            "共享訂閱管理",
        ],
    },
    ja: {
        title: "Subflow サブスク管理ツール | 定期支払いと支出を追跡",
        description:
            "Subflow でサブスク、定期支払い、毎月の支出をまとめて管理。請求の見逃し防止、リマインド、共有サブスク管理を一か所で行えます。",
        keywords: [
            "サブスク管理",
            "サブスク追跡",
            "定期支払い管理",
            "月額支出管理",
            "サブスク家計簿",
            "請求リマインダー",
            "共有サブスク管理",
        ],
    },
    es: {
        title: "Subflow | Gestor de Suscripciones y Pagos Recurrentes",
        description:
            "Controla suscripciones, pagos recurrentes y gastos mensuales con Subflow. Organiza recordatorios, cargos y suscripciones compartidas desde un solo lugar.",
        keywords: [
            "gestor de suscripciones",
            "rastreador de suscripciones",
            "pagos recurrentes",
            "control de gastos mensuales",
            "recordatorios de facturas",
            "suscripciones compartidas",
            "app de suscripciones",
        ],
    },
};

const PRIVACY_DESCRIPTIONS: Record<AppLocale, string> = {
    en: "Learn how Subflow collects, uses, and protects personal data across the subscription management service.",
    zh: "了解 Subflow 如何蒐集、使用與保護您在訂閱管理服務中的個人資料。",
    ja: "Subflow のサブスク管理サービスで、個人情報をどのように収集・利用・保護するかをご確認ください。",
    es: "Conoce cómo Subflow recopila, utiliza y protege los datos personales dentro de su servicio de gestión de suscripciones.",
};

function normalizePath(pathname = "") {
    if (!pathname) return "";
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocalizedUrl(locale: AppLocale, pathname = "") {
    const normalizedPath = normalizePath(pathname);
    return `${SITE_ORIGIN}/${locale}${normalizedPath}`;
}

export function getLanguageAlternates(pathname = "") {
    const languages = Object.fromEntries(
        SUPPORTED_LOCALES.map((locale) => [
            locale,
            getLocalizedUrl(locale, pathname),
        ]),
    );

    return {
        ...languages,
        "x-default": getLocalizedUrl(DEFAULT_LOCALE, pathname),
    };
}

export function getLocalizedOgImage(locale: AppLocale) {
    return `${SITE_ORIGIN}/og-images/subflow-${locale}-og.png`;
}

type LocalizedMetadataInput = {
    locale: AppLocale;
    pathname?: string;
    title: string;
    description: string;
    keywords?: string[];
    noIndex?: boolean;
    ogImageUrl?: string;
    ogImageAlt?: string;
};

export function createLocalizedMetadata({
    locale,
    pathname = "",
    title,
    description,
    keywords,
    noIndex = false,
    ogImageUrl = getLocalizedOgImage(locale),
    ogImageAlt = DEFAULT_OG_IMAGE_ALT[locale],
}: LocalizedMetadataInput): Metadata {
    const url = getLocalizedUrl(locale, pathname);

    return {
        metadataBase: SITE_URL,
        title,
        description,
        keywords,
        alternates: {
            canonical: url,
            languages: getLanguageAlternates(pathname),
        },
        openGraph: {
            type: "website",
            url,
            siteName: "Subflow",
            locale: OPEN_GRAPH_LOCALES[locale],
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: ogImageAlt,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            creator: "@ridemountainpig",
            title,
            description,
            images: [ogImageUrl],
        },
        robots: noIndex
            ? {
                  index: false,
                  follow: false,
                  googleBot: {
                      index: false,
                      follow: false,
                  },
              }
            : undefined,
    };
}

export function getHomeMetadata(locale: AppLocale) {
    return createLocalizedMetadata({
        locale,
        title: HOME_SEO_COPY[locale].title,
        description: HOME_SEO_COPY[locale].description,
        keywords: HOME_SEO_COPY[locale].keywords,
    });
}

export function getPrivacyMetadata(locale: AppLocale) {
    const title =
        locale === "zh"
            ? "Subflow 隱私權政策"
            : locale === "ja"
              ? "Subflow プライバシーポリシー"
              : locale === "es"
                ? "Política de Privacidad de Subflow"
                : "Subflow Privacy Policy";

    return createLocalizedMetadata({
        locale,
        pathname: "/privacy",
        title,
        description: PRIVACY_DESCRIPTIONS[locale],
    });
}

export function getHomeStructuredData(locale: AppLocale) {
    const homeUrl = getLocalizedUrl(locale);
    const { title, description } = HOME_SEO_COPY[locale];

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_ORIGIN}#organization`,
                name: "Subflow",
                url: SITE_ORIGIN,
                logo: `${SITE_ORIGIN}/manifest-images/subflow-icon-512x512.png`,
                sameAs: [
                    "https://github.com/ridemountainpig/subflow",
                    "https://x.com/ridemountainpig",
                ],
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_ORIGIN}#website`,
                name: "Subflow",
                url: SITE_ORIGIN,
                inLanguage: locale,
            },
            {
                "@type": "SoftwareApplication",
                name: "Subflow",
                applicationCategory: "FinanceApplication",
                operatingSystem: "Web",
                url: homeUrl,
                image: getLocalizedOgImage(locale),
                description,
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                publisher: {
                    "@id": `${SITE_ORIGIN}#organization`,
                },
                inLanguage: locale,
                alternateName: title,
            },
        ],
    };
}
