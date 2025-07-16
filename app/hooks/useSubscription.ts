import { useState, useEffect, useMemo } from "react";
import {
    Subscription as SubscriptionType,
    SubscriptionWithPrice,
} from "@/types/subscription";
import { getSubscription } from "@/app/action";
import { convertCurrency } from "@/utils/currency";

export const useSubscription = (
    year: number,
    month: number,
    currency: string,
    currencyListLoading: boolean,
) => {
    const [subscriptions, setSubscriptions] = useState<SubscriptionWithPrice[]>(
        [],
    );
    const [monthlySpend, setMonthlySpend] = useState<number | null>(null);
    const [updatedSubscription, setUpdatedSubscription] = useState(false);
    const [rawSubscriptions, setRawSubscriptions] = useState<
        SubscriptionType[]
    >([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const subscriptionsData = await getSubscription();
                setRawSubscriptions(subscriptionsData);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
                setRawSubscriptions([]);
            }
        };

        fetchSubscriptions();
    }, [updatedSubscription]);

    const dateFilteredSubscriptions = useMemo(() => {
        return rawSubscriptions.filter((subscription: SubscriptionType) => {
            if (subscription.paymentCycle === "yearly") {
                return (
                    subscription.startDate.year <= year &&
                    subscription.startDate.month === month
                );
            }
            return (
                (subscription.startDate.year === year &&
                    subscription.startDate.month <= month) ||
                subscription.startDate.year < year
            );
        });
    }, [rawSubscriptions, year, month]);

    const subscriptionsToConvert = useMemo(() => {
        return dateFilteredSubscriptions.filter(
            (sub) => sub.currency !== currency,
        );
    }, [dateFilteredSubscriptions, currency]);

    useEffect(() => {
        const processSubscriptions = async () => {
            if (currencyListLoading) {
                return;
            }

            if (!rawSubscriptions.length) {
                setSubscriptions([]);
                return;
            }

            setSubscriptions([]);

            try {
                const conversionPromises = subscriptionsToConvert.map((sub) =>
                    convertCurrency(sub.price, sub.currency, currency),
                );

                const conversionResults = await Promise.all(conversionPromises);

                const convertedSubscriptions = dateFilteredSubscriptions.map(
                    (sub) => {
                        if (sub.currency === currency) {
                            return { ...sub, convertedPrice: sub.price };
                        }
                        const conversionIndex =
                            subscriptionsToConvert.findIndex(
                                (conv) => conv._id === sub._id,
                            );
                        return {
                            ...sub,
                            convertedPrice: conversionResults[conversionIndex],
                        };
                    },
                ) as SubscriptionWithPrice[];

                setSubscriptions(convertedSubscriptions);
            } catch (error) {
                console.error("Error processing subscriptions:", error);
                setSubscriptions([]);
            }
        };

        processSubscriptions();
    }, [
        dateFilteredSubscriptions,
        subscriptionsToConvert,
        currency,
        currencyListLoading,
        rawSubscriptions,
    ]);

    const totalSpend = useMemo(() => {
        if (
            currencyListLoading ||
            (subscriptionsToConvert.length > 0 && subscriptions.length === 0)
        ) {
            return null;
        }

        if (subscriptions.length === 0) {
            return 0;
        }

        return subscriptions.reduce(
            (sum, subscription) => sum + subscription.convertedPrice,
            0,
        );
    }, [currencyListLoading, subscriptions, subscriptionsToConvert]);

    useEffect(() => {
        setMonthlySpend(totalSpend);
    }, [totalSpend]);

    return {
        subscriptions,
        monthlySpend,
        updatedSubscription,
        setUpdatedSubscription,
    };
};
