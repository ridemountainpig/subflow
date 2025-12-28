"use client";

import { useState, useEffect, ComponentType, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    PieLabelRenderProps,
} from "recharts";
import { ChartPie } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { usePreferences } from "@/app/contexts/PreferencesContext";
import { SubscriptionWithPrice } from "@/types/subscription";
import { subscriptionServices } from "@/data/subscriptionServices";
import FormattedNumber from "@/components/subscription/formatted-number";

interface ChartDialogProps {
    subscription: SubscriptionWithPrice[];
    monthSpend: number;
    currency: string;
}

interface SubscriptionItemProps {
    name: string;
    serviceId: string;
    value: number;
    currency: string;
    percentage: string;
    paymentCycle: string;
    startDate: {
        year: number;
        month: number;
        date: number;
    };
    totalSpend: number;
}

const calculateMonthsFromStart = (startDate: {
    year: number;
    month: number;
    date: number;
}) => {
    const now = new Date();
    const monthDiff =
        (now.getFullYear() - startDate.year) * 12 +
        (now.getMonth() + 1 - startDate.month);
    return Math.max(1, monthDiff);
};

const ServiceIcon = ({
    serviceId,
    name,
}: {
    serviceId: string;
    name: string;
}) => {
    const Icon = subscriptionServices.find(
        (service) => service.uuid === serviceId,
    )?.icon as ComponentType<{ className?: string }>;

    return (
        <div className="flex h-8 w-8 items-center justify-center">
            {Icon ? (
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
                <span className="text-subflow-50 text-2xl font-bold">
                    {name.charAt(0).toUpperCase()}
                </span>
            )}
        </div>
    );
};

const CustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

    if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !payload) {
        return null;
    }

    const { serviceId, name } = payload as { serviceId: string; name: string };
    const RADIAN = Math.PI / 180;
    const radius =
        (innerRadius as number) +
        ((outerRadius as number) - (innerRadius as number)) * 2;
    const x =
        (cx as number) + radius * Math.cos(-(midAngle as number) * RADIAN);
    const y =
        (cy as number) + radius * Math.sin(-(midAngle as number) * RADIAN);

    return (
        <g>
            <foreignObject
                x={x - 16}
                y={y - 16}
                width={32}
                height={32}
                style={{ overflow: "visible" }}
            >
                <ServiceIcon serviceId={serviceId || ""} name={name} />
            </foreignObject>
        </g>
    );
};

