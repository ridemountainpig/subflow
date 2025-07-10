"use client";

import { useState, ComponentType, useMemo } from "react";
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
} from "@/components/ui/dialog";
import { SubscriptionWithPrice } from "@/types/subscription";
import { subscriptionServices } from "@/data/subscriptionServices";

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
                <Icon className="h-7 w-7" />
            ) : (
                <span className="text-subflow-50 font-poetsen text-2xl font-bold">
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

const SubscriptionListItem = ({ item }: { item: SubscriptionItemProps }) => (
    <div className="bg-subflow-800 hover:bg-subflow-700 flex items-center gap-4 rounded-xl p-4 transition-colors">
        <ServiceIcon serviceId={item.serviceId} name={item.name} />
        <div className="flex flex-1 flex-col gap-1.5">
            <span className="text-subflow-50 text-lg">{item.name}</span>
            <div className="flex items-center justify-between">
                <span className="text-subflow-300">{item.percentage}%</span>
                <span className="text-subflow-50">
                    {item.value} {item.currency}
                </span>
            </div>
            <hr className="border-subflow-600 border-1" />
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-subflow-300 text-sm">
                        Total Spend
                    </span>
                    <span className="text-subflow-500 -mt-1 text-[11px] tracking-wider">
                        Since {item.startDate.month} / {item.startDate.year}
                    </span>
                </div>
                <span className="text-subflow-50">
                    {item.totalSpend} {item.currency}
                </span>
            </div>
        </div>
    </div>
);

export default function ChartDialog({
    subscription,
    monthSpend,
    currency,
}: ChartDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const data = useMemo(
        () =>
            subscription.map((item) => ({
                name: item.name,
                serviceId: item.serviceId || "",
                value: item.convertedPrice,
                currency,
                percentage: ((item.convertedPrice / monthSpend) * 100).toFixed(
                    1,
                ),
                startDate: item.startDate,
                totalSpend:
                    item.convertedPrice *
                    calculateMonthsFromStart(item.startDate),
            })),
        [subscription, monthSpend, currency],
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
            <DialogTrigger>
                <ChartPie
                    size={34}
                    className="text-subflow-50 cursor-pointer rounded-full"
                />
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="bg-subflow-900 font-poetsen flex h-screen min-w-screen flex-col items-center justify-center border-none"
            >
                <DialogTitle></DialogTitle>
                <div className="flex items-center">
                    <div className="pointer-events-none h-[600px] w-[600px] select-none">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={190}
                                    outerRadius={220}
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
                                        className="fill-subflow-50 font-poetsen text-xl tracking-widest"
                                    >
                                        Monthly Spend
                                    </text>
                                    <text
                                        x="50%"
                                        y="54%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="fill-subflow-50 font-poetsen text-4xl tracking-widest"
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
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-4 select-none">
                        <span className="text-subflow-50 text-xl tracking-wider">
                            Subscription List
                        </span>
                        <div className="custom-scrollbar flex h-[600px] w-[300px] flex-col gap-3 overflow-y-auto pr-2">
                            {sortedData.map((item, index) => (
                                <SubscriptionListItem key={index} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="bg-subflow-800 text-subflow-50 hover:bg-subflow-700 cursor-pointer rounded-full px-4 py-2 tracking-widest select-none"
                    >
                        Close
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
