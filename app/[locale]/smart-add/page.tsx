"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { motion } from "framer-motion";

import SmartAddInput from "@/components/smart-add/smart-add-input";
import ServicesCombobox from "@/components/subscription/services-combobox";
import DatePicker from "@/components/subscription/date-picker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { analyzeContent } from "@/app/actions/smart-add";
import { useCurrency } from "@/app/contexts/CurrencyContext";

export default function SmartAddPage() {
    const t = useTranslations("SubscriptionPage");
    const { currenciesList } = useCurrency();

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [analyzedData, setAnalyzedData] = useState<any>(null);

    const [serviceName, setServiceName] = useState("");
    const [serviceUuid, setServiceUuid] = useState("");
    const [servicePrice, setServicePrice] = useState(0);
    const [serviceCurrency, setServiceCurrency] = useState("USD");
    const [startDate, setStartDate] = useState(new Date());
    const [paymentCycle, setPaymentCycle] = useState<"monthly" | "yearly">(
        "monthly",
    );

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

            const result = await analyzeContent(formData);

            if (result) {
                if (result.error === "not_subscription") {
                    toast.error(
                        "The uploaded content does not look like a subscription receipt or pricing details.",
                    );
                    setAnalyzedData(null);
                    return;
                }

                setAnalyzedData(result);
                setServiceName(result.name || "");
                setServiceUuid(result.matchedServiceUuid || "custom");
                setServicePrice(result.price || 0);
                setServiceCurrency(result.currency || "USD");
                setPaymentCycle(
                    result.paymentCycle === "yearly" ? "yearly" : "monthly",
                );

                if (result.date) {
                    const parsedDate = new Date(result.date);
                    if (!isNaN(parsedDate.getTime())) {
                        setStartDate(parsedDate);
                    }
                }

                toast.success("Analysis complete!");
            }
        } catch (error) {
            console.error("Analysis failed", error);
            toast.error("Failed to analyze the file. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-subflow-900 relative flex h-full min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center gap-8 overflow-y-auto p-4 select-none sm:min-h-[calc(100vh-7.25rem)]">
            <div className="space-y-2 text-center">
                <h1 className="text-subflow-50 text-3xl font-bold tracking-widest">
                    Smart Add Subscription
                </h1>
                <p className="text-subflow-300 text-sm tracking-wider">
                    Upload a receipt or paste subscription details to auto-fill
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
                        className="bg-subflow-900 border-subflow-100 w-[512px] rounded-2xl border-[3px] p-4 shadow-2xl sm:p-6"
                    >
                        <h2 className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                            Analysis Result
                        </h2>
                        <p className="text-subflow-300 mb-6 text-xs tracking-widest sm:text-sm md:text-base">
                            Subscription details extracted from the provided
                            information
                        </p>

                        <div className="space-y-4">
                            <div>
                                <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                    Service
                                </div>
                                <ServicesCombobox
                                    selectedServiceName={serviceName}
                                    setSelectedServiceName={setServiceName}
                                    selectedServiceUuid={serviceUuid}
                                    setSelectedServiceUuid={setServiceUuid}
                                />
                            </div>

                            <div>
                                <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                    Price
                                </div>
                                <div className="grid grid-cols-4 gap-x-2">
                                    <Input
                                        type="number"
                                        min={0}
                                        className="text-subflow-800 bg-subflow-100 col-span-3 h-10 w-full rounded-md text-sm tracking-widest"
                                        value={servicePrice}
                                        onChange={(e) =>
                                            setServicePrice(
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                    <Select
                                        value={serviceCurrency}
                                        onValueChange={setServiceCurrency}
                                    >
                                        <SelectTrigger className="text-subflow-800 bg-subflow-100 col-span-1 h-10 w-full cursor-pointer px-2 text-xs tracking-widest">
                                            <SelectValue placeholder="USD" />
                                        </SelectTrigger>
                                        <SelectContent className="min-w-[--trigger-width] tracking-widest">
                                            {Object.keys(
                                                currenciesList.currencies,
                                            ).map((key) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {key}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                    Start Date
                                </div>
                                <DatePicker
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                />
                            </div>

                            <div>
                                <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                                    Payment Cycle
                                </div>
                                <Select
                                    value={paymentCycle}
                                    onValueChange={(
                                        val: "monthly" | "yearly",
                                    ) => setPaymentCycle(val)}
                                >
                                    <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-full cursor-pointer text-xs tracking-widest sm:text-base">
                                        <SelectValue
                                            placeholder={t("monthly")}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="tracking-wider">
                                        <SelectItem value="monthly">
                                            Monthly
                                        </SelectItem>
                                        <SelectItem value="yearly">
                                            Yearly
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <button
                                onClick={() => setAnalyzedData(null)}
                                className="bg-subflow-600 text-subflow-50 mt-6 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-3 text-xs tracking-widest sm:text-base"
                            >
                                Re-analyze
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
