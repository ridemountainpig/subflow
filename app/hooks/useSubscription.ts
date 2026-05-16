import { useState, useEffect, useMemo } from "react";
import {
    Subscription as SubscriptionType,
    SubscriptionWithPrice,
} from "@/types/subscription";
import { getSubscription } from "@/app/actions/action";
import { getCurrenciesLive } from "@/app/actions/currency";
import { usePreferences } from "@/app/contexts/PreferencesContext";
import {
    subscriptionVisibleInMonth,
    toDisplayMonthlyAmount,
} from "@/utils/subscriptionCycle";

export const useSubscription = (
    year: number,
    month: number,
    currency: string,
    currencyListLoading: boolean,
    userEmail?: string,
) => {
    const { notAmortizeYearlySubscriptions, preferencesLoading } =
        usePreferences();
    const [allSubscriptions, setAllSubscriptions] = useState<
        SubscriptionWithPrice[]
    >([]);
    const [updatedSubscription, setUpdatedSubscription] = useState(false);
    const [rawSubscriptions, setRawSubscriptions] = useState<
        SubscriptionType[]
    >([]);
    const [subscriptionsLoaded, setSubscriptionsLoaded] = useState(false);
    const [subscriptionFetchError, setSubscriptionFetchError] = useState(false);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setSubscriptionFetchError(false);
            try {
                const subscriptionsData = await getSubscription();
                setRawSubscriptions(subscriptionsData);
            } catch (error) {
                console.error("Error fetching subscriptions:", error);
                setSubscriptionFetchError(true);
                setRawSubscriptions([]);
            } finally {
                setSubscriptionsLoaded(true);
            }
        };

        fetchSubscriptions();
    }, [updatedSubscription]);

    useEffect(() => {
        const processSubscriptions = async () => {
            if (currencyListLoading) {
                return;
            }

            if (!rawSubscriptions.length) {
                setAllSubscriptions([]);
                return;
            }

            setAllSubscriptions([]);

            try {
                const needsRates = rawSubscriptions.some(
                    (sub) => sub.currency !== currency,
                );
                // Fetch the live quote set once and compute every conversion
                // from it, rather than calling convertCurrency per subscription
                // (which would hit the server action for each entry).
                const quotes = needsRates
                    ? (await getCurrenciesLive()).quotes
                    : null;

                const convertedSubscriptions = rawSubscriptions.map((sub) => {
                    if (sub.currency === currency) {
                        return { ...sub, convertedPrice: sub.price };
                    }
                    const fromRate = quotes?.[`USD${sub.currency}`] || 1;
                    const toRate = quotes?.[`USD${currency}`] || 1;
                    return {
                        ...sub,
                        convertedPrice: Math.floor(
                            (sub.price / fromRate) * toRate,
                        ),
                    };
                }) as SubscriptionWithPrice[];

                setAllSubscriptions(convertedSubscriptions);
            } catch (error) {
                console.error("Error processing subscriptions:", error);
                setAllSubscriptions([]);
            }
        };

        processSubscriptions();
    }, [rawSubscriptions, currency, currencyListLoading]);

    const subscriptions = useMemo(() => {
        return allSubscriptions.filter((subscription) =>
            subscriptionVisibleInMonth(
                subscription,
                year,
                month,
                notAmortizeYearlySubscriptions,
            ),
        );
    }, [allSubscriptions, year, month, notAmortizeYearlySubscriptions]);

    const conversionPending = useMemo(() => {
        return (
            rawSubscriptions.some((sub) => sub.currency !== currency) &&
            allSubscriptions.length === 0
        );
    }, [rawSubscriptions, allSubscriptions, currency]);

    const totalSpend = useMemo(() => {
        if (
            currencyListLoading ||
            preferencesLoading ||
            (conversionPending && subscriptions.length === 0)
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

            price = toDisplayMonthlyAmount(
                price,
                subscription.paymentCycle,
                notAmortizeYearlySubscriptions,
            );
            return sum + price;
        }, 0);
    }, [
        currencyListLoading,
        preferencesLoading,
        subscriptions,
        conversionPending,
        notAmortizeYearlySubscriptions,
        userEmail,
        currency,
    ]);

    const monthlySpend = useMemo(() => {
        return totalSpend ? Math.round(totalSpend) : totalSpend;
    }, [totalSpend]);

    return {
        subscriptions,
        allSubscriptions,
        rawSubscriptions,
        subscriptionsLoaded,
        subscriptionFetchError,
        monthlySpend,
        updatedSubscription,
        setUpdatedSubscription,
    };
};
