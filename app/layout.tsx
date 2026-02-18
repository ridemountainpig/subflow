import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ClerkProvider } from "@clerk/nextjs";
import { zhTW, enUS, jaJP, esES } from "@clerk/localizations";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import { PreferencesProvider } from "@/app/contexts/PreferencesContext";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();

    let title: string;
    let description: string;
    let keywords: string;
    let ogImageUrl: string;
    let ogImageAlt: string;

    switch (locale) {
        case "zh":
            title = "Subflow 訂閱管理";
            description =
                "輕鬆管理訂閱支出。使用 Subflow 追蹤花費、整理定期付款，全面掌控您的訂閱生活。";
            keywords =
                "訂閱管理, 訂閱管理工具, 訂閱管理軟體, 訂閱管理應用, 管理定期付款, 訂閱追蹤, 訂閱支出追蹤, 每月訂閱整理, 個人訂閱追蹤器, 訂閱可視化工具, 數位訂閱管理, 定期扣款管理";
            ogImageUrl = "https://subflow.ing/og-images/subflow-zh-og.png";
            ogImageAlt = "Subflow 開放圖像";
            break;
        case "ja":
            title = "Subflow サブスク管理";
            description =
                "サブスクを簡単に管理・把握。Subflow で支出を追跡・整理し、サブスクリプション管理を完全にコントロールしましょう。";
            keywords =
                "サブスク管理, サブスクリプション管理, サブスク管理ツール, サブスク管理アプリ, 定期支払い管理, サブスク追跡, サブスク支出追跡, 月額サブスク整理, 個人サブスク追跡, サブスク可視化ツール, デジタルサブスク管理, 定期課金管理";
            ogImageUrl = "https://subflow.ing/og-images/subflow-ja-og.png";
            ogImageAlt = "Subflow OG画像";
            break;
        case "es":
            title = "Subflow Gestión de Suscripciones";
            description =
                "Gestiona fácilmente tus suscripciones con Subflow. Rastrea gastos, organiza pagos recurrentes y toma el control de tu gestión de suscripciones.";
            keywords =
                "Gestión de Suscripciones, Herramienta de Gestión de Suscripciones, Software de Gestión de Suscripciones, Aplicación de Gestión de Suscripciones, Servicio de Gestión de Suscripciones, Plataforma de Gestión de Suscripciones, Sistema de Gestión de Suscripciones, Solución de Gestión de Suscripciones, Rastrear Gastos de Suscripción, Gestionar Pagos Recurrentes, Organizar Suscripciones Mensuales, Rastreador de Suscripciones para Individuos, Visualizar Flujo de Suscripciones, Monitorear Suscripciones Digitales";
            ogImageUrl = "https://subflow.ing/og-images/subflow-en-og.png";
            ogImageAlt = "Subflow OG Image";
            break;
        default:
            title = "Subflow";
            description =
                "Easily flow through your subscriptions with Subflow. Track spending, organize recurring payments, and take control of your subscription management.";
            keywords =
                "Subscription Management, Subscription Management Tool, Subscription Management Software, Subscription Management App, Subscription Management Service, Subscription Management Platform, Subscription Management System, Subscription Management Solution, Track Subscription Spending, Manage Recurring Payments, Organize Monthly Subscriptions, Subscription Tracker for Individuals, Visualize Subscription Flow, Monitor Digital Subscriptions";
            ogImageUrl = "https://subflow.ing/og-images/subflow-en-og.png";
            ogImageAlt = "Subflow OG Image";
            break;
    }

    return {
        title,
        description,
        keywords,
        authors: [
            {
                name: "ridemountainpig",
                url: "https://www.github.com/ridemountainpig",
            },
        ],
        icons: {
            apple: [
                {
                    url: "/manifest-images/subflow-icon-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                },
            ],
        },
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: "Subflow",
        },
        openGraph: {
            type: "website",
            url: "https://subflow.ing/",
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
            title,
            description,
            creator: "@ridemountainpig",
            images: [ogImageUrl],
        },
    };
}

const customEnUS = {
    ...enUS,
    signIn: {
        ...enUS.signIn,
        start: {
            ...enUS.signIn?.start,
            titleCombined: "Login to continue using Subflow",
            subtitleCombined: "Manage subscription with Subflow",
        },
    },
};

const customZhTW = {
    ...zhTW,
    signIn: {
        ...zhTW.signIn,
        start: {
            ...zhTW.signIn?.start,
            titleCombined: "登入以繼續使用 Subflow",
            subtitleCombined: "使用 Subflow 管理您的訂閱",
        },
    },
};

const customJaJP = {
    ...jaJP,
    signIn: {
        ...jaJP.signIn,
        start: {
            ...jaJP.signIn?.start,
            titleCombined: "Subflow にログインして続ける",
            subtitleCombined: "Subflow でサブスクリプションを管理する",
        },
    },
};

const customEsES = {
    ...esES,
    signIn: {
        ...esES.signIn,
        start: {
            ...esES.signIn?.start,
            titleCombined: "Inicia sesión para continuar usando Subflow",
            subtitleCombined: "Gestiona suscripciones con Subflow",
        },
    },
};

const localizationMap = {
    en: customEnUS,
    zh: customZhTW,
    ja: customJaJP,
    es: customEsES,
} as const;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = useLocale();
    return (
        <ClerkProvider
            localization={
                localizationMap[
                    locale as keyof typeof localizationMap
                ] as Parameters<typeof ClerkProvider>[0]["localization"]
            }
            afterSignOutUrl="/"
        >
            <html lang={locale}>
                <body>
                    <GoogleAnalytics gaId="G-GV0VX77XD7" />
                    <NextIntlClientProvider>
                        <CurrencyProvider>
                            <PreferencesProvider>
                                <Header />
                                {children}
                            </PreferencesProvider>
                        </CurrencyProvider>
                        <Toaster
                            toastOptions={{
                                classNames: {
                                    toast: "tracking-widest toast-font",
                                },
                            }}
                        />
                    </NextIntlClientProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
