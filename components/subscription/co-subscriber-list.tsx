/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Mail, Check, Clock } from "lucide-react";
import { getUserInfoByEmail } from "@/app/action";
import { CoSubscriber, UserInfo } from "@/types/co-subscribers";

interface CoSubscriberListItemProps {
    subscriber: CoSubscriber;
    userInfo: UserInfo | null;
    actionSlot?: ReactNode;
    showConfirmStatus?: boolean;
}

function CoSubscriberListItem({
    subscriber,
    userInfo,
    actionSlot,
    showConfirmStatus = false,
}: CoSubscriberListItemProps) {
    const t = useTranslations("SubscriptionPage");

    const displayName = userInfo
        ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
          subscriber.email
        : subscriber.email;

    return (
        <div
            key={subscriber.email}
            className="bg-subflow-800 text-subflow-50 flex flex-col gap-2 rounded-md px-3 py-2 text-xs sm:text-sm"
        >
            <div className="flex items-center justify-between">
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
                        <span className="tracking-widest">{displayName}</span>
                        {userInfo && displayName !== subscriber.email && (
                            <span className="text-subflow-400 text-[10px] tracking-wider">
                                {subscriber.email}
                            </span>
                        )}
                        <span className="text-subflow-300">
                            {subscriber.amount ?? "-"}{" "}
                            {subscriber.currency ?? "-"}
                        </span>
                    </div>
                </div>
                {showConfirmStatus ? (
                    <div className="text-subflow-50 flex flex-col items-center justify-center gap-1 text-xs tracking-wider">
                        {subscriber.confirm ? (
                            <>
                                <Check size={22} strokeWidth={2} />
                                <span>
                                    {t("coSubscribers.statusConfirmed")}
                                </span>
                            </>
                        ) : (
                            <>
                                <Clock size={22} strokeWidth={2} />
                                <span>{t("coSubscribers.statusPending")}</span>
                            </>
                        )}
                    </div>
                ) : (
                    actionSlot
                )}
            </div>
        </div>
    );
}

interface CoSubscriberListProps {
    coSubscribers: CoSubscriber[];
    showConfirmStatus?: boolean;
    renderAction?: (subscriber: CoSubscriber) => ReactNode;
    enabled?: boolean;
}

export default function CoSubscriberList({
    coSubscribers,
    showConfirmStatus = false,
    renderAction,
    enabled = true,
}: CoSubscriberListProps) {
    const [userInfoMap, setUserInfoMap] = useState<
        Record<string, UserInfo | null>
    >({});

    useEffect(() => {
        if (!enabled || coSubscribers.length === 0) {
            return;
        }

        const fetchUserInfos = async () => {
            const emailsToFetch = coSubscribers
                .map((sub) => sub.email)
                .filter((email) => !(email in userInfoMap));

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

        fetchUserInfos();
    }, [enabled, coSubscribers, userInfoMap]);

    return (
        <div className="custom-scrollbar max-h-60 space-y-2 overflow-y-auto">
            {coSubscribers.map((subscriber) => (
                <CoSubscriberListItem
                    key={subscriber.email}
                    subscriber={subscriber}
                    userInfo={userInfoMap[subscriber.email]}
                    showConfirmStatus={showConfirmStatus}
                    actionSlot={renderAction?.(subscriber)}
                />
            ))}
        </div>
    );
}
