import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ClerkProvider } from "@clerk/nextjs";
import { zhTW, enUS } from "@clerk/localizations";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();

    const isZh = locale === "zh";

    const title = isZh ? "Subflow 訂閱管理" : "Subflow";
    const description = isZh
        ? "輕鬆管理訂閱支出。使用 Subflow 追蹤花費、整理定期付款，全面掌控您的訂閱生活。"
        : "Easily flow through your subscriptions with Subflow. Track spending, organize recurring payments, and take control of your subscription management.";

    return {
        title,
        description,
        keywords: isZh
            ? "訂閱管理, 訂閱管理工具, 訂閱管理軟體, 訂閱管理應用, 管理定期付款, 訂閱追蹤, 訂閱支出追蹤, 每月訂閱整理, 個人訂閱追蹤器, 訂閱可視化工具, 數位訂閱管理, 定期扣款管理"
            : "Subscription Management, Subscription Management Tool, Subscription Management Software, Subscription Management App, Subscription Management Service, Subscription Management Platform, Subscription Management System, Subscription Management Solution, Track Subscription Spending, Manage Recurring Payments, Organize Monthly Subscriptions, Subscription Tracker for Individuals, Visualize Subscription Flow, Monitor Digital Subscriptions",
        authors: [
            {
                name: "ridemountainpig",
                url: "https://www.github.com/ridemountainpig",
            },
        ],
        openGraph: {
            type: "website",
            url: "https://subflow.ing/",
            title,
            description,
            images: [
                {
                    url: isZh
                        ? "https://subflow.ing/subflow-zh-og.png"
                        : "https://subflow.ing/subflow-en-og.png",
                    width: 1200,
                    height: 630,
                    alt: isZh ? "Subflow 開放圖像" : "Subflow OG Image",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            creator: "@ridemountainpig",
            images: [
                isZh
                    ? "https://subflow.ing/subflow-zh-og.png"
                    : "https://subflow.ing/subflow-en-og.png",
            ],
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

const localizationMap = {
    en: customEnUS,
    zh: customZhTW,
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
                            <Header />
                            {children}
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
