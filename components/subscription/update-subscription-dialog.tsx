"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, LoaderCircle } from "lucide-react";
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
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";

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

    const [serviceNameError, setServiceNameError] = useState(false);
    const [servicePriceError, setServicePriceError] = useState(false);

    const [updatingSubscription, setUpdatingSubscription] = useState(false);

    const handleUpdateSubscription = async () => {
        if (serviceName === "") {
            setServiceNameError(true);
        }
        if (servicePrice === 0) {
            setServicePriceError(true);
        }

        if (serviceName === "" || servicePrice === 0) {
            return;
        }

        setUpdatingSubscription(true);

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
            createdAt: subscription.createdAt,
            updatedAt: new Date(),
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <div className="hover:bg-subflow-800 flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm">
                    <Pencil size={16} strokeWidth={2} />
                </div>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px]">
                <DialogHeader>
                    <DialogTitle className="text-subflow-50 text-2xl tracking-widest">
                        {t("updateSubscriptionDialog.title")}
                    </DialogTitle>
                    <DialogDescription className="text-subflow-300 tracking-widest">
                        {t("updateSubscriptionDialog.description")}
                    </DialogDescription>
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        {t("service")}{" "}
                        {serviceNameError && (
                            <span className="text-red-400/90">
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
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        {t("price")}{" "}
                        {servicePriceError && (
                            <span className="text-red-400/90">
                                {t("priceError")}
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-x-2">
                        <Input
                            type="number"
                            placeholder={t("pricePlaceholder")}
                            min={0}
                            className="text-subflow-800 bg-subflow-100 col-span-3 h-10 w-full rounded-md tracking-widest"
                            value={servicePrice || ""}
                            onChange={(e) =>
                                setServicePrice(Number(e.target.value))
                            }
                        />
                        <Select
                            value={serviceCurrency}
                            onValueChange={(value) => setServiceCurrency(value)}
                        >
                            <SelectTrigger className="text-subflow-800 bg-subflow-100 col-span-1 h-10 w-full cursor-pointer tracking-widest">
                                <SelectValue placeholder="Select Currency" />
                            </SelectTrigger>
                            <SelectContent className="min-w-[--trigger-width] tracking-widest">
                                {Object.keys(currenciesList.currencies).map(
                                    (key) => (
                                        <SelectItem
                                            key={key}
                                            value={key}
                                            className="cursor-pointer"
                                        >
                                            {key}
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        {t("startDate")}
                    </div>
                    <DatePicker
                        startDate={startDate}
                        setStartDate={setStartDate}
                    />
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        {t("paymentCycle")}
                    </div>
                    <Select
                        value={paymentCycle}
                        onValueChange={(value) =>
                            setPaymentCycle(value as "monthly" | "yearly")
                        }
                    >
                        <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-full cursor-pointer tracking-widest">
                            <SelectValue placeholder={t("monthly")} />
                        </SelectTrigger>
                        <SelectContent className="tracking-wider">
                            <SelectItem value="monthly">
                                {t("monthly")}
                            </SelectItem>
                            <SelectItem value="yearly">
                                {t("yearly")}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        className={`bg-subflow-600 text-subflow-50 mt-4 h-10 w-full rounded-md tracking-widest ${
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
                                    size={20}
                                    strokeWidth={3}
                                />
                                <span>{t("updating")}</span>
                            </div>
                        ) : (
                            t("update")
                        )}
                    </button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
