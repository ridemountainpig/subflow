import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ClerkProvider } from "@clerk/nextjs";
import { zhTW, enUS, jaJP, esES } from "@clerk/localizations";
import { NextIntlClientProvider, useLocale } from "next-intl";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";
import { PreferencesProvider } from "@/app/contexts/PreferencesContext";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
    metadataBase: SITE_URL,
    applicationName: "Subflow",
    manifest: "/manifest.webmanifest",
    authors: [
        {
            name: "ridemountainpig",
            url: "https://www.github.com/ridemountainpig",
        },
    ],
    creator: "ridemountainpig",
    publisher: "ridemountainpig",
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
};

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
