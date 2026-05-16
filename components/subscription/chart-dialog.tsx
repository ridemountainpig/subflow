"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    BarChart3,
    CalendarDays,
    ChartPie,
    Gauge,
    TrendingUp,
    Wallet,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";

import { useIsMobile } from "@/app/hooks/useIsMobile";
import { usePreferences } from "@/app/contexts/PreferencesContext";
import { SubscriptionWithPrice } from "@/types/subscription";
import FormattedNumber from "@/components/subscription/formatted-number";
import {
    toDisplayMonthlyAmount,
    totalSpendSinceStart,
    subscriptionVisibleInMonth,
} from "@/utils/subscriptionCycle";
import {
    calculateMonthsFromStart,
    getNextRenewalDate,
    daysBetween,
    formatTrendMonthLabel,
    getEffectiveConvertedPrice,
} from "./chart-dialog-utils";
import {
    CustomLabel,
    SubscriptionListItem,
    StatCard,
    CycleCard,
    SectionHeader,
    InsightCard,
    tabBtnClass,
    modeBtnClass,
} from "./chart-dialog-ui";

type Tab = "breakdown" | "analytics";
type TrendMode = "avg" | "cashflow";

interface ChartDialogProps {
    subscription: SubscriptionWithPrice[];
    allSubscription: SubscriptionWithPrice[];
    monthSpend: number;
    currency: string;
}

