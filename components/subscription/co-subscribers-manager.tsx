/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { X, LoaderCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkEmailRegistered, getUserInfoByEmail } from "@/app/action";
import { CoSubscribersManagerProps, UserInfo } from "@/types/co-subscribers";

export default function CoSubscribersManager({
    coSubscribers,
    onChange,
}: CoSubscribersManagerProps) {
    const t = useTranslations("SubscriptionPage");
    const { user } = useUser();
    const [emailInput, setEmailInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [userInfoMap, setUserInfoMap] = useState<
        Record<string, UserInfo | null>
    >({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAddEmail = async () => {
        const trimmedEmail = emailInput.trim().toLowerCase();

        setEmailError("");

        if (!trimmedEmail) {
            setEmailError(t("coSubscribers.emailRequired"));
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            setEmailError(t("coSubscribers.invalidEmail"));
            return;
        }

        if (coSubscribers.some((sub) => sub.email === trimmedEmail)) {
            setEmailError(t("coSubscribers.emailAlreadyAdded"));
            return;
        }

        const currentUserEmail = user?.primaryEmailAddress?.emailAddress
            ?.toLowerCase()
            .trim();
        if (currentUserEmail && trimmedEmail === currentUserEmail) {
            setEmailError(t("coSubscribers.cannotAddOwnEmail"));
            return;
        }

        setIsValidating(true);

        try {
            // Check if email is registered
            const isRegistered = await checkEmailRegistered(trimmedEmail);

            if (!isRegistered) {
                setEmailError(t("coSubscribers.emailNotRegistered"));
                setIsValidating(false);
                return;
            }

            // Add email to the list with confirm: false
            onChange([
                ...coSubscribers,
                { email: trimmedEmail, confirm: false },
            ]);
            setEmailInput("");
            toast.success(t("coSubscribers.coSubscriberAdded"));
        } catch (error) {
            console.error("Error checking email:", error);
            setEmailError(t("coSubscribers.checkError"));
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        onChange(coSubscribers.filter((sub) => sub.email !== emailToRemove));
        toast.success(t("coSubscribers.coSubscriberRemoved"));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
        }
    };

    // Fetch user info for each co-subscriber email
    useEffect(() => {
        const fetchUserInfos = async () => {
            const emailsToFetch = coSubscribers
                .map((sub) => sub.email)
                .filter((email) => !userInfoMap[email]);

            if (emailsToFetch.length === 0) {
                return;
            }

            const newUserInfoMap: Record<string, UserInfo | null> = {};

            await Promise.all(
                emailsToFetch.map(async (email) => {
                    const userInfo = await getUserInfoByEmail(email);
                    newUserInfoMap[email] = userInfo;
                }),
            );

            setUserInfoMap((prev) => ({ ...prev, ...newUserInfoMap }));
        };

        if (coSubscribers.length > 0) {
            fetchUserInfos();
        }
    }, [coSubscribers, userInfoMap]);

    return (
        <div className="space-y-3">
            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                {t("coSubscribers.title")}{" "}
                {emailError && (
                    <span className="text-sm text-red-400/90 sm:text-base">
                        {emailError}
                    </span>
                )}
            </div>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        type="email"
                        placeholder={t("coSubscribers.emailPlaceholder")}
                        className="text-subflow-800 bg-subflow-100 h-10 w-full rounded-md text-xs tracking-widest sm:text-base"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setEmailError("");
                        }}
                        onKeyDown={handleKeyPress}
                        disabled={isValidating}
                    />
                    <Button
                        onClick={handleAddEmail}
                        disabled={isValidating || !emailInput.trim()}
                        className="bg-subflow-600 hover:bg-subflow-600 text-subflow-50 h-10 cursor-pointer rounded-md px-4 text-xs tracking-widest disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                    >
                        {isValidating ? (
                            <LoaderCircle className="animate-spin" size={16} />
                        ) : (
                            t("coSubscribers.add")
                        )}
                    </Button>
                </div>
            </div>
            {coSubscribers.length > 0 && (
                <div className="space-y-2">
                    <div className="text-subflow-300 text-xs tracking-widest sm:text-sm">
                        {t("coSubscribers.listTitle")} ({coSubscribers.length})
                    </div>
                    <div className="custom-scrollbar max-h-40 space-y-1 overflow-y-auto">
                        {coSubscribers.map((subscriber) => {
                            const userInfo = userInfoMap[subscriber.email];
                            const displayName = userInfo
                                ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
                                  subscriber.email
                                : subscriber.email;

                            return (
                                <div
                                    key={subscriber.email}
                                    className="bg-subflow-800 text-subflow-50 flex items-center justify-between rounded-md px-3 py-2 text-xs sm:text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        {userInfo?.imageUrl ? (
                                            <img
                                                src={userInfo.imageUrl}
                                                alt={displayName}
                                                className="h-5 w-5 rounded-full object-cover"
                                            />
                                        ) : (
                                            <Mail size={14} />
                                        )}
                                        <div className="flex flex-col">
                                            <span className="tracking-widest">
                                                {displayName}
                                            </span>
                                            {userInfo &&
                                                displayName !==
                                                    subscriber.email && (
                                                    <span className="text-subflow-400 text-[10px] tracking-wider">
                                                        {subscriber.email}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleRemoveEmail(subscriber.email)
                                        }
                                        className="text-subflow-300 hover:text-subflow-50 cursor-pointer transition-colors"
                                        title={t("coSubscribers.remove")}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
