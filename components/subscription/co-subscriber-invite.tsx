"use client";

import { useState, useEffect, useCallback, ComponentType } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Mail, Check, X, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { Subscription } from "@/types/subscription";
import { UserInfo } from "@/types/co-subscribers";
import { subscriptionServices } from "@/data/subscriptionServices";
import {
    getSubscriptionsByCoSubscriberEmail,
    confirmCoSubscriberInvite,
    rejectCoSubscriberInvite,
    getUserInfoById,
} from "@/app/action";
import FormattedNumber from "@/components/subscription/formatted-number";
import { usePreferences } from "@/app/contexts/PreferencesContext";

interface CoSubscriberInviteProps {
    setUpdatedSubscription: (updated: boolean) => void;
}

interface InviteItem {
    subscription: Subscription;
    userInfo: UserInfo | null;
}

export default function CoSubscriberInvite({
    setUpdatedSubscription,
}: CoSubscriberInviteProps) {
    const { user } = useUser();
    const t = useTranslations("SubscriptionPage");
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [invites, setInvites] = useState<InviteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const { notAmortizeYearlySubscriptions } = usePreferences();

    const currentUserEmail = user?.primaryEmailAddress?.emailAddress
        ?.toLowerCase()
        .trim();

    const refreshInvites = useCallback(async () => {
        if (!currentUserEmail) return;

        const subscriptions =
            await getSubscriptionsByCoSubscriberEmail(currentUserEmail);
        const inviteItems: InviteItem[] = await Promise.all(
            subscriptions.map(async (sub: Subscription) => {
                const userInfo = await getUserInfoById(sub.userId);
                return {
                    subscription: sub,
                    userInfo: userInfo as UserInfo | null,
                };
            }),
        );
        setInvites(inviteItems);
    }, [currentUserEmail]);

    useEffect(() => {
        const fetchInvites = async () => {
            if (!currentUserEmail) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                await refreshInvites();
            } catch (error) {
                console.error("Error fetching invites:", error);
                toast.error(t("coSubscribers.fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchInvites();
    }, [currentUserEmail, t, refreshInvites]);

    const handleConfirm = async (subscriptionId: string) => {
        if (!currentUserEmail) return;

        setConfirmingId(subscriptionId);
        try {
            await confirmCoSubscriberInvite(subscriptionId, currentUserEmail);
            toast.success(t("coSubscribers.confirmSuccess"));
            setUpdatedSubscription(true);
            await refreshInvites();
            if (isMobile) {
                setDrawerOpen(false);
            }
        } catch (error) {
            console.error("Error confirming invite:", error);
            toast.error(t("coSubscribers.confirmError"));
        } finally {
            setConfirmingId(null);
        }
    };

    const handleReject = async (subscriptionId: string) => {
        if (!currentUserEmail) return;

        setRejectingId(subscriptionId);
        try {
            await rejectCoSubscriberInvite(subscriptionId, currentUserEmail);
            toast.success(t("coSubscribers.rejectSuccess"));
            setUpdatedSubscription(true);
            await refreshInvites();
            if (isMobile) {
                setDrawerOpen(false);
            }
        } catch (error) {
            console.error("Error rejecting invite:", error);
            toast.error(t("coSubscribers.rejectError"));
        } finally {
            setRejectingId(null);
        }
    };

    const renderInviteItem = (invite: InviteItem, index: number) => {
        const { subscription, userInfo } = invite;
        const Icon = subscriptionServices.find(
            (service) => service.uuid === subscription.serviceId,
        )?.icon as ComponentType<{ className?: string }>;

        const displayName = userInfo
            ? `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() ||
              userInfo.emailAddress
            : subscription.userId;

        const price =
            subscription.paymentCycle === "yearly" &&
            !notAmortizeYearlySubscriptions
                ? subscription.price / 12
                : subscription.price;

        return (
            <div
                key={subscription._id || index}
                className="flex flex-col gap-y-3"
            >
                <div className="text-subflow-400 flex items-center gap-1.5 tracking-widest">
                    <span className="text-[13px]">
                        {displayName} {t("coSubscribers.invitedYou")}
                    </span>
                </div>
                <div className="flex items-center justify-between gap-x-3">
                    <div className="flex items-center gap-x-2">
                        {Icon ? (
                            <Icon className="h-5 w-5" />
                        ) : (
                            <span className="bg-subflow-900 border-subflow-100 flex h-7 w-7 items-center justify-center rounded-md border-2 text-lg">
                                {subscription.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <span className="text-base tracking-wider">
                            {subscription.name.charAt(0).toUpperCase() +
                                subscription.name.slice(1)}
                        </span>
                    </div>
                    <div className="flex items-center gap-x-2 tracking-widest">
                        <FormattedNumber
                            value={Math.round(price)}
                            className="text-base"
                        />
                        <span className="text-[11px]">
                            {subscription.currency}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            handleConfirm(subscription._id as string)
                        }
                        disabled={confirmingId !== null || rejectingId !== null}
                        className={`bg-subflow-600 text-subflow-100 flex h-8 w-full items-center justify-center gap-1.5 rounded-md px-2 text-xs tracking-widest ${
                            confirmingId !== null || rejectingId !== null
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                        }`}
                    >
                        {confirmingId === subscription._id ? (
                            <LoaderCircle
                                className="animate-spin"
                                size={16}
                                strokeWidth={3}
                            />
                        ) : (
                            <Check size={16} strokeWidth={3} />
                        )}
                        {t("coSubscribers.confirmInvite")}
                    </button>
                    <button
                        onClick={() => handleReject(subscription._id as string)}
                        disabled={confirmingId !== null || rejectingId !== null}
                        className={`text-subflow-100 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-[#f55050] px-2 text-xs tracking-widest ${
                            confirmingId !== null || rejectingId !== null
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                        }`}
                    >
                        {rejectingId === subscription._id ? (
                            <LoaderCircle
                                className="animate-spin"
                                size={16}
                                strokeWidth={3}
                            />
                        ) : (
                            <X size={16} strokeWidth={3} />
                        )}
                        {t("coSubscribers.rejectInvite")}
                    </button>
                </div>
                {index !== invites.length - 1 && (
                    <div className="border-subflow-800 my-1 border-t-2" />
                )}
            </div>
        );
    };

    const triggerContent = (
        <motion.div
            className="relative cursor-pointer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
        >
            <Mail className="text-subflow-50 size-6 sm:size-[34px]" />
            {invites.length > 0 && (
                <span className="bg-subflow-600 text-subflow-50 absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold sm:h-5 sm:w-5">
                    {invites.length}
                </span>
            )}
        </motion.div>
    );

    if (invites.length === 0 || loading) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                    <div onClick={() => setDrawerOpen(true)}>
                        {triggerContent}
                    </div>
                </DrawerTrigger>
                <DrawerContent className="bg-subflow-900 text-subflow-50 border-none">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle></DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>
                    <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-4 sm:px-6">
                        <div className="text-subflow-50 mb-2 text-base tracking-wider">
                            {t("coSubscribers.inviteTitle")}
                        </div>
                        {invites.map((invite, index) =>
                            renderInviteItem(invite, index),
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <HoverCard openDelay={150} closeDelay={50}>
            <HoverCardTrigger asChild>{triggerContent}</HoverCardTrigger>
            <HoverCardContent className="bg-subflow-900 border-subflow-100 text-subflow-50 mt-3 w-fit min-w-70 overflow-hidden rounded-2xl border-3 p-0">
                <div className="custom-scrollbar max-h-96 overflow-y-auto p-4 select-none">
                    <div className="text-subflow-50 mb-2 text-base tracking-wider">
                        {t("coSubscribers.inviteTitle")}
                    </div>
                    {invites.map((invite, index) =>
                        renderInviteItem(invite, index),
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