export default function ChartDialog({
    subscription,
    allSubscription,
    monthSpend,
    currency,
}: ChartDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0);
    const [tab, setTab] = useState<Tab>("breakdown");
    const [trendMode, setTrendMode] = useState<TrendMode>("avg");
    const chartRef = useRef<HTMLDivElement>(null);
    const t = useTranslations("SubscriptionPage");
    const locale = useLocale();
    const isMobile = useIsMobile();
    const { notAmortizeYearlySubscriptions } = usePreferences();
    const { user } = useUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress
        ?.toLowerCase()
        .trim();

    const effectiveSubscriptions = useMemo(() => {
        return subscription
            .map((sub) => {
                const effective = getEffectiveConvertedPrice(
                    sub,
                    currency,
                    userEmail,
                );
                return effective == null
                    ? null
                    : { ...sub, convertedPrice: effective };
            })
            .filter((sub): sub is SubscriptionWithPrice => sub !== null);
    }, [subscription, currency, userEmail]);

    // Analytics needs the full dataset (independent of the active month and
    // the notAmortizeYearlySubscriptions toggle) so trends/totals/renewals
    // don't shift when the user browses months.
    const effectiveAllSubscriptions = useMemo(() => {
        return allSubscription
            .map((sub) => {
                const effective = getEffectiveConvertedPrice(
                    sub,
                    currency,
                    userEmail,
                );
                return effective == null
                    ? null
                    : { ...sub, convertedPrice: effective };
            })
            .filter((sub): sub is SubscriptionWithPrice => sub !== null);
    }, [allSubscription, currency, userEmail]);

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
            effectiveSubscriptions.map((item) => {
                const displayPrice = toDisplayMonthlyAmount(
                    item.convertedPrice,
                    item.paymentCycle,
                    notAmortizeYearlySubscriptions,
                );

                const monthlyPrice = Math.round(displayPrice);
                const monthsFromStart = calculateMonthsFromStart(
                    item.startDate,
                );

                return {
                    name: item.name,
                    serviceId: item.serviceId || "",
                    value: monthlyPrice,
                    currency,
                    percentage:
                        monthSpend > 0
                            ? ((monthlyPrice / monthSpend) * 100).toFixed(1)
                            : "0.0",
                    paymentCycle: item.paymentCycle,
                    startDate: item.startDate,
                    totalSpend: totalSpendSinceStart(
                        monthlyPrice,
                        item.paymentCycle,
                        notAmortizeYearlySubscriptions,
                        monthsFromStart,
                    ),
                };
            }),
        [
            effectiveSubscriptions,
            monthSpend,
            currency,
            notAmortizeYearlySubscriptions,
        ],
    );

    const sortedData = useMemo(
        () =>
            [...data].sort(
                (a, b) => Number(b.percentage) - Number(a.percentage),
            ),
        [data],
    );

    const trendData = useMemo(() => {
        const now = new Date();
        const isCashFlow = trendMode === "cashflow";
        return Array.from({ length: 12 }, (_, i) => {
            const offset = 11 - i;
            const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
            const y = d.getFullYear();
            const m = d.getMonth() + 1;
            const label = formatTrendMonthLabel(d, locale);
            const rawAmount = effectiveAllSubscriptions
                .filter((sub) =>
                    subscriptionVisibleInMonth(sub, y, m, isCashFlow),
                )
                .reduce((sum, sub) => {
                    const val = isCashFlow
                        ? sub.convertedPrice
                        : toDisplayMonthlyAmount(
                              sub.convertedPrice,
                              sub.paymentCycle,
                              false,
                          );
                    return sum + val;
                }, 0);
            const isCurrentMonth =
                y === now.getFullYear() && m === now.getMonth() + 1;
            return { label, amount: Math.round(rawAmount), isCurrentMonth };
        });
    }, [effectiveAllSubscriptions, trendMode, locale]);

    const statsData = useMemo(() => {
        const currentYear = new Date().getFullYear();
        let totalSpentEver = 0;
        let newThisYear = 0;
        let amortizedMonthly = 0;
        const cycles = {
            monthly: { count: 0, spend: 0 },
            quarterly: { count: 0, spend: 0 },
            yearly: { count: 0, spend: 0 },
        };

        for (const sub of effectiveAllSubscriptions) {
            if (sub.startDate.year === currentYear) newThisYear++;

            const displayPrice = toDisplayMonthlyAmount(
                sub.convertedPrice,
                sub.paymentCycle,
                notAmortizeYearlySubscriptions,
            );
            const amortizedPrice = toDisplayMonthlyAmount(
                sub.convertedPrice,
                sub.paymentCycle,
                false,
            );
            amortizedMonthly += amortizedPrice;
            const months = calculateMonthsFromStart(sub.startDate);
            totalSpentEver += totalSpendSinceStart(
                displayPrice,
                sub.paymentCycle,
                notAmortizeYearlySubscriptions,
                months,
            );

            const cycleKey = sub.paymentCycle as keyof typeof cycles;
            if (cycleKey in cycles) {
                cycles[cycleKey].count++;
                cycles[cycleKey].spend += amortizedPrice;
            }
        }

        const roundedCycles = {
            monthly: {
                count: cycles.monthly.count,
                spend: Math.round(cycles.monthly.spend),
            },
            quarterly: {
                count: cycles.quarterly.count,
                spend: Math.round(cycles.quarterly.spend),
            },
            yearly: {
                count: cycles.yearly.count,
                spend: Math.round(cycles.yearly.spend),
            },
        };

        const cycleSpendTotal =
            roundedCycles.monthly.spend +
            roundedCycles.quarterly.spend +
            roundedCycles.yearly.spend;
        const cycleShare = (spend: number) =>
            cycleSpendTotal > 0
                ? Math.round((spend / cycleSpendTotal) * 100)
                : 0;

        return {
            annualSpend: Math.round(amortizedMonthly * 12),
            dailyRate: Math.round((amortizedMonthly / 30) * 10) / 10,
            totalCount: effectiveAllSubscriptions.length,
            totalSpentEver: Math.round(totalSpentEver),
            avgPerSub:
                effectiveAllSubscriptions.length > 0
                    ? Math.round(
                          amortizedMonthly / effectiveAllSubscriptions.length,
                      )
                    : 0,
            newThisYear,
            cycles: {
                monthly: {
                    ...roundedCycles.monthly,
                    share: cycleShare(roundedCycles.monthly.spend),
                },
                quarterly: {
                    ...roundedCycles.quarterly,
                    share: cycleShare(roundedCycles.quarterly.spend),
                },
                yearly: {
                    ...roundedCycles.yearly,
                    share: cycleShare(roundedCycles.yearly.spend),
                },
            },
        };
    }, [effectiveAllSubscriptions, notAmortizeYearlySubscriptions]);

    const analyticsInsights = useMemo(() => {
        const now = new Date();
        const dateFormatter = new Intl.DateTimeFormat(locale, {
            month: "short",
            day: "numeric",
        });
        const upcoming = effectiveAllSubscriptions
            .map((sub) => {
                const renewalDate = getNextRenewalDate(sub, now);
                return {
                    name: sub.name,
                    date: renewalDate,
                    daysAway: daysBetween(now, renewalDate),
                    amount: sub.convertedPrice,
                };
            })
            .filter((item) => item.daysAway <= 30)
            .sort((a, b) => a.daysAway - b.daysAway);
        const upcomingTotal = upcoming.reduce(
            (sum, item) => sum + item.amount,
            0,
        );
        const topSubscription = sortedData[0];
        const previousMonthAmount =
            trendData[trendData.length - 2]?.amount ?? 0;
        const currentMonthAmount = trendData[trendData.length - 1]?.amount ?? 0;
        const monthlyDelta = currentMonthAmount - previousMonthAmount;
        const monthlyDeltaPercent =
            previousMonthAmount > 0
                ? Math.round((monthlyDelta / previousMonthAmount) * 100)
                : currentMonthAmount > 0
                  ? 100
                  : 0;

        const annualCandidates = effectiveAllSubscriptions
            .filter(
                (sub) =>
                    sub.paymentCycle !== "yearly" &&
                    calculateMonthsFromStart(sub.startDate) > 12,
            )
            .sort(
                (a, b) =>
                    calculateMonthsFromStart(b.startDate) -
                    calculateMonthsFromStart(a.startDate),
            );

        return {
            topSubscription,
            upcoming,
            upcomingTotal: Math.round(upcomingTotal),
            upcomingLabel:
                upcoming.length > 0
                    ? `${upcoming[0].name} · ${dateFormatter.format(upcoming[0].date)}`
                    : t("chartDialog.noUpcomingRenewals"),
            monthlyDelta,
            monthlyDeltaPercent,
            annualCandidates,
            annualCandidateCount: annualCandidates.length,
        };
    }, [effectiveAllSubscriptions, sortedData, trendData, locale, t]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
                title={t("chartDialog.title")}
                className="focus-visible:ring-subflow-300/80 rounded-full focus-visible:ring-2 focus-visible:outline-none"
            >
                <ChartPie className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
            </DialogTrigger>
            <DialogContent
                showCloseButton={isMobile}
                className={`bg-subflow-900 fixed inset-0 top-0 left-0 flex w-screen max-w-none translate-x-0 translate-y-0 flex-col rounded-none border-none sm:max-w-none ${isMobile ? "h-full overflow-y-auto p-5" : "h-screen items-center justify-center p-8"}`}
            >
                <DialogTitle className="sr-only">
                    {t("chartDialog.title")}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {t("chartDialog.overviewDescription")}
                </DialogDescription>

                <div className="bg-subflow-800/70 border-subflow-700/70 flex w-fit justify-center gap-1 rounded-full border p-1">
                    <button
                        className={tabBtnClass(tab === "breakdown")}
                        onClick={() => setTab("breakdown")}
                    >
                        {t("chartDialog.tabs.breakdown")}
                    </button>
                    <button
                        className={tabBtnClass(tab === "analytics")}
                        onClick={() => setTab("analytics")}
                    >
                        {t("chartDialog.tabs.analytics")}
                    </button>
                </div>

                {tab === "breakdown" &&
                    (() => {
                        // Dialog uses p-5 on mobile (20px padding each side); reserve
                        // that space so the chart never overflows the content area.
                        const mobileChartSize = Math.max(screenWidth - 40, 0);
                        return (
                            <div
                                className={`flex items-center ${isMobile ? "flex-col" : ""}`}
                                ref={chartRef}
                            >
                                <div
                                    className="pointer-events-none select-none"
                                    style={
                                        isMobile && mobileChartSize > 0
                                            ? {
                                                  height: `${mobileChartSize}px`,
                                                  width: `${mobileChartSize}px`,
                                              }
                                            : !isMobile
                                              ? {
                                                    height: "600px",
                                                    width: "600px",
                                                }
                                              : {}
                                    }
                                >
                                    {(!isMobile || mobileChartSize > 0) && (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={
                                                        data.length > 0
                                                            ? data
                                                            : [
                                                                  {
                                                                      name: "",
                                                                      value: 1,
                                                                      percentage:
                                                                          "100.0",
                                                                  },
                                                              ]
                                                    }
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={
                                                        isMobile
                                                            ? mobileChartSize /
                                                                  3 -
                                                              10
                                                            : 190
                                                    }
                                                    outerRadius={
                                                        isMobile
                                                            ? mobileChartSize /
                                                                  3 +
                                                              20
                                                            : 220
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
                                                    {sortedData.length ===
                                                        0 && (
                                                        <text
                                                            x="50%"
                                                            y="62%"
                                                            textAnchor="middle"
                                                            dominantBaseline="middle"
                                                            className="fill-subflow-50 text-xl tracking-widest"
                                                        >
                                                            {t(
                                                                "noSubscription",
                                                            )}
                                                        </text>
                                                    )}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
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
                                                {t(
                                                    "subscriptionListDescription",
                                                )}
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
                        );
                    })()}

                {tab === "analytics" && (
                    <div
                        className={`custom-scrollbar flex flex-col gap-5 overflow-y-auto ${isMobile ? "w-full pb-2" : "max-h-[calc(100vh-160px)] w-[860px] pr-2"}`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className="text-subflow-400 text-xs tracking-[0.18em] uppercase">
                                {t("chartDialog.overviewEyebrow")}
                            </span>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-subflow-50 text-2xl tracking-wider">
                                        {t("chartDialog.overviewTitle")}
                                    </h2>
                                    <p className="text-subflow-400 max-w-[560px] text-sm leading-relaxed tracking-wider">
                                        {t("chartDialog.overviewDescription")}
                                    </p>
                                </div>
                                <div className="bg-subflow-800/70 border-subflow-700/70 flex w-fit shrink-0 gap-1 rounded-full border p-1">
                                    <button
                                        className={modeBtnClass(
                                            trendMode === "avg",
                                        )}
                                        onClick={() => setTrendMode("avg")}
                                    >
                                        {t("chartDialog.monthlyAvg")}
                                    </button>
                                    <button
                                        className={modeBtnClass(
                                            trendMode === "cashflow",
                                        )}
                                        onClick={() => setTrendMode("cashflow")}
                                    >
                                        {t("chartDialog.cashFlow")}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="border-subflow-700/70 bg-subflow-800/35 flex flex-col gap-4 rounded-lg border p-4">
                            <SectionHeader
                                title={t("chartDialog.trendTitle")}
                                description={
                                    trendMode === "avg"
                                        ? t("chartDialog.trendDescriptionAvg")
                                        : t(
                                              "chartDialog.trendDescriptionCashFlow",
                                          )
                                }
                            />
                            <div
                                style={{
                                    height: isMobile ? "220px" : "300px",
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={trendData}
                                        margin={{
                                            top: 8,
                                            right: 8,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <XAxis
                                            dataKey="label"
                                            tick={{
                                                fill: "#a8a5a6",
                                                fontSize: 11,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={isMobile ? 1 : 0}
                                        />
                                        <YAxis
                                            tick={{
                                                fill: "#a8a5a6",
                                                fontSize: 11,
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                            width={48}
                                            tickFormatter={(v) =>
                                                v >= 1000
                                                    ? `${(v / 1000).toFixed(1)}k`
                                                    : String(v)
                                            }
                                        />
                                        <Tooltip
                                            content={({
                                                active,
                                                payload,
                                                label,
                                            }) => {
                                                if (
                                                    active &&
                                                    payload &&
                                                    payload.length
                                                ) {
                                                    return (
                                                        <div className="bg-subflow-900 border-subflow-700 rounded-lg border px-3 py-2 shadow-lg">
                                                            <p className="text-subflow-300 text-xs">
                                                                {label}
                                                            </p>
                                                            <p className="text-subflow-50 text-sm">
                                                                <FormattedNumber
                                                                    value={
                                                                        payload[0]
                                                                            .value as number
                                                                    }
                                                                />{" "}
                                                                {currency}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ fill: "#bbb4ae22" }}
                                        />
                                        <Bar
                                            dataKey="amount"
                                            radius={[6, 6, 0, 0]}
                                        >
                                            {trendData.map((entry, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        entry.isCurrentMonth
                                                            ? "#d0c8c0"
                                                            : "#666362"
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <StatCard
                                label={t("chartDialog.annualSpend")}
                                value={statsData.annualSpend}
                                sub={currency}
                                icon={<Wallet className="h-4 w-4" />}
                                tone="teal"
                            />
                            <StatCard
                                label={t("chartDialog.dailyRate")}
                                value={statsData.dailyRate}
                                sub={currency}
                                icon={<Gauge className="h-4 w-4" />}
                            />
                            <StatCard
                                label={t("chartDialog.totalSubscriptions")}
                                value={statsData.totalCount}
                                icon={<BarChart3 className="h-4 w-4" />}
                            />
                            <StatCard
                                label={t("chartDialog.totalSpentEver")}
                                value={statsData.totalSpentEver}
                                sub={currency}
                                icon={<TrendingUp className="h-4 w-4" />}
                                tone="amber"
                            />
                            <StatCard
                                label={t("chartDialog.avgPerSub")}
                                value={statsData.avgPerSub}
                                sub={currency}
                                icon={<Wallet className="h-4 w-4" />}
                            />
                            <StatCard
                                label={t("chartDialog.newThisYear")}
                                value={statsData.newThisYear}
                                icon={<CalendarDays className="h-4 w-4" />}
                            />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <InsightCard
                                label={t("chartDialog.largestShare")}
                                value={
                                    analyticsInsights.topSubscription ? (
                                        <span className="block truncate">
                                            {
                                                analyticsInsights
                                                    .topSubscription.name
                                            }{" "}
                                            ·{" "}
                                            {
                                                analyticsInsights
                                                    .topSubscription.percentage
                                            }
                                            %
                                        </span>
                                    ) : (
                                        t("noSubscription")
                                    )
                                }
                                description={t(
                                    "chartDialog.largestShareDescription",
                                )}
                                icon={<BarChart3 className="h-4 w-4" />}
                                tone="teal"
                            />
                            <InsightCard
                                label={t("chartDialog.renewalsNext30Days")}
                                value={
                                    <span className="block truncate">
                                        {analyticsInsights.upcomingLabel}
                                    </span>
                                }
                                description={
                                    analyticsInsights.upcoming.length > 0
                                        ? t(
                                              "chartDialog.renewalsNext30DaysDescription",
                                              {
                                                  count: analyticsInsights
                                                      .upcoming.length,
                                                  amount: analyticsInsights.upcomingTotal,
                                                  currency,
                                              },
                                          )
                                        : t(
                                              "chartDialog.noUpcomingRenewalsDescription",
                                          )
                                }
                                icon={<CalendarDays className="h-4 w-4" />}
                                tone="amber"
                            />
                            <InsightCard
                                label={t("chartDialog.previousMonthDelta")}
                                value={
                                    <span
                                        className={
                                            analyticsInsights.monthlyDelta > 0
                                                ? "text-subflow-100"
                                                : analyticsInsights.monthlyDelta <
                                                    0
                                                  ? "text-subflow-300"
                                                  : "text-subflow-50"
                                        }
                                    >
                                        {analyticsInsights.monthlyDelta > 0
                                            ? "+"
                                            : ""}
                                        {analyticsInsights.monthlyDeltaPercent}%
                                    </span>
                                }
                                description={t(
                                    analyticsInsights.monthlyDelta > 0
                                        ? "chartDialog.deltaIncreaseDescription"
                                        : analyticsInsights.monthlyDelta < 0
                                          ? "chartDialog.deltaDecreaseDescription"
                                          : "chartDialog.deltaFlatDescription",
                                )}
                                icon={<TrendingUp className="h-4 w-4" />}
                            />
                            <InsightCard
                                label={t("chartDialog.annualUpgradeHint")}
                                value={
                                    analyticsInsights.annualCandidateCount >
                                    0 ? (
                                        <span className="block truncate">
                                            {
                                                analyticsInsights
                                                    .annualCandidates[0].name
                                            }
                                            {analyticsInsights.annualCandidateCount >
                                                1 &&
                                                ` +${analyticsInsights.annualCandidateCount - 1}`}
                                        </span>
                                    ) : (
                                        "—"
                                    )
                                }
                                description={
                                    analyticsInsights.annualCandidateCount > 0
                                        ? t(
                                              "chartDialog.annualUpgradeHintDescription",
                                              {
                                                  count: analyticsInsights.annualCandidateCount,
                                              },
                                          )
                                        : t(
                                              "chartDialog.annualUpgradeHintNoneDescription",
                                          )
                                }
                                icon={<TrendingUp className="h-4 w-4" />}
                                tone="amber"
                            />
                        </div>
                        <div className="flex flex-col gap-3 pb-2">
                            <SectionHeader
                                title={t("chartDialog.cycleBreakdown")}
                                description={t(
                                    "chartDialog.cycleBreakdownDescription",
                                )}
                            />
                            <div className="grid gap-3 sm:grid-cols-3">
                                <CycleCard
                                    label={t("monthly")}
                                    count={statsData.cycles.monthly.count}
                                    spend={statsData.cycles.monthly.spend}
                                    share={statsData.cycles.monthly.share}
                                    currency={currency}
                                    subsLabel={t("chartDialog.subs")}
                                />
                                <CycleCard
                                    label={t("quarterly")}
                                    count={statsData.cycles.quarterly.count}
                                    spend={statsData.cycles.quarterly.spend}
                                    share={statsData.cycles.quarterly.share}
                                    currency={currency}
                                    subsLabel={t("chartDialog.subs")}
                                />
                                <CycleCard
                                    label={t("yearly")}
                                    count={statsData.cycles.yearly.count}
                                    spend={statsData.cycles.yearly.spend}
                                    share={statsData.cycles.yearly.share}
                                    currency={currency}
                                    subsLabel={t("chartDialog.subs")}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-subflow-800 text-subflow-50 hover:bg-subflow-700 focus-visible:ring-subflow-300/80 cursor-pointer rounded-full px-4 py-2 tracking-widest select-none focus-visible:ring-2 focus-visible:outline-none"
                    >
                        {t("close")}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