const SubscriptionListItem = ({ item }: { item: SubscriptionItemProps }) => {
    const t = useTranslations("SubscriptionPage");

    return (
        <div className="bg-subflow-800 hover:bg-subflow-700 flex items-center gap-4 rounded-xl p-4 transition-colors">
            <ServiceIcon serviceId={item.serviceId} name={item.name} />
            <div className="flex flex-1 flex-col gap-1.5">
                <span className="text-subflow-50 text-lg">{item.name}</span>
                <div className="flex items-center justify-between">
                    <span className="text-subflow-300">{item.percentage}%</span>
                    <span className="text-subflow-50">
                        <FormattedNumber value={item.value} /> {item.currency}
                    </span>
                </div>
                <hr className="border-subflow-600 border" />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-subflow-300 text-sm">
                            {t("totalSpend")}
                        </span>
                        <span className="text-subflow-500 -mt-1 text-[11px] tracking-wider">
                            {t("since")} {item.startDate.month} /{" "}
                            {item.startDate.year}
                        </span>
                    </div>
                    <span className="text-subflow-50">
                        <FormattedNumber value={item.totalSpend} />{" "}
                        {item.currency}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default function ChartDialog({
    subscription,
    monthSpend,
    currency,
}: ChartDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);
    const chartRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("SubscriptionPage");
    const isMobile = useIsMobile();
    const { notAmortizeYearlySubscriptions } = usePreferences();

    useEffect(() => {
        const updateScreenWidth = () => {
            setScreenWidth(window.innerWidth);
        };

        updateScreenWidth();

        window.addEventListener("resize", updateScreenWidth);

        return () => {
            window.removeEventListener("resize", updateScreenWidth);
        };
    }, []);

    const data = useMemo(
        () =>
            subscription.map((item) => {
                let displayPrice = item.convertedPrice;

                if (
                    item.paymentCycle === "yearly" &&
                    !notAmortizeYearlySubscriptions
                ) {
                    displayPrice = displayPrice / 12;
                }

                const monthlyPrice = Math.round(displayPrice);
                const monthsFromStart = calculateMonthsFromStart(
                    item.startDate,
                );

                return {
                    name: item.name,
                    serviceId: item.serviceId || "",
                    value: monthlyPrice,
                    currency,
                    percentage: ((monthlyPrice / monthSpend) * 100).toFixed(1),
                    paymentCycle: item.paymentCycle,
                    startDate: item.startDate,
                    totalSpend: monthlyPrice * monthsFromStart,
                };
            }),
        [subscription, monthSpend, currency, notAmortizeYearlySubscriptions],
    );

    const sortedData = useMemo(
        () =>
            [...data].sort(
                (a, b) => Number(b.percentage) - Number(a.percentage),
            ),
        [data],
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger title={t("chartDialog.title")}>
                <ChartPie className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
            </DialogTrigger>
            <DialogContent
                showCloseButton={isMobile ? true : false}
                className={`bg-subflow-900 flex min-w-screen flex-col rounded-none border-none ${isMobile ? "h-full overflow-y-auto" : "h-screen items-center justify-center"}`}
            >
                <DialogTitle></DialogTitle>
                <DialogDescription></DialogDescription>
                <div
                    className={`flex items-center ${isMobile && "flex-col"}`}
                    ref={chartRef}
                >
                    <div
                        className="pointer-events-none select-none"
                        style={
                            isMobile && screenWidth > 0
                                ? {
                                      height: `${screenWidth}px`,
                                      width: `${screenWidth}px`,
                                  }
                                : !isMobile
                                  ? { height: "600px", width: "600px" }
                                  : {}
                        }
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={
                                        data.length > 0
                                            ? data
                                            : [
                                                  {
                                                      name: "",
                                                      value: 1,
                                                      percentage: "100.0",
                                                  },
                                              ]
                                    }
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={
                                        isMobile ? screenWidth / 3 - 10 : 190
                                    }
                                    outerRadius={
                                        isMobile ? screenWidth / 3 + 20 : 220
                                    }
                                    paddingAngle={2.5}
                                    dataKey="value"
                                    cornerRadius={6}
                                    stroke="#514f50"
                                    label={CustomLabel}
                                    labelLine={false}
                                    animationBegin={0}
                                    animationDuration={1000}
                                    animationEasing="ease-out"
                                >
                                    {data.map((item, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill="#514f50"
                                        />
                                    ))}
                                    <text
                                        x="50%"
                                        y="46%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-subflow-50 text-xl tracking-widest"
                                    >
                                        {t("monthlySpend")}
                                    </text>
                                    <text
                                        x="50%"
                                        y="54%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-subflow-50 text-4xl tracking-widest"
                                    >
                                        {monthSpend}
                                        <tspan
                                            className="text-lg"
                                            dy="4"
                                            dx="4"
                                        >
                                            {currency}
                                        </tspan>
                                    </text>
                                    {sortedData.length === 0 && (
                                        <text
                                            x="50%"
                                            y="62%"
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                            className="fill-subflow-50 text-xl tracking-widest"
                                        >
                                            {t("noSubscription")}
                                        </text>
                                    )}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    {sortedData.length > 0 && (
                        <div
                            className={`flex flex-col gap-4 select-none ${isMobile ? "w-full" : ""}`}
                        >
                            <span className="text-subflow-50 text-xl tracking-wider">
                                {t("subscriptionList")}
                            </span>
                            {!notAmortizeYearlySubscriptions && (
                                <span
                                    className={`text-subflow-300 -mt-2 text-xs tracking-wider ${isMobile ? "w-full" : "w-[300px]"}`}
                                >
                                    {t("subscriptionListDescription")}
                                </span>
                            )}
                            <div
                                className={`custom-scrollbar flex flex-col gap-3 overflow-y-auto ${isMobile ? "h-full w-full" : "h-[600px] w-[300px] pr-2"}`}
                            >
                                {sortedData.map((item, index) => (
                                    <SubscriptionListItem
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-subflow-800 text-subflow-50 hover:bg-subflow-700 cursor-pointer rounded-full px-4 py-2 tracking-widest select-none"
                    >
                        {t("close")}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
