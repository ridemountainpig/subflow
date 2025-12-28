"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, LoaderCircle, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkEmailRegistered } from "@/app/action";

interface CoSubscribersManagerProps {
    coSubscribers: string[];
    onChange: (emails: string[]) => void;
}

export default function CoSubscribersManager({
    coSubscribers,
    onChange,
}: CoSubscribersManagerProps) {
    const t = useTranslations("SubscriptionPage");
    const [emailInput, setEmailInput] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [emailError, setEmailError] = useState("");

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleAddEmail = async () => {
        const trimmedEmail = emailInput.trim().toLowerCase();

        // Reset error
        setEmailError("");

        // Validate email format
        if (!trimmedEmail) {
            setEmailError(t("coSubscribers.emailRequired"));
            return;
        }

        if (!validateEmail(trimmedEmail)) {
            setEmailError(t("coSubscribers.invalidEmail"));
            return;
        }

        // Check if email already exists in the list
        if (coSubscribers.includes(trimmedEmail)) {
            setEmailError(t("coSubscribers.emailAlreadyAdded"));
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

            // Add email to the list
            onChange([...coSubscribers, trimmedEmail]);
            setEmailInput("");
            toast.success(t("coSubscribers.emailAdded"));
        } catch (error) {
            console.error("Error checking email:", error);
            setEmailError(t("coSubscribers.checkError"));
        } finally {
            setIsValidating(false);
        }
    };

    const handleRemoveEmail = (emailToRemove: string) => {
        onChange(coSubscribers.filter((email) => email !== emailToRemove));
        toast.success(t("coSubscribers.emailRemoved"));
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
                {t("coSubscribers.title")}
            </div>
            <div className="space-y-2">
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
                        onKeyPress={handleKeyPress}
                        disabled={isValidating}
                    />
                    <Button
                        onClick={handleAddEmail}
                        disabled={isValidating || !emailInput.trim()}
                        className="bg-subflow-600 text-subflow-50 h-10 px-4 rounded-md text-xs tracking-widest sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isValidating ? (
                            <LoaderCircle className="animate-spin" size={16} />
                        ) : (
                            t("coSubscribers.add")
                        )}
                    </Button>
                </div>
                {emailError && (
                    <span className="text-sm text-red-400/90 sm:text-base">
                        {emailError}
                    </span>
                )}
            </div>
            {coSubscribers.length > 0 && (
                <div className="space-y-2">
                    <div className="text-subflow-300 text-xs tracking-widest sm:text-sm">
                        {t("coSubscribers.listTitle")} ({coSubscribers.length})
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                        {coSubscribers.map((email) => (
                            <div
                                key={email}
                                className="bg-subflow-800 text-subflow-50 flex items-center justify-between rounded-md px-3 py-2 text-xs sm:text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <Mail size={14} />
                                    <span className="tracking-widest">{email}</span>
                                </div>
                                <button
                                    onClick={() => handleRemoveEmail(email)}
                                    className="text-subflow-300 hover:text-subflow-50 cursor-pointer transition-colors"
                                    title={t("coSubscribers.remove")}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
