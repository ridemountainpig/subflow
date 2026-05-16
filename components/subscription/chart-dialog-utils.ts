import { SubscriptionWithPrice } from "@/types/subscription";

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
