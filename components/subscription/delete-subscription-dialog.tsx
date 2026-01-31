"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { deleteSubscription } from "@/app/actions/action";
import { Subscription } from "@/types/subscription";

interface DeleteSubscriptionDialogProps {
    subscription: Subscription;
    onSuccess?: () => void;
}

export default function DeleteSubscriptionDialog({
    subscription,
    onSuccess,
}: DeleteSubscriptionDialogProps) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("SubscriptionPage");
    const [deletingSubscription, setDeletingSubscription] = useState(false);

    const handleDeleteSubscription = async () => {
        if (subscription._id) {
            setDeletingSubscription(true);
            await deleteSubscription(subscription._id);
            toast.success(t("deleteSuccess"));
            setDeletingSubscription(false);
            setOpen(false);
            onSuccess?.();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger title={t("deleteSubscriptionDialog.title")}>
                <div className="hover:bg-subflow-800 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm">
                    <Trash2 size={16} strokeWidth={2} />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 w-120 rounded-2xl border-[3px] p-3 select-none sm:p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest">
                        {t("deleteSubscriptionDialog.title")}
                    </DialogTitle>
                    <DialogDescription className="text-subflow-200 tracking-widest">
                        {t("deleteSubscriptionDialog.confirmTextOne")}{" "}
                        {subscription.name.charAt(0).toUpperCase() +
                            subscription.name.slice(1)}{" "}
                        {t("deleteSubscriptionDialog.confirmTextTwo")}
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
                                deletingSubscription
                                    ? "cursor-not-allowed"
                                    : "cursor-pointer"
                            }`}
                            onClick={handleDeleteSubscription}
                            disabled={deletingSubscription}
                        >
                            {deletingSubscription ? (
                                <div className="flex items-center justify-center gap-2">
                                    <LoaderCircle
                                        className="animate-spin"
                                        size={20}
                                        strokeWidth={3}
                                    />
                                    <span>{t("deleting")}</span>
                                </div>
                            ) : (
                                t("delete")
                            )}
                        </button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
