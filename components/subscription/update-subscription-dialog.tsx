"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Pencil, LoaderCircle, Users, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { useCurrency } from "@/app/contexts/CurrencyContext";
import { updateSubscription } from "@/app/action";
import { Subscription } from "@/types/subscription";
import { CoSubscriber } from "@/types/co-subscribers";
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";
import CoSubscribersManager from "@/components/subscription/co-subscribers-manager";

interface UpdateSubscriptionDialogProps {
    subscription: Subscription;
    onSuccess?: () => void;
}

export default function UpdateSubscriptionDialog({
    subscription,
    onSuccess,
}: UpdateSubscriptionDialogProps) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("SubscriptionPage");
    const { currenciesList } = useCurrency();

    const [serviceName, setServiceName] = useState(subscription.name);
    const [serviceUuid, setServiceUuid] = useState(subscription.serviceId);
    const [servicePrice, setServicePrice] = useState(subscription.price);
    const [serviceCurrency, setServiceCurrency] = useState(
        subscription.currency,
    );
    const [startDate, setStartDate] = useState(
        new Date(
            subscription.startDate.year,
            subscription.startDate.month - 1,
            subscription.startDate.date,
        ),
    );
    const [paymentCycle, setPaymentCycle] = useState<"monthly" | "yearly">(
        subscription.paymentCycle,
    );
    const [coSubscribers, setCoSubscribers] = useState<CoSubscriber[]>(
        subscription.coSubscribers || [],
    );
    const [viewMode, setViewMode] = useState<"basic" | "coSubscribers">(
        "basic",
    );

    const [serviceNameError, setServiceNameError] = useState(false);
    const [servicePriceError, setServicePriceError] = useState(false);

    const [updatingSubscription, setUpdatingSubscription] = useState(false);

    const resetForm = () => {
        setServiceName(subscription.name);
        setServiceUuid(subscription.serviceId);
        setServicePrice(subscription.price);
        setServiceCurrency(subscription.currency);
        setStartDate(
            new Date(
                subscription.startDate.year,
                subscription.startDate.month - 1,
                subscription.startDate.date,
            ),
        );
        setPaymentCycle(subscription.paymentCycle);
        setCoSubscribers(subscription.coSubscribers || []);
        setViewMode("basic");
        setServiceNameError(false);
        setServicePriceError(false);
    };

    const handleUpdateSubscription = async () => {
        if (serviceName === "") {
            setServiceNameError(true);
        } else {
            setServiceNameError(false);
        }
        if (servicePrice === 0 || servicePrice < 0) {
            setServicePriceError(true);
        } else {
            setServicePriceError(false);
        }

        if (serviceName === "" || servicePrice === 0 || servicePrice < 0) {
            return;
        }

        setUpdatingSubscription(true);

        // When updating, preserve existing confirm status and only remove deleted items
        // Get existing coSubscribers from the original subscription
        const existingCoSubscribers = subscription.coSubscribers || [];
        const existingEmailMap = new Map(
            existingCoSubscribers.map((sub) => [sub.email, sub]),
        );

        // Merge: keep existing confirm status for emails that still exist,
        // remove emails that were deleted, and add new ones with confirm: false
        const mergedCoSubscribers: CoSubscriber[] = coSubscribers.map((sub) => {
            // If email exists in original subscription, preserve its confirm status
            const existing = existingEmailMap.get(sub.email);
            if (existing) {
                return existing; // Keep original confirm status
            }
            // New email, set confirm to false
            return { email: sub.email, confirm: false };
        });

        const updatedSubscription: Subscription = {
            name: serviceName,
            price: servicePrice,
            currency: serviceCurrency,
            startDate: {
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
            },
            paymentCycle: paymentCycle,
            serviceId: serviceUuid,
            userId: subscription.userId,
            coSubscribers: mergedCoSubscribers,
        };

        await updateSubscription(
            subscription._id as string,
            updatedSubscription,
        );

        toast.success(t("updateSuccess"));

        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(newOpen) => {
                setOpen(newOpen);
                if (newOpen) {
                    resetForm();
                }
            }}
        >
            <DialogTrigger title={t("updateSubscriptionDialog.title")}>
                <div className="hover:bg-subflow-800 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm">
                    <Pencil size={16} strokeWidth={2} />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px] p-3 sm:p-6">
                <DialogHeader className="text-left">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                                {viewMode === "basic"
                                    ? t("updateSubscriptionDialog.title")
                                    : t("coSubscribers.title")}
                            </DialogTitle>
                            <DialogDescription className="text-subflow-300 text-xs tracking-widest sm:text-sm md:text-base">
                                {viewMode === "basic"
                                    ? t("updateSubscriptionDialog.description")
                                    : t("coSubscribers.description")}
                            </DialogDescription>
                        </div>
                    </div>
                    {viewMode === "basic" ? (
                        <>
                            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                {t("service")}{" "}
                                {serviceNameError && (
                                    <span className="text-sm text-red-400/90 sm:text-base">
                                        {t("serviceError")}
                                    </span>
                                )}
                            </div>
                            <ServicesCombobox
                                selectedServiceName={serviceName}
                                setSelectedServiceName={setServiceName}
                                selectedServiceUuid={serviceUuid || ""}
                                setSelectedServiceUuid={setServiceUuid}
                            />
                            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                {t("price")}{" "}
                                {servicePriceError && (
                                    <span className="text-sm text-red-400/90 sm:text-base">
                                        {t("priceError")}
                                    </span>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-x-1 sm:gap-x-2">
                                <Input
                                    type="number"
                                    placeholder={t("pricePlaceholder")}
                                    min={0}
                                    className="text-subflow-800 bg-subflow-100 col-span-3 h-10 w-full rounded-md text-xs tracking-widest sm:text-base"
                                    value={servicePrice || ""}
                                    onChange={(e) =>
                                        setServicePrice(Number(e.target.value))
                                    }
                                />
                                <Select
                                    value={serviceCurrency}
                                    onValueChange={(value) =>
                                        setServiceCurrency(value)
                                    }
                                >
                                    <SelectTrigger className="text-subflow-800 bg-subflow-100 col-span-1 h-10 w-full cursor-pointer px-2 text-xs tracking-widest sm:px-3 sm:text-base">
                                        <SelectValue placeholder="Select Currency" />
                                    </SelectTrigger>
                                    <SelectContent className="min-w-[--trigger-width] tracking-widest">
                                        {Object.keys(
                                            currenciesList.currencies,
                                        ).map((key) => (
                                            <SelectItem
                                                key={key}
                                                value={key}
                                                className="cursor-pointer text-xs sm:text-base"
                                            >
                                                {key}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                {t("startDate")}
                            </div>
                            <DatePicker
                                startDate={startDate}
                                setStartDate={setStartDate}
                            />
                            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                {t("paymentCycle")}
                            </div>
                            <Select
                                value={paymentCycle}
                                onValueChange={(value) =>
                                    setPaymentCycle(
                                        value as "monthly" | "yearly",
                                    )
                                }
                            >
                                <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-full cursor-pointer text-xs tracking-widest sm:text-base">
                                    <SelectValue placeholder={t("monthly")} />
                                </SelectTrigger>
                                <SelectContent className="tracking-wider">
                                    <SelectItem
                                        value="monthly"
                                        className="text-xs sm:text-base"
                                    >
                                        {t("monthly")}
                                    </SelectItem>
                                    <SelectItem
                                        value="yearly"
                                        className="text-xs sm:text-base"
                                    >
                                        {t("yearly")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <button
                                onClick={() => setViewMode("coSubscribers")}
                                className="bg-subflow-600 text-subflow-50 mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                            >
                                <Users size={16} strokeWidth={2.5} />
                                {t("coSubscribers.manage")}
                            </button>
                            <button
                                className={`bg-subflow-600 text-subflow-50 mt-2 h-10 w-full rounded-md text-xs tracking-widest sm:text-base ${
                                    updatingSubscription
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                                onClick={handleUpdateSubscription}
                                disabled={updatingSubscription}
                            >
                                {updatingSubscription ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoaderCircle
                                            className="animate-spin"
                                            size={16}
                                            strokeWidth={3}
                                        />
                                        <span>{t("updating")}</span>
                                    </div>
                                ) : (
                                    t("update")
                                )}
                            </button>
                        </>
                    ) : (
                        <>
                            <CoSubscribersManager
                                coSubscribers={coSubscribers}
                                onChange={setCoSubscribers}
                            />
                            <button
                                onClick={() => setViewMode("basic")}
                                className="bg-subflow-600 text-subflow-50 mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                            >
                                <ArrowLeft size={20} strokeWidth={2.5} />
                                {t("coSubscribers.backToBasic")}
                            </button>
                        </>
                    )}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
