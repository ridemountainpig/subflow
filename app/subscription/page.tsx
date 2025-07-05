"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
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
import CalendarCell from "@/components/subscription/calendar-cell";
import AddSubscriptionDialog from "@/components/subscription/add-subscription-dialog";
import ChartDialog from "@/components/subscription/chart-dialog";

export default function Subscription() {
    const { userId } = useAuth();
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
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-subflow-900 flex h-fit min-h-[calc(100vh-7.25rem)] w-full flex-col items-center justify-center select-none">
            {calendar.length > 0 && (
                <div className="w-fit">
                    <div className="flex items-end justify-between pb-4">
                        <div className="flex items-center gap-x-3">
                            <CircleArrowLeft
                                size={34}
                                className="text-subflow-50 cursor-pointer rounded-full"
                                onClick={handlePreviousMonth}
                            />
                            <CircleArrowRight
                                size={34}
                                className="text-subflow-50 cursor-pointer rounded-full"
                                onClick={handleNextMonth}
                            />
                            <span className="text-subflow-50 font-poetsen text-3xl tracking-widest">
                                {new Date(year, month - 1).toLocaleString(
                                    "en-US",
                                    {
                                        month: "short",
                                    },
                                )}
                            </span>
                            <span className="text-subflow-400 font-poetsen text-3xl tracking-widest">
                                {year}
                            </span>
                            <AddSubscriptionDialog
                                userId={userId || ""}
                                onSuccess={() =>
                                    setUpdatedSubscription(!updatedSubscription)
                                }
                            />
                        </div>
                        <div className="flex min-h-16 flex-col items-end">
                            <span className="text-subflow-50 font-poetsen text-base tracking-widest">
                                Monthly Spend
                            </span>
                            <div className="text-subflow-50 font-poetsen flex items-center gap-x-1 text-3xl tracking-widest">
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
                                        <span>{monthlySpend}</span>
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
                                                className="cursor-pointer items-end gap-x-1 border-none p-0 pb-1 text-base tracking-widest focus-visible:ring-0"
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
                                                <SelectContent className="font-poetsen min-w-[--trigger-width] tracking-widest">
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
                                        size={30}
                                        strokeWidth={2.5}
                                        className="mt-2 animate-spin"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="grid h-fit w-fit grid-cols-7 gap-x-3 gap-y-3 pb-10">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="bg-subflow-500 col-span-1 flex h-10 items-center justify-center rounded-full"
                            >
                                <span className="text-subflow-50 font-poetsen">
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
