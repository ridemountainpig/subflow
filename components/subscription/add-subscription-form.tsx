"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LoaderCircle, Users, ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useCurrency } from "@/app/contexts/CurrencyContext";
import { CoSubscriber } from "@/types/co-subscribers";
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";
import CoSubscribersManager from "@/components/subscription/co-subscribers-manager";

export interface AddSubscriptionFormData {
    serviceName: string;
    serviceUuid: string;
    servicePrice: number;
    serviceCurrency: string;
    startDate: Date;
    paymentCycle: "monthly" | "yearly";
    coSubscribers: CoSubscriber[];
}

interface AddSubscriptionFormProps {
    initialValues?: {
        serviceName?: string;
        serviceUuid?: string;
        servicePrice?: number;
        serviceCurrency?: string;
        startDate?: Date;
        paymentCycle?: "monthly" | "yearly";
    };
    onSubmit: (data: AddSubscriptionFormData) => Promise<void>;
    showCoSubscribers?: boolean;
    submitButtonText?: string;
    isSubmitting?: boolean;
    viewMode?: "basic" | "coSubscribers";
    onViewModeChange?: (mode: "basic" | "coSubscribers") => void;
}

export default function AddSubscriptionForm({
    initialValues,
    onSubmit,
    showCoSubscribers = false,
    submitButtonText,
    isSubmitting = false,
    viewMode: controlledViewMode,
    onViewModeChange,
}: AddSubscriptionFormProps) {
    const t = useTranslations("SubscriptionPage");
    const { currenciesList } = useCurrency();

    const [serviceName, setServiceName] = useState(
        initialValues?.serviceName || "",
    );
    const [serviceUuid, setServiceUuid] = useState(
        initialValues?.serviceUuid || "",
    );
    const [servicePrice, setServicePrice] = useState(
        initialValues?.servicePrice || 0,
    );
    const [serviceCurrency, setServiceCurrency] = useState(
        initialValues?.serviceCurrency || "USD",
    );
    const [startDate, setStartDate] = useState(
        initialValues?.startDate || new Date(),
    );
    const [paymentCycle, setPaymentCycle] = useState<"monthly" | "yearly">(
        initialValues?.paymentCycle || "monthly",
    );
    const [coSubscribers, setCoSubscribers] = useState<CoSubscriber[]>([]);

    const [internalViewMode, setInternalViewMode] = useState<
        "basic" | "coSubscribers"
    >("basic");

    const viewMode = controlledViewMode ?? internalViewMode;

    const handleViewModeChange = (mode: "basic" | "coSubscribers") => {
        if (onViewModeChange) {
            onViewModeChange(mode);
        } else {
            setInternalViewMode(mode);
        }
    };

    const [serviceNameError, setServiceNameError] = useState(false);
    const [servicePriceError, setServicePriceError] = useState(false);

    const handleSubmit = async () => {
        let hasError = false;

        if (serviceName === "") {
            setServiceNameError(true);
            hasError = true;
        } else {
            setServiceNameError(false);
        }

        if (servicePrice === 0 || servicePrice < 0) {
            setServicePriceError(true);
            hasError = true;
        } else {
            setServicePriceError(false);
        }

        if (hasError) {
            return;
        }

        await onSubmit({
            serviceName,
            serviceUuid,
            servicePrice,
            serviceCurrency,
            startDate,
            paymentCycle,
            coSubscribers,
        });
    };

    if (viewMode === "coSubscribers" && showCoSubscribers) {
        return (
            <>
                <CoSubscribersManager
                    coSubscribers={coSubscribers}
                    onChange={setCoSubscribers}
                    subscriptionCurrency={serviceCurrency}
                />
                <button
                    onClick={() => handleViewModeChange("basic")}
                    className="bg-subflow-600 text-subflow-50 mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                >
                    <ArrowLeft size={20} strokeWidth={2.5} />
                    {t("coSubscribers.backToBasic")}
                </button>
            </>
        );
    }

    return (
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
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                />
                <Select
                    value={serviceCurrency}
                    onValueChange={(value) => setServiceCurrency(value)}
                >
                    <SelectTrigger className="text-subflow-800 bg-subflow-100 col-span-1 h-10 w-full cursor-pointer px-2 text-xs tracking-widest sm:px-3 sm:text-base">
                        <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[--trigger-width] tracking-widest">
                        {Object.keys(currenciesList.currencies).map((key) => (
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
            <DatePicker startDate={startDate} setStartDate={setStartDate} />
            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                {t("paymentCycle")}
            </div>
            <Select
                value={paymentCycle}
                onValueChange={(value) =>
                    setPaymentCycle(value as "monthly" | "yearly")
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
                    <SelectItem value="yearly" className="text-xs sm:text-base">
                        {t("yearly")}
                    </SelectItem>
                </SelectContent>
            </Select>
            {showCoSubscribers && (
                <button
                    onClick={() => handleViewModeChange("coSubscribers")}
                    className="bg-subflow-600 text-subflow-50 mt-2 flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                >
                    <Users size={16} strokeWidth={2.5} />
                    {t("coSubscribers.manage")}
                    {coSubscribers.length > 0 && (
                        <span className="text-xs sm:text-sm">
                            ({coSubscribers.length})
                        </span>
                    )}
                </button>
            )}
            <button
                className={`bg-subflow-600 text-subflow-50 mt-2 h-10 w-full rounded-md text-xs tracking-widest sm:text-base ${
                    isSubmitting ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                        <LoaderCircle
                            className="animate-spin"
                            size={16}
                            strokeWidth={3}
                        />
                        <span>{t("adding")}</span>
                    </div>
                ) : (
                    submitButtonText || t("add")
                )}
            </button>
        </>
    );
}
