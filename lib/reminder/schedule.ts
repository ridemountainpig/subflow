/**
 * Decides which subscriptions are charged "tomorrow". All math is done on
 * calendar dates in UTC so the result does not depend on the server's time
 * zone; pass in "today" as the calendar date in the reminder's time zone
 * (see getTodayInTimeZone).
 */

export interface CalendarDate {
    year: number;
    month: number; // 1-12
    date: number;
}

export interface SchedulableSubscription {
    startDate: CalendarDate;
    paymentCycle: string;
}

export const REMINDER_TIME_ZONE = "Asia/Taipei";

const DAY_MS = 24 * 60 * 60 * 1000;

const toUtc = (d: CalendarDate) =>
    new Date(Date.UTC(d.year, d.month - 1, d.date));

const lastDayOfMonth = (d: Date) =>
    new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();

/** Month difference using only year and month, matching the app's quarterly `% 3` rule. */
const monthsSinceStartMonth = (start: Date, ref: Date) =>
    (ref.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (ref.getUTCMonth() - start.getUTCMonth());

export function getTodayInTimeZone(
    now: Date = new Date(),
    timeZone: string = REMINDER_TIME_ZONE,
): CalendarDate {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);
    const get = (type: string) =>
        Number(parts.find((p) => p.type === type)?.value);
    return { year: get("year"), month: get("month"), date: get("day") };
}

export function isChargedTomorrow(
    sub: SchedulableSubscription,
    todayDate: CalendarDate,
): boolean {
    const today = toUtc(todayDate);
    const lastDay = lastDayOfMonth(today);
    const todayDay = today.getUTCDate();
    const todayMonth = today.getUTCMonth() + 1;

    const isLastDay = todayDay === lastDay;
    const isPenultimate = todayDay === lastDay - 1;

    const tmr = new Date(today.getTime() + DAY_MS);
    const tmrDay = tmr.getUTCDate();
    const tmrMonth = tmr.getUTCMonth() + 1;

    const nextMonthDate = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1),
    );
    const nextMonth = nextMonthDate.getUTCMonth() + 1;

    const start = toUtc(sub.startDate);
    const subDay = start.getUTCDate();
    const subMonth = start.getUTCMonth() + 1;

    const msToday = monthsSinceStartMonth(start, today);
    const msTmr = monthsSinceStartMonth(start, tmr);
    const msNext = monthsSinceStartMonth(start, nextMonthDate);

    // Subscription has not started yet: only remind for the very first charge.
    if (today < start && tmr.getTime() !== start.getTime()) {
        return false;
    }

    if (sub.paymentCycle === "monthly") {
        if (isPenultimate && lastDay < 31) return subDay > lastDay;
        if (isLastDay) {
            if (lastDay < 31) return subDay === 1 || subDay > lastDay;
            return subDay === 1;
        }
        return subDay === tmrDay;
    }

    if (sub.paymentCycle === "quarterly") {
        if (isPenultimate && lastDay < 31) {
            return msToday >= 0 && msToday % 3 === 0 && subDay > lastDay;
        }
        if (isLastDay) {
            if (lastDay < 31) {
                return (
                    (msToday >= 0 && msToday % 3 === 0 && subDay > lastDay) ||
                    (msNext >= 0 && msNext % 3 === 0 && subDay === 1)
                );
            }
            return msNext >= 0 && msNext % 3 === 0 && subDay === 1;
        }
        if (msTmr < 0 || msTmr % 3 !== 0) return false;
        return tmrDay === Math.min(subDay, lastDayOfMonth(tmr));
    }

    if (sub.paymentCycle === "yearly") {
        if (isPenultimate && lastDay < 31) {
            return subMonth === todayMonth && subDay > lastDay;
        }
        if (isLastDay) {
            if (lastDay < 31) {
                return (
                    (subMonth === todayMonth && subDay > lastDay) ||
                    (subMonth === nextMonth && subDay === 1)
                );
            }
            return subMonth === nextMonth && subDay === 1;
        }
        return subMonth === tmrMonth && subDay === tmrDay;
    }

    return false;
}
