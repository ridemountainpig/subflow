"use client";

import { ComponentType, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PieLabelRenderProps } from "recharts";
import { Repeat } from "lucide-react";

import { subscriptionServices } from "@/data/subscriptionServices";
import FormattedNumber from "@/components/subscription/formatted-number";

export interface SubscriptionItemProps {
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

export const ServiceIcon = ({
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

export const CustomLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;

    if (
        cx == null ||
        cy == null ||
        midAngle == null ||
        innerRadius == null ||
        outerRadius == null ||
        !payload
    ) {
        return null;
    }

    const { serviceId, name } = payload as { serviceId: string; name: string };
    const RADIAN = Math.PI / 180;
    const inner = innerRadius as number;
    const outer = outerRadius as number;
    const radius = inner + (outer - inner) * 2;
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

export const SubscriptionListItem = ({
    item,
}: {
    item: SubscriptionItemProps;
}) => {
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

export const StatCard = ({
    label,
    value,
    sub,
    icon,
    tone = "neutral",
}: {
    label: string;
    value: number;
    sub?: string;
    icon: ReactNode;
    tone?: "neutral" | "teal" | "amber";
}) => (
    <div className="border-subflow-700/70 bg-subflow-800/70 flex min-h-[104px] flex-col justify-between rounded-lg border p-4">
        <div className="flex items-start justify-between gap-3">
            <span className="text-subflow-300 text-xs leading-snug tracking-wider">
                {label}
            </span>
            <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    tone === "teal"
                        ? "bg-subflow-600/40 text-subflow-50"
                        : tone === "amber"
                          ? "bg-subflow-700 text-subflow-100"
                          : "bg-subflow-700 text-subflow-200"
                }`}
            >
                {icon}
            </span>
        </div>
        <div className="text-subflow-50 flex min-w-0 items-end gap-1">
            <FormattedNumber value={value} className="truncate text-2xl" />
            {sub && (
                <span className="text-subflow-400 mb-1 text-xs">{sub}</span>
            )}
        </div>
    </div>
);

export const CycleCard = ({
    label,
    count,
    spend,
    share,
    currency,
    subsLabel,
}: {
    label: string;
    count: number;
    spend: number;
    share: number;
    currency: string;
    subsLabel: string;
}) => (
    <div className="border-subflow-700/70 bg-subflow-800/50 flex min-w-0 flex-1 flex-col gap-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
            <span className="text-subflow-300 truncate text-xs tracking-wider">
                {label}
            </span>
            <Repeat className="text-subflow-500 h-4 w-4 shrink-0" />
        </div>
        <div className="flex items-baseline gap-1">
            <span className="text-subflow-50 text-2xl">{count}</span>
            <span className="text-subflow-500 text-xs">{subsLabel}</span>
        </div>
        <div className="bg-subflow-700 h-1.5 rounded-full">
            <div
                className="bg-subflow-200 h-1.5 rounded-full"
                style={{ width: `${share}%` }}
            />
        </div>
        <div className="text-subflow-300 min-w-0 text-sm">
            <FormattedNumber value={spend} /> {currency}
        </div>
    </div>
);

export const SectionHeader = ({
    title,
    description,
}: {
    title: string;
    description?: string;
}) => (
    <div className="flex flex-col gap-1">
        <h3 className="text-subflow-50 text-base tracking-wider">{title}</h3>
        {description && (
            <p className="text-subflow-400 text-xs leading-relaxed tracking-wider">
                {description}
            </p>
        )}
    </div>
);

export const InsightCard = ({
    label,
    value,
    description,
    icon,
    tone = "neutral",
}: {
    label: string;
    value: ReactNode;
    description: string;
    icon: ReactNode;
    tone?: "neutral" | "teal" | "amber";
}) => (
    <div className="border-subflow-700/70 bg-subflow-800/50 flex gap-3 rounded-lg border p-4">
        <span
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                tone === "teal"
                    ? "bg-subflow-600/40 text-subflow-50"
                    : tone === "amber"
                      ? "bg-subflow-700 text-subflow-100"
                      : "bg-subflow-700 text-subflow-200"
            }`}
        >
            {icon}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
            <span className="text-subflow-300 text-xs tracking-wider">
                {label}
            </span>
            <div className="text-subflow-50 min-w-0 text-lg leading-tight">
                {value}
            </div>
            <p className="text-subflow-400 text-xs leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);

export const tabBtnClass = (active: boolean) =>
    `inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm tracking-wider cursor-pointer transition-colors select-none focus-visible:ring-subflow-300/80 focus-visible:ring-2 focus-visible:outline-none ${
        active
            ? "bg-subflow-50 text-subflow-900"
            : "bg-subflow-800 text-subflow-300 hover:bg-subflow-700"
    }`;

export const modeBtnClass = (active: boolean) =>
    `inline-flex items-center justify-center rounded-full px-3 py-1 text-xs tracking-wider cursor-pointer transition-colors select-none focus-visible:ring-subflow-300/80 focus-visible:ring-2 focus-visible:outline-none ${
        active
            ? "bg-subflow-50 text-subflow-900"
            : "bg-subflow-800 text-subflow-300 hover:bg-subflow-700"
    }`;
