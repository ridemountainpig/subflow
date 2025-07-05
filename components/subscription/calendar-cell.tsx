import { ComponentType } from "react";
import { motion } from "framer-motion";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Subscription } from "@/types/subscription";
import { Calendar } from "@/types/calendar";
import { CurrenciesList } from "@/types/currency";
import { subscriptionServices } from "@/data/subscriptionServices";
import SubscriptionListItem from "@/components/subscription/subscription-list-item";

interface CalendarCellProps {
    day: Calendar;
    subscription?: Subscription[];
    currenciesList: CurrenciesList;
    updatedSubscription: boolean;
    setUpdatedSubscription: (updated: boolean) => void;
}

const CELL_BASE_STYLES = "col-span-1 h-20 w-20 rounded-2xl py-1";
const SUBSCRIPTION_ICON_BASE_STYLES =
    "bg-subflow-900 border-subflow-100 flex h-7 w-7 items-center justify-center rounded-md border-2";

export default function CalendarCell({
    day,
    subscription,
    updatedSubscription,
    setUpdatedSubscription,
}: CalendarCellProps) {
    const cellStyles = day.isCurrentMonth
        ? `${CELL_BASE_STYLES} bg-subflow-800 text-subflow-50`
        : `${CELL_BASE_STYLES} bg-subflow-100 text-subflow-800`;

    const renderSubscriptionIcon = (
        subscription: Subscription,
        index: number,
    ) => {
        const Icon = subscriptionServices.find(
            (service) => service.uuid === subscription.serviceId,
        )?.icon as ComponentType<{ className?: string }>;

        return (
            <motion.div
                key={index}
                className={SUBSCRIPTION_ICON_BASE_STYLES}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                {Icon ? (
                    <Icon className="h-4 w-4" />
                ) : (
                    <span className="text-subflow-50 font-poetsen text-lg font-bold">
                        {subscription.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </motion.div>
        );
    };

    const renderRemainingCount = (count: number) => {
        return (
            <motion.div
                className={SUBSCRIPTION_ICON_BASE_STYLES}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                <span className="text-subflow-50 font-poetsen text-sm">
                    +{count}
                </span>
            </motion.div>
        );
    };

    const cellContent = (
        <div key={day.date} className={cellStyles}>
            <span className="font-poetsen pl-2">{day.date.split("-")[2]}</span>
            <div className="mt-1 flex w-full justify-center -space-x-1.5 px-1">
                {subscription
                    ?.slice(0, 2)
                    .map((sub, index) => renderSubscriptionIcon(sub, index))}
                {subscription &&
                    subscription.length > 2 &&
                    renderRemainingCount(subscription.length - 2)}
            </div>
        </div>
    );

    if (subscription && subscription.length > 0) {
        return (
            <HoverCard openDelay={150} closeDelay={50}>
                <HoverCardTrigger>{cellContent}</HoverCardTrigger>
                <HoverCardContent className="bg-subflow-900 border-subflow-100 text-subflow-50 font-poetsen w-fit min-w-56 overflow-hidden rounded-2xl border-3 p-0">
                    <div className="custom-scrollbar max-h-66 overflow-y-auto p-3 select-none">
                        {subscription.map((sub, index) => (
                            <div key={index}>
                                <SubscriptionListItem
                                    subscription={sub}
                                    onSuccess={() =>
                                        setUpdatedSubscription(
                                            !updatedSubscription,
                                        )
                                    }
                                />
                                {index !== subscription.length - 1 && (
                                    <div className="border-subflow-800 my-2 border-t-[2px]" />
                                )}
                            </div>
                        ))}
                    </div>
                </HoverCardContent>
            </HoverCard>
        );
    }
    return cellContent;
}
