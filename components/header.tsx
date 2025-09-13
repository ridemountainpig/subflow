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
import MoreMenu from "@/components/more-menu/more-menu";

export default function Header() {
    const pathname = usePathname();
    const isLoginPage = /^\/(?:en|zh|ja)\/login/.test(pathname);
    const { userId } = useAuth();
    const t = useTranslations("Header");
    const buttonStyle =
        "bg-subflow-50 text-subflow-900 cursor-pointer rounded-full px-3 py-2 text-[10.5px] font-semibold md:px-5 md:text-lg md:tracking-wider";

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!userId);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, [userId]);

    return (
        <header className="bg-subflow-900 w-full pt-4 select-none sm:pt-10">
            <div className="mx-auto grid w-full grid-cols-4 items-center sm:w-[95%] sm:grid-cols-3">
                <div className="col-span-1 flex h-fit items-center">
                    <Link href="/">
                        <img
                            src="/subflow-dark.svg"
                            alt="subflow-logo"
                            className="h-10 w-10 sm:h-19 sm:w-19"
                        />
                    </Link>
                </div>
                <div className="col-span-2 flex items-center justify-center sm:col-span-1">
                    <h1 className="font-exile text-subflow-50 w-fit text-[26px] tracking-[0.15em] sm:text-[32px] md:text-[44px]">
                        Subflow
                    </h1>
                </div>
                {isLoading ? (
                    <div />
                ) : (
                    <div className="col-span-1 flex items-center justify-end gap-1 pr-1 sm:gap-4 sm:pr-0">
                        <LanguageSwitcher />
                        {isLoggedIn ? (
                            <>
                                <MoreMenu />
                                <SignedIn>
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                avatarBox:
                                                    "min-w-6 min-h-6 sm:min-w-10 sm:min-h-10",
                                            },
                                        }}
                                    />
                                </SignedIn>
                                <SignedOut>
                                    <RedirectToSignIn />
                                </SignedOut>
                            </>
                        ) : isLoginPage ? (
                            <Link href="/">
                                <button className={buttonStyle}>
                                    {t("back")}
                                </button>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <button className={buttonStyle}>
                                    {t("login")}
                                </button>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
