/* eslint-disable @next/next/no-img-element */
"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
    SignedIn,
    UserButton,
    SignedOut,
    RedirectToSignIn,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/language-switcher";

export default function Header() {
    const pathname = usePathname();
    const isLoginPage = /^\/(?:en|zh)\/login/.test(pathname);
    const { userId } = useAuth();
    const t = useTranslations("Header");
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!userId);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [userId]);

    return (
        <header className="bg-subflow-900 w-full pt-10 select-none">
            <div className="mx-auto grid w-[90%] grid-cols-3 items-center">
                <div className="col-span-1 flex h-fit items-center">
                    <Link href="/">
                        <img
                            src="/subflow-dark.svg"
                            alt="subflow-logo"
                            className="h-19 w-19"
                        />
                    </Link>
                </div>
                <h1 className="font-exile text-subflow-50 col-span-1 text-center text-[44px] tracking-[0.15em]">
                    Subflow
                </h1>
                {isLoading ? (
                    <div />
                ) : isLoggedIn ? (
                    <div className="col-span-1 flex items-center justify-end gap-4">
                        <LanguageSwitcher />
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "min-w-10 min-h-10",
                                    },
                                }}
                            />
                        </SignedIn>
                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </div>
                ) : isLoginPage ? (
                    <div className="col-span-1 flex items-center justify-end gap-4">
                        <LanguageSwitcher />
                        <Link href="/">
                            <button className="bg-subflow-50 text-subflow-900 cursor-pointer rounded-full px-7 py-2 text-lg tracking-wider">
                                {t("back")}
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="col-span-1 flex items-center justify-end gap-4">
                        <LanguageSwitcher />
                        <Link href="/login">
                            <button className="bg-subflow-50 text-subflow-900 cursor-pointer rounded-full px-7 py-2 text-lg tracking-wider">
                                {t("login")}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
