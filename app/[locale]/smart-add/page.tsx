"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import SmartAddInput from "@/components/smart-add/smart-add-input";
import { analyzeContentWithGateway } from "@/app/actions/smart-add";
import { addSubscription } from "@/app/actions/action";
import { Subscription } from "@/types/subscription";
import AddSubscriptionForm, {
    AddSubscriptionFormData,
} from "@/components/subscription/add-subscription-form";

interface AnalyzedData {
    error?: string;
    name?: string;
    price?: number;
    currency?: string;
    date?: string;
    paymentCycle?: "monthly" | "yearly";
    matchedServiceUuid?: string | null;
}

export default function SmartAddPage() {
    const t = useTranslations("SmartAddPage");
    const tSub = useTranslations("SubscriptionPage");
    const router = useRouter();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analyzedData, setAnalyzedData] = useState<AnalyzedData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAnalyze = async (file: File | null, text: string | null) => {
        setIsAnalyzing(true);
        setAnalyzedData(null);
        try {
            const formData = new FormData();
            if (file) {
                formData.append("file", file);
            }
            if (text) {
                formData.append("text", text);
            }

            const result = await analyzeContentWithGateway(formData);

            if (result) {
                if (result.error === "not_subscription") {
                    toast.error(t("notSubscriptionError"));
                    setAnalyzedData(null);
                    return;
                }

                setAnalyzedData(result);
                toast.success(t("analysisComplete"));
            }
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error(t("analysisFailed"));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReanalyze = () => {
        setAnalyzedData(null);
    };

    const handleSubmit = async (data: AddSubscriptionFormData) => {
        setIsSubmitting(true);

        try {
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
                userId: "",
                coSubscribers: [],
            };

            await addSubscription(subscription);

            toast.success(tSub("addSuccess"));

            router.push("/subscription");
        } catch (error) {
            console.error("Failed to add subscription", error);
            toast.error(tSub("addFailed") || "Failed to add subscription");
            setIsSubmitting(false);
        }
    };

    const initialFormValues = useMemo(() => {
        if (!analyzedData) return undefined;

        let parsedStartDate = new Date();
        if (analyzedData.date) {
            const parsed = new Date(analyzedData.date);
            if (!isNaN(parsed.getTime())) {
                parsedStartDate = parsed;
            }
        }

        return {
            serviceName: analyzedData.name || "",
            serviceUuid: analyzedData.matchedServiceUuid || "custom",
            servicePrice: analyzedData.price || 0,
            serviceCurrency: analyzedData.currency || "USD",
            startDate: parsedStartDate,
            paymentCycle:
                analyzedData.paymentCycle === "yearly"
                    ? ("yearly" as const)
                    : ("monthly" as const),
        };
    }, [analyzedData]);

    return (
        <div className="bg-subflow-900 relative flex h-full min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center gap-8 overflow-y-auto p-4 select-none sm:min-h-[calc(100vh-7.25rem)]">
            <div className="space-y-4 pt-6 text-center sm:space-y-2 sm:pt-0">
                <h1 className="text-subflow-50 text-2xl font-bold tracking-widest sm:text-3xl">
                    {t("title")}
                </h1>
                <p className="text-subflow-300 text-sm tracking-wider">
                    {t("subtitle")}
                </p>
            </div>

            {!analyzedData && (
                <SmartAddInput
                    onAnalyze={handleAnalyze}
                    isAnalyzing={isAnalyzing}
                />
            )}

            <div>
                {analyzedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-subflow-900 border-subflow-100 w-[90vw] rounded-2xl border-[3px] p-4 shadow-2xl sm:w-[512px] sm:p-6"
                    >
                        <h2 className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                            {t("analysisResult")}
                        </h2>
                        <p className="text-subflow-300 mb-6 text-xs tracking-widest sm:text-sm md:text-base">
                            {t("analysisResultDescription")}
                        </p>

                        <div className="space-y-2">
                            <AddSubscriptionForm
                                key={
                                    analyzedData
                                        ? JSON.stringify(analyzedData)
                                        : "empty"
                                }
                                initialValues={initialFormValues}
                                onSubmit={handleSubmit}
                                showCoSubscribers={false}
                                isSubmitting={isSubmitting}
                            />

                            <button
                                onClick={handleReanalyze}
                                className="bg-subflow-600 text-subflow-50 mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                            >
                                {t("reanalyze")}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
