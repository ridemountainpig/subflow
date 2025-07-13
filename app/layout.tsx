import { ClerkProvider } from "@clerk/nextjs";
import { zhTW, enUS } from "@clerk/localizations";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";
import { CurrencyProvider } from "@/app/contexts/CurrencyContext";

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
