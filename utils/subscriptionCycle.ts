import type { Subscription } from "@/types/subscription";

export function amortizedMonthsPerCycle(
    cycle: Subscription["paymentCycle"],
): number {
    switch (cycle) {
        case "yearly":
            return 12;
        case "quarterly":
            return 3;
        case "monthly":
        default:
            return 1;
    }
}

/** When false, long-cycle subs use full price in lists; when true, show monthly equivalent. */
export function usesAmortizedMonthlyDisplay(
    cycle: Subscription["paymentCycle"],
    notAmortizeLongCycles: boolean,
): boolean {
    if (notAmortizeLongCycles) {
        return false;
    }
    return cycle === "yearly" || cycle === "quarterly";
}

export function toDisplayMonthlyAmount(
    price: number,
    cycle: Subscription["paymentCycle"],
    notAmortizeLongCycles: boolean,
): number {
    if (!usesAmortizedMonthlyDisplay(cycle, notAmortizeLongCycles)) {
        return price;
    }
    return price / amortizedMonthsPerCycle(cycle);
}

export function subscriptionVisibleInMonth(
    sub: Pick<Subscription, "paymentCycle" | "startDate">,
    year: number,
    month: number,
    notAmortizeLongCycles: boolean,
): boolean {
    const { paymentCycle, startDate } = sub;

    const startedOnOrBefore =
        startDate.year < year ||
        (startDate.year === year && startDate.month <= month);

    if (paymentCycle === "yearly") {
        if (notAmortizeLongCycles) {
            const yearsSinceStart = year - startDate.year;
            const isBillingMonth = month === startDate.month;
            return yearsSinceStart >= 0 && isBillingMonth;
        }
        return startedOnOrBefore;
    }

    if (paymentCycle === "quarterly") {
        if (notAmortizeLongCycles) {
            if (year < startDate.year) {
                return false;
            }
            if (year === startDate.year && month < startDate.month) {
                return false;
            }
            const monthsSinceStart =
                (year - startDate.year) * 12 + (month - startDate.month);
            return monthsSinceStart >= 0 && monthsSinceStart % 3 === 0;
        }
        return startedOnOrBefore;
    }

    return startedOnOrBefore;
}
