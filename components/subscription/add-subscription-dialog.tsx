"use client";

import { useState, useEffect } from "react";
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
        if (servicePrice === 0) {
            setServicePriceError(true);
        }

        if (serviceName === "" || servicePrice === 0) {
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

        toast.success("Add Subscription Successfully");

        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <CirclePlus
                    size={34}
                    className="text-subflow-50 cursor-pointer rounded-full"
                />
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 font-poetsen rounded-2xl border-[3px]">
                <DialogHeader>
                    <DialogTitle className="text-subflow-50 text-2xl tracking-widest">
                        Add Subscription
                    </DialogTitle>
                    <DialogDescription className="text-subflow-300 tracking-widest">
                        Add a new subscription to your calendar.
                    </DialogDescription>
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        Service{" "}
                        {serviceNameError && (
                            <span className="text-red-400/90">
                                Please select a service
                            </span>
                        )}
                    </div>
                    <ServicesCombobox
                        selectedServiceName={serviceName}
                        setSelectedServiceName={setServiceName}
                        selectedServiceUuid={serviceUuid}
                        setSelectedServiceUuid={setServiceUuid}
                    />
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        Price{" "}
                        {servicePriceError && (
                            <span className="text-red-400/90">
                                Please enter a price
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-4 gap-x-2">
                        <Input
                            type="number"
                            placeholder="Subscription Price"
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
                            <SelectContent className="font-poetsen min-w-[--trigger-width] tracking-widest">
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
                        Start Date
                    </div>
                    <DatePicker
                        startDate={startDate}
                        setStartDate={setStartDate}
                    />
                    <div className="text-subflow-50 pb-2 text-base tracking-widest">
                        Payment Cycle
                    </div>
                    <Select
                        value={paymentCycle}
                        onValueChange={(value) =>
                            setPaymentCycle(value as "monthly" | "yearly")
                        }
                    >
                        <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-full cursor-pointer tracking-widest">
                            <SelectValue placeholder="Monthly" />
                        </SelectTrigger>
                        <SelectContent className="font-poetsen tracking-wider">
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        className={`bg-subflow-600 text-subflow-50 mt-4 h-10 w-full rounded-md tracking-widest ${
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
                                <span>Adding Subscription</span>
                            </div>
                        ) : (
                            "Add Subscription"
                        )}
                    </button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
