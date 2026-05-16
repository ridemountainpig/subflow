import { SubscriptionWithPrice } from "@/types/subscription";

/**
 * Returns the price actually attributable to the current user in the target
 * display currency, accounting for co-subscription splits. Returns null when
 * the subscription should be excluded (no co-subscriber amount, or an
 * unrecognised currency pair). Mirrors the logic in
 * `useSubscription.totalSpend` so charts stay in sync with the page header.
 */
export const getEffectiveConvertedPrice = (
    sub: SubscriptionWithPrice,
    currency: string,
    userEmail?: string,
): number | null => {
    if (!sub.isCoSubscription || !userEmail) {
        return sub.convertedPrice;
    }
    const coSubscriber = sub.coSubscribers?.find((c) => c.email === userEmail);
    if (!coSubscriber) {
        return sub.convertedPrice;
    }
    if (coSubscriber.amount === undefined) {
        return null;
    }
    if (coSubscriber.currency === currency) {
        return coSubscriber.amount;
    }
    if (coSubscriber.currency === sub.currency) {
        const ratio = sub.convertedPrice / sub.price;
        return coSubscriber.amount * ratio;
    }
    return null;
};

export const calculateMonthsFromStart = (startDate: {
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

export const startDateToDate = (startDate: {
    year: number;
    month: number;
    date: number;
}) => new Date(startDate.year, startDate.month - 1, startDate.date);

export const addMonthsWithClampedDay = (date: Date, monthsToAdd: number) => {
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth() + monthsToAdd;
    const lastDayOfTargetMonth = new Date(
        targetYear,
        targetMonth + 1,
        0,
    ).getDate();

    return new Date(
        targetYear,
        targetMonth,
        Math.min(date.getDate(), lastDayOfTargetMonth),
    );
};

export const getNextRenewalDate = (
    subscription: SubscriptionWithPrice,
    fromDate: Date,
) => {
    const intervalMonths =
        subscription.paymentCycle === "yearly"
            ? 12
            : subscription.paymentCycle === "quarterly"
              ? 3
              : 1;
    const today = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
    );
    const start = startDateToDate(subscription.startDate);

    if (start >= today) {
        return start;
    }

    const monthDiff =
        (today.getFullYear() - start.getFullYear()) * 12 +
        (today.getMonth() - start.getMonth());
    let elapsedCycles = Math.max(0, Math.floor(monthDiff / intervalMonths));
    let nextDate = addMonthsWithClampedDay(
        start,
        elapsedCycles * intervalMonths,
    );

    while (nextDate < today) {
        elapsedCycles += 1;
        nextDate = addMonthsWithClampedDay(
            start,
            elapsedCycles * intervalMonths,
        );
    }

    return nextDate;
};

export const daysBetween = (fromDate: Date, toDate: Date) => {
    const start = new Date(
        fromDate.getFullYear(),
        fromDate.getMonth(),
        fromDate.getDate(),
    ).getTime();
    const end = new Date(
        toDate.getFullYear(),
        toDate.getMonth(),
        toDate.getDate(),
    ).getTime();

    return Math.round((end - start) / 86400000);
};

export const formatTrendMonthLabel = (date: Date, locale: string) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    if (locale.startsWith("zh") || locale.startsWith("ja")) {
        return `${year}/${month}`;
    }

    return `${date.toLocaleString(locale, { month: "short" })} ${String(year).slice(2)}`;
};
