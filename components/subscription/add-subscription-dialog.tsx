"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CirclePlus, LoaderCircle } from "lucide-react";
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
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";

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

    const [serviceNameError, setServiceNameError] = useState(false);
    const [servicePriceError, setServicePriceError] = useState(false);

    const [addingSubscription, setAddingSubscription] = useState(false);

    useEffect(() => {
        if (open) {
            setServiceName("");
            setServiceUuid("");
            setServicePrice(0);
            setServiceCurrency("USD");
            setStartDate(new Date());
            setPaymentCycle("monthly");
            setServiceNameError(false);
            setServicePriceError(false);
            setAddingSubscription(false);
        }
    }, [open]);

    const handleAddSubscription = async () => {
        if (serviceName === "") {
            setServiceNameError(true);
        }
        if (servicePrice === 0 || servicePrice < 0) {
            setServicePriceError(true);
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
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await addSubscription(subscription);

        toast.success(t("addSuccess"));

        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger title={t("addSubscriptionDialog.title")}>
                <CirclePlus className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px] p-3 sm:p-6">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                        {t("addSubscriptionDialog.title")}
                    </DialogTitle>
                    <DialogDescription className="text-subflow-300 text-xs tracking-widest sm:text-sm md:text-base">
                        {t("addSubscriptionDialog.description")}
                    </DialogDescription>
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
                            onValueChange={(value) => setServiceCurrency(value)}
                        >
                            <SelectTrigger className="text-subflow-800 bg-subflow-100 col-span-1 h-10 w-full cursor-pointer px-2 text-xs tracking-widest sm:px-3 sm:text-base">
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent className="min-w-[--trigger-width] tracking-widest">
                                {Object.keys(currenciesList.currencies).map(
                                    (key) => (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="cursor-pointer text-xs sm:text-base"
                                        >
                                            {key}
                                        </SelectItem>
                                    ),
                                )}
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
                            <SelectItem
                                value="yearly"
                                className="text-xs sm:text-base"
                            >
                                {t("yearly")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        className={`bg-subflow-600 text-subflow-50 mt-4 h-10 w-full rounded-md text-xs tracking-widest sm:text-base ${
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
                                    size={20}
                                    strokeWidth={3}
                                />
                                <span>{t("adding")}</span>
                            </div>
                        ) : (
                            t("add")
                        )}
                    </button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
