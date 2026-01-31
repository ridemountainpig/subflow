"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CirclePlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { addSubscription } from "@/app/actions/action";
import { Subscription } from "@/types/subscription";
import AddSubscriptionForm, {
    AddSubscriptionFormData,
} from "@/components/subscription/add-subscription-form";

interface AddSubscriptionDialogProps {
    userId: string;
    onSuccess?: () => void;
}

export default function AddSubscriptionDialog({
    userId,
    onSuccess,
}: AddSubscriptionDialogProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formKey, setFormKey] = useState(0);
    const [viewMode, setViewMode] = useState<"basic" | "coSubscribers">(
        "basic",
    );
    const t = useTranslations("SubscriptionPage");

    const handleSubmit = async (data: AddSubscriptionFormData) => {
        setIsSubmitting(true);

        const subscription: Subscription = {
            name: data.serviceName,
            price: data.servicePrice,
            currency: data.serviceCurrency,
            startDate: {
                year: data.startDate.getFullYear(),
                month: data.startDate.getMonth() + 1,
                date: data.startDate.getDate(),
            },
            paymentCycle: data.paymentCycle,
            serviceId: data.serviceUuid,
            userId: userId,
            coSubscribers: data.coSubscribers.map((sub) => ({
                email: sub.email,
                confirm: false,
                amount: sub.amount,
                currency: sub.currency,
            })),
        };

        await addSubscription(subscription);

        toast.success(t("addSuccess"));

        setIsSubmitting(false);
        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                setOpen(newOpen);
                if (newOpen) {
                    // Reset form by changing key
                    setFormKey((prev) => prev + 1);
                    setIsSubmitting(false);
                    setViewMode("basic");
                }
            }}
        >
            <DialogTrigger title={t("addSubscriptionDialog.title")}>
                <div className="bg-subflow-800/50 flex h-fit w-full cursor-pointer items-center gap-x-4 rounded-lg p-2 sm:p-4">
                    <div className="bg-subflow-900 flex items-center justify-center rounded-md p-1.5">
                        <CirclePlus className="text-subflow-50 size-5 cursor-pointer sm:size-6" />
                    </div>
                    <span className="text-subflow-50 text-sm tracking-widest sm:text-lg">
                        {t("addSubscriptionDialog.manualAdd")}
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px] p-3 sm:p-6">
                <DialogHeader className="text-left">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                                {viewMode === "basic"
                                    ? t("addSubscriptionDialog.title")
                                    : t("coSubscribers.title")}
                            </DialogTitle>
                            <DialogDescription className="text-subflow-300 text-xs tracking-widest sm:text-sm md:text-base">
                                {viewMode === "basic"
                                    ? t("addSubscriptionDialog.description")
                                    : t("coSubscribers.description")}
                            </DialogDescription>
                        </div>
                    </div>
                    <AddSubscriptionForm
                        key={formKey}
                        onSubmit={handleSubmit}
                        showCoSubscribers={true}
                        isSubmitting={isSubmitting}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
