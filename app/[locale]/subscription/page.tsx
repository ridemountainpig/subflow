"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { CircleArrowLeft, CircleArrowRight, LoaderCircle } from "lucide-react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useCalendar } from "@/app/hooks/useCalendar";
import { useCurrency } from "@/app/contexts/CurrencyContext";
import { useSubscription } from "@/app/hooks/useSubscription";
import { useFirstLogin } from "@/app/hooks/useFirstLogin";

import FormattedNumber from "@/components/subscription/formatted-number";
import CalendarCell from "@/components/subscription/calendar-cell";
import AddSubscriptionDialog from "@/components/subscription/add-subscription-dialog";
import ChartDialog from "@/components/subscription/chart-dialog";
import CoSubscriberInvite from "@/components/subscription/co-subscriber-invite";
import DescriptionDialog from "@/components/subscription/description-dialog";
import NewFeatureNotify from "@/components/new-feature-notify";

export default function Subscription() {
    const { userId } = useAuth();
    const t = useTranslations("SubscriptionPage");
    const { year, month, calendar, handlePreviousMonth, handleNextMonth } =
        useCalendar();
    const { currenciesList, currency, setCurrency, currencyListLoading } =
        useCurrency();
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const {
        subscriptions,
        monthlySpend,
        updatedSubscription,
        setUpdatedSubscription,
    } = useSubscription(year, month, currency, currencyListLoading);
    useFirstLogin();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-subflow-900 relative flex h-full min-h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-y-auto select-none sm:min-h-[calc(100vh-7.25rem)]">
            <NewFeatureNotify />
            <DescriptionDialog />
            {calendar.length > 0 && (
                <div className="w-fit">
                    <div className="flex items-end justify-between pt-10 pb-2 sm:pb-4">
                        <div className="flex items-center gap-x-1 sm:gap-x-3">
                            <CircleArrowLeft
                                className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]"
                                onClick={handlePreviousMonth}
                            />
                            <CircleArrowRight
                                className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]"
                                onClick={handleNextMonth}
                            />
                            <span className="text-subflow-50 text-xl tracking-widest sm:text-3xl">
                                {new Date(year, month - 1).toLocaleString(
                                    "en-US",
                                    {
                                        month: "short",
                                    },
                                )}
                            </span>
                            <span className="text-subflow-400 text-xl tracking-widest sm:text-3xl">
                                {year}
                            </span>
                            <AddSubscriptionDialog
                                userId={userId || ""}
                                onSuccess={() =>
                                    setUpdatedSubscription(!updatedSubscription)
                                }
                            />
                            <ChartDialog
                                subscription={subscriptions}
                                monthSpend={monthlySpend || 0}
                                currency={currency}
                            />
                            <CoSubscriberInvite
                                setUpdatedSubscription={setUpdatedSubscription}
                            />
                        </div>
                        <div className="flex h-13 flex-col items-end sm:min-h-16">
                            <span className="text-subflow-50 text-xs tracking-widest sm:text-base">
                                {t("monthlySpend")}
                            </span>
                            <div className="text-subflow-50 flex items-center gap-x-1 text-xl tracking-widest sm:text-3xl">
                                {monthlySpend !== null ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.2,
                                            ease: "easeInOut",
                                        }}
                                        className="flex items-center gap-x-1"
                                    >
                                        <FormattedNumber
                                            value={monthlySpend}
                                            className="text-lg sm:text-3xl"
                                        />
                                        <Select
                                            value={currency}
                                            open={isSelectOpen}
                                            onOpenChange={setIsSelectOpen}
                                            onValueChange={(value) => {
                                                if (isSelectOpen) {
                                                    setCurrency(value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger
                                                className="cursor-pointer items-end gap-x-1 border-none p-0 pb-[10px] text-xs tracking-widest focus-visible:ring-0 sm:pb-1 sm:text-base"
                                                iconStyle="text-subflow-50 stroke-3"
                                                onKeyDown={(
                                                    e: React.KeyboardEvent,
                                                ) => {
                                                    if (
                                                        isSelectOpen &&
                                                        /^[a-zA-Z]$/.test(e.key)
                                                    ) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            >
                                                <SelectValue placeholder="Select Currency" />
                                                <SelectContent className="min-w-[--trigger-width] tracking-widest">
                                                    {Object.keys(
                                                        currenciesList.currencies,
                                                    ).map((key) => (
                                                        <SelectItem
                                                            key={key}
                                                            value={key}
                                                            className="cursor-pointer"
                                                        >
                                                            {key}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </SelectTrigger>
                                        </Select>
                                    </motion.div>
                                ) : (
                                    <LoaderCircle
                                        strokeWidth={2.5}
                                        className="mt-2 size-6 animate-spin sm:size-[30px]"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid h-fit w-fit grid-cols-7 gap-1 pb-10 sm:gap-2 md:gap-3">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="bg-subflow-500 col-span-1 flex h-8 items-center justify-center rounded-2xl sm:h-10 sm:rounded-full"
                            >
                                <span className="text-subflow-50 text-xs sm:text-base">
                                    {day}
                                </span>
                            </div>
                        ))}
                        {calendar.map((day) => {
                            const filterSubscription = subscriptions.filter(
                                (subscription) => {
                                    const currentDate = parseInt(
                                        day.date.split("-")[2],
                                    );
                                    const isLastDay =
                                        currentDate ===
                                        new Date(year, month, 0).getDate();
                                    return (
                                        (subscription.startDate.date.toString() ===
                                            currentDate.toString() ||
                                            (isLastDay &&
                                                subscription.startDate.date >
                                                    currentDate)) &&
                                        day.isCurrentMonth
                                    );
                                },
                            );
                            return (
                                <CalendarCell
                                    key={day.date}
                                    day={day}
                                    subscription={filterSubscription}
                                    currenciesList={currenciesList}
                                    updatedSubscription={updatedSubscription}
                                    setUpdatedSubscription={
                                        setUpdatedSubscription
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
