"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CirclePlus, LoaderCircle, Users, ArrowLeft } from "lucide-react";
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
import { addSubscription } from "@/app/action";
import { Subscription } from "@/types/subscription";
import { CoSubscriber } from "@/types/co-subscribers";
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";
import CoSubscribersManager from "@/components/subscription/co-subscribers-manager";

interface AddSubscriptionDialogProps {
    userId: string;
    onSuccess?: () => void;
}

export default function AddSubscriptionDialog({
    userId,
    onSuccess,
}: AddSubscriptionDialogProps) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("SubscriptionPage");
    const { currenciesList } = useCurrency();

    const [serviceName, setServiceName] = useState("");
    const [serviceUuid, setServiceUuid] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [serviceCurrency, setServiceCurrency] = useState("USD");
    const [startDate, setStartDate] = useState(new Date());
    const [paymentCycle, setPaymentCycle] = useState<"monthly" | "yearly">(
        "monthly",
    );
    const [coSubscribers, setCoSubscribers] = useState<CoSubscriber[]>([]);
    const [viewMode, setViewMode] = useState<"basic" | "coSubscribers">(
        "basic",
    );

    const [serviceNameError, setServiceNameError] = useState(false);
    const [servicePriceError, setServicePriceError] = useState(false);

    const [addingSubscription, setAddingSubscription] = useState(false);

    const resetForm = () => {
        setServiceName("");
        setServiceUuid("");
        setServicePrice(0);
        setServiceCurrency("USD");
        setStartDate(new Date());
        setPaymentCycle("monthly");
        setCoSubscribers([]);
        setViewMode("basic");
        setServiceNameError(false);
        setServicePriceError(false);
        setAddingSubscription(false);
    };

    const handleAddSubscription = async () => {
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

        setAddingSubscription(true);

        const subscription: Subscription = {
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
            userId: userId,
            coSubscribers: coSubscribers.map((sub) => ({
                email: sub.email,
                confirm: false,
            })),
        };

        await addSubscription(subscription);

        toast.success(t("addSuccess"));

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
            <DialogTrigger title={t("addSubscriptionDialog.title")}>
                <CirclePlus className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
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
                                selectedServiceUuid={serviceUuid}
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
                                    addingSubscription
                                        ? "cursor-not-allowed"
                                        : "cursor-pointer"
                                }`}
                                onClick={handleAddSubscription}
                                disabled={addingSubscription}
                            >
                                {addingSubscription ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoaderCircle
                                            className="animate-spin"
                                            size={16}
                                            strokeWidth={3}
                                        />
                                        <span>{t("adding")}</span>
                                    </div>
                                ) : (
                                    t("add")
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
