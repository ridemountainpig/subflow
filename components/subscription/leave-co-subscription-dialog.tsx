"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { LogOut, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { rejectCoSubscriberInvite } from "@/app/action";
import { Subscription } from "@/types/subscription";

interface LeaveCoSubscriptionDialogProps {
    subscription: Subscription;
    onSuccess?: () => void;
}

export default function LeaveCoSubscriptionDialog({
    subscription,
    onSuccess,
}: LeaveCoSubscriptionDialogProps) {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const t = useTranslations("SubscriptionPage");
    const [leavingSubscription, setLeavingSubscription] = useState(false);

    const userEmail = user?.primaryEmailAddress?.emailAddress
        ?.toLowerCase()
        .trim();

    const handleLeaveSubscription = async () => {
        if (subscription._id && userEmail) {
            setLeavingSubscription(true);
            try {
                await rejectCoSubscriberInvite(subscription._id, userEmail);
                toast.success(t("leaveSuccess"));
                setOpen(false);
                onSuccess?.();
            } catch {
                toast.error(t("leaveFailed"));
            } finally {
                setLeavingSubscription(false);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger title={t("leaveCoSubscriptionDialog.title")}>
                <div className="hover:bg-subflow-800 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm">
                    <LogOut size={16} strokeWidth={2.5} />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 w-120 rounded-2xl border-[3px] p-3 select-none sm:p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest">
                        {t("leaveCoSubscriptionDialog.title")}
                    </DialogTitle>
                    <DialogDescription className="text-subflow-200 tracking-widest">
                        {t("leaveCoSubscriptionDialog.confirmTextOne")}{" "}
                        {subscription.name.charAt(0).toUpperCase() +
                            subscription.name.slice(1)}{" "}
                        {t("leaveCoSubscriptionDialog.confirmTextTwo")}
                    </DialogDescription>
                    <div className="mt-4 flex items-center justify-end gap-x-2">
                        <button
                            className="bg-subflow-600 text-subflow-100 h-8 w-fit cursor-pointer rounded-md px-2 text-xs tracking-widest"
                            onClick={() => setOpen(false)}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            className={`text-subflow-100 h-8 w-fit cursor-pointer rounded-md bg-[#f55050] px-2 text-xs tracking-widest ${
                                leavingSubscription
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                            onClick={handleLeaveSubscription}
                            disabled={leavingSubscription}
                        >
                            {leavingSubscription ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoaderCircle
                                        className="animate-spin"
                                        size={20}
                                        strokeWidth={3}
                                    />
                                    <span>{t("leaving")}</span>
                                </div>
                            ) : (
                                t("leave")
                            )}
                        </button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
