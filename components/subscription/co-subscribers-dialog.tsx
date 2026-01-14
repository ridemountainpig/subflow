"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Subscription } from "@/types/subscription";
import CoSubscriberList from "@/components/subscription/co-subscriber-list";

interface CoSubscribersDialogProps {
    subscription: Subscription;
}

export default function CoSubscribersDialog({
    subscription,
}: CoSubscribersDialogProps) {
    const t = useTranslations("SubscriptionPage");
    const [open, setOpen] = useState(false);

    const coSubscribers = useMemo(
        () => subscription.coSubscribers ?? [],
        [subscription.coSubscribers],
    );

    if (coSubscribers.length === 0) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger title={t("coSubscribers.title")}>
                <div
                    className="hover:bg-subflow-800 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm"
                    title={t("sharedSubscription")}
                >
                    <Users size={16} strokeWidth={2.5} />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 w-120 rounded-2xl border-[3px] p-3 select-none sm:p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest">
                        {t("coSubscribers.title")}
                    </DialogTitle>
                </DialogHeader>
                <CoSubscriberList
                    coSubscribers={coSubscribers}
                    showConfirmStatus
                    enabled={open}
                />
            </DialogContent>
        </Dialog>
    );
}
