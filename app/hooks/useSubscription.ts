import { useState, useEffect, useMemo } from "react";
import {
    Subscription as SubscriptionType,
    SubscriptionWithPrice,
} from "@/types/subscription";
import { getSubscription } from "@/app/action";
import { convertCurrency } from "@/utils/currency";
import { usePreferences } from "@/app/contexts/PreferencesContext";

export const useSubscription = (
    year: number,
    month: number,
    currency: string,
    currencyListLoading: boolean,
    userEmail?: string,
) => {
    const { notAmortizeYearlySubscriptions, preferencesLoading } =
        usePreferences();
    const [subscriptions, setSubscriptions] = useState<SubscriptionWithPrice[]>(
        [],
    );
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
                if (notAmortizeYearlySubscriptions) {
                    const yearsSinceStart = year - subscription.startDate.year;
                    const isCurrentMonth =
                        month === subscription.startDate.month;

                    return yearsSinceStart >= 0 && isCurrentMonth;
                } else {
                    return (
                        subscription.startDate.year < year ||
                        (subscription.startDate.year === year &&
                            subscription.startDate.month <= month)
                    );
                }
            }
            return (
                (subscription.startDate.year === year &&
                    subscription.startDate.month <= month) ||
                subscription.startDate.year < year
            );
        });
    }, [rawSubscriptions, year, month, notAmortizeYearlySubscriptions]);

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
            preferencesLoading ||
            (subscriptionsToConvert.length > 0 && subscriptions.length === 0)
        ) {
            return null;
        }

        if (subscriptions.length === 0) {
            return 0;
        }

        return subscriptions.reduce((sum, subscription) => {
            let price = subscription.convertedPrice;
            if (subscription.isCoSubscription && userEmail) {
                const coSubscriber = subscription.coSubscribers?.find(
                    (sub) => sub.email === userEmail,
                );
                if (coSubscriber) {
                    if (coSubscriber.amount === undefined) {
                        return sum;
                    }
                    if (coSubscriber.currency === currency) {
                        price = coSubscriber.amount;
                    } else if (
                        coSubscriber.currency === subscription.currency
                    ) {
                        const ratio =
                            subscription.convertedPrice / subscription.price;
                        price = coSubscriber.amount * ratio;
                    } else {
                        return sum;
                    }
                }
            }

            if (
                subscription.paymentCycle === "yearly" &&
                !notAmortizeYearlySubscriptions
            ) {
                price = price / 12;
            }
            return sum + price;
        }, 0);
    }, [
        currencyListLoading,
        preferencesLoading,
        subscriptions,
        subscriptionsToConvert,
        notAmortizeYearlySubscriptions,
        userEmail,
    ]);

    const monthlySpend = useMemo(() => {
        return totalSpend ? Math.round(totalSpend) : totalSpend;
    }, [totalSpend]);

    return {
        subscriptions,
        monthlySpend,
        updatedSubscription,
        setUpdatedSubscription,
    };
};
