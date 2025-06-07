/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import {
    SignedIn,
    UserButton,
    SignedOut,
    RedirectToSignIn,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Header() {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";
    const { userId } = useAuth();
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
                            src="/subflow.svg"
                            alt="subflow-logo"
                            className="h-19 w-19"
                        />
                    </Link>
                </div>
                <h1 className="font-exile text-subflow-50 col-span-1 text-center text-5xl tracking-[0.15em]">
                    Subflow
                </h1>
                {isLoading ? (
                    <div />
                ) : isLoggedIn ? (
                    <div className="col-span-1 flex items-center justify-end">
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
                    <Link
                        href="/"
                        className="col-span-1 flex items-center justify-end"
                    >
                        <button className="bg-subflow-50 text-subflow-900 font-poetsen cursor-pointer rounded-full px-7 py-2 text-lg tracking-wider">
                            Back
                        </button>
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="col-span-1 flex items-center justify-end"
                    >
                        <button className="bg-subflow-50 text-subflow-900 font-poetsen cursor-pointer rounded-full px-7 py-2 text-lg tracking-wider">
                            Login
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
