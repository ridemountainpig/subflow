"use client";

import { ComponentType, useState } from "react";
import { motion } from "framer-motion";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
} from "@/components/ui/drawer";

import { useIsMobile } from "@/app/hooks/useIsMobile";
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

const CELL_BASE_STYLES =
    "col-span-1 h-12 w-12 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-lg sm:rounded-xl md:rounded-2xl py-0 sm:py-1";
const SUBSCRIPTION_ICON_BASE_STYLES =
    "bg-subflow-900 border-subflow-100 flex h-5 sm:h-7 w-5 sm:w-7 items-center justify-center rounded-sm sm:rounded-md border-2";

export default function CalendarCell({
    day,
    subscription,
    updatedSubscription,
    setUpdatedSubscription,
}: CalendarCellProps) {
    const isMobile = useIsMobile();
    const [drawerOpen, setDrawerOpen] = useState(false);

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
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                    <span className="text-subflow-50 text-xs font-bold sm:text-lg">
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
                <span className="text-subflow-50 text-xs sm:text-sm">
                    +{count}
                </span>
            </motion.div>
        );
    };

    const cellContent = (
        <div key={day.date} className={cellStyles}>
            <div className="flex items-start">
                <span className="mt-0.5 pl-1 text-xs sm:pl-2 sm:text-base">
                    {day.date.split("-")[2]}
                </span>
            </div>
            <div className="flex w-full justify-center -space-x-1.5 px-1 sm:mt-1">
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
        return isMobile ? (
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                    <div onClick={() => setDrawerOpen((prev) => !prev)}>
                        {cellContent}
                    </div>
                </DrawerTrigger>
                <DrawerContent className="bg-subflow-900 text-subflow-50 border-none">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle></DrawerTitle>
                        <DrawerDescription></DrawerDescription>
                    </DrawerHeader>
                    <div className="custom-scrollbar max-h-[60vh] overflow-y-auto p-4 sm:px-6">
                        {subscription.map((sub, index) => (
                            <div key={index}>
                                <SubscriptionListItem
                                    subscription={sub}
                                    onSuccess={() => {
                                        setUpdatedSubscription(
                                            !updatedSubscription,
                                        );
                                        setDrawerOpen(false);
                                    }}
                                />
                                {index !== subscription.length - 1 && (
                                    <div className="border-subflow-800 my-2 border-t-[2px]" />
                                )}
                            </div>
                        ))}
                    </div>
                </DrawerContent>
            </Drawer>
        ) : (
            <HoverCard openDelay={150} closeDelay={50}>
                <HoverCardTrigger asChild>{cellContent}</HoverCardTrigger>
                <HoverCardContent className="bg-subflow-900 border-subflow-100 text-subflow-50 w-fit min-w-56 overflow-hidden rounded-2xl border-3 p-0">
                    <div className="custom-scrollbar max-h-66 overflow-y-auto p-0 select-none sm:p-3">
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
