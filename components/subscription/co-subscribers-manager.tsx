"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUser } from "@clerk/nextjs";
import { X, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { checkEmailRegistered } from "@/app/actions/action";
import { CoSubscribersManagerProps } from "@/types/co-subscribers";
import CoSubscriberList from "@/components/subscription/co-subscriber-list";

export default function CoSubscribersManager({
    coSubscribers,
    onChange,
    subscriptionCurrency,
}: CoSubscribersManagerProps) {
    const t = useTranslations("SubscriptionPage");
    const { user } = useUser();
    const { currenciesList } = useCurrency();
    const [emailInput, setEmailInput] = useState("");
    const [amountInput, setAmountInput] = useState<number | "">("");
    const [currencyInput, setCurrencyInput] = useState(subscriptionCurrency);
    const [isValidating, setIsValidating] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [amountError, setAmountError] = useState("");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAddEmail = async () => {
        const trimmedEmail = emailInput.trim().toLowerCase();

        setEmailError("");
        setAmountError("");

        if (!amountInput || amountInput <= 0) {
            setAmountError(t("coSubscribers.amountError"));
            return;
        }

        if (!trimmedEmail) {
            setEmailError(t("coSubscribers.emailRequired"));
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            setEmailError(t("coSubscribers.invalidEmail"));
            return;
        }

        if (coSubscribers.some((sub) => sub.email === trimmedEmail)) {
            setEmailError(t("coSubscribers.emailAlreadyAdded"));
            return;
        }

        const currentUserEmail = user?.primaryEmailAddress?.emailAddress
            ?.toLowerCase()
            .trim();
        if (currentUserEmail && trimmedEmail === currentUserEmail) {
            setEmailError(t("coSubscribers.cannotAddOwnEmail"));
            return;
        }

        setIsValidating(true);

        try {
            // Check if email is registered
            const isRegistered = await checkEmailRegistered(trimmedEmail);

            if (!isRegistered) {
                setEmailError(t("coSubscribers.emailNotRegistered"));
                setIsValidating(false);
                return;
            }

            // Add email to the list with the input amount and currency
            onChange([
                ...coSubscribers,
                {
                    email: trimmedEmail,
                    confirm: false,
                    amount: amountInput,
                    currency: currencyInput,
                },
            ]);
            setEmailInput("");
            setAmountInput("");
            setCurrencyInput(subscriptionCurrency);
            toast.success(t("coSubscribers.coSubscriberAdded"));
        } catch (error) {
            console.error("Error checking email:", error);
            setEmailError(t("coSubscribers.checkError"));
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        onChange(coSubscribers.filter((sub) => sub.email !== emailToRemove));
        toast.success(t("coSubscribers.coSubscriberRemoved"));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddEmail();
        }
    };

    return (
        <div className="space-y-3">
            <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                {t("coSubscribers.title")}{" "}
                {amountError && (
                    <span className="text-sm text-red-400/90 sm:text-base">
                        {amountError}
                    </span>
                )}
                {emailError && (
                    <span className="text-sm text-red-400/90 sm:text-base">
                        {emailError}
                    </span>
                )}
            </div>
            <div className="space-y-2">
                {/* Amount and Currency row */}
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min={0}
                        step="0.01"
                        placeholder={t("coSubscribers.amountPlaceholder")}
                        className="text-subflow-800 bg-subflow-100 h-10 w-full rounded-md text-xs tracking-widest sm:text-base"
                        value={amountInput}
                        onChange={(e) => {
                            setAmountInput(
                                e.target.value ? Number(e.target.value) : "",
                            );
                            setAmountError("");
                        }}
                        disabled={isValidating}
                    />
                    <Select
                        value={currencyInput}
                        onValueChange={(value) => setCurrencyInput(value)}
                    >
                        <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-24 cursor-pointer px-2 text-xs tracking-widest sm:text-base">
                            <SelectValue />
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
                {/* Email row */}
                <div className="flex gap-2">
                    <Input
                        type="email"
                        placeholder={t("coSubscribers.emailPlaceholder")}
                        className="text-subflow-800 bg-subflow-100 h-10 w-full rounded-md text-xs tracking-widest sm:text-base"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                            setEmailError("");
                        }}
                        onKeyDown={handleKeyPress}
                        disabled={isValidating}
                    />
                    <Button
                        onClick={handleAddEmail}
                        disabled={
                            isValidating || !emailInput.trim() || !amountInput
                        }
                        className="bg-subflow-600 hover:bg-subflow-600 text-subflow-50 h-10 cursor-pointer rounded-md px-4 text-xs tracking-widest disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                    >
                        {isValidating ? (
                            <LoaderCircle className="animate-spin" size={16} />
                        ) : (
                            t("coSubscribers.add")
                        )}
                    </Button>
                </div>
            </div>
            {coSubscribers.length > 0 && (
                <div className="space-y-2">
                    <div className="text-subflow-300 text-xs tracking-widest sm:text-sm">
                        {t("coSubscribers.listTitle")} ({coSubscribers.length})
                    </div>
                    <CoSubscriberList
                        coSubscribers={coSubscribers}
                        renderAction={(subscriber) => (
                            <button
                                onClick={() =>
                                    handleRemoveEmail(subscriber.email)
                                }
                                className="text-subflow-300 hover:text-subflow-50 cursor-pointer transition-colors"
                                title={t("coSubscribers.remove")}
                            >
                                <X size={16} />
                            </button>
                        )}
                    />
                </div>
            )}
        </div>
    );
}
