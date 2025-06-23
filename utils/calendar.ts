import {
    eachDayOfInterval,
    format,
    startOfMonth,
    endOfMonth,
    getDay,
    subDays,
    addDays,
} from "date-fns";

export function getCalendarData(year: number, month: number) {
    const start = startOfMonth(new Date(year, month - 1));
    const end = endOfMonth(new Date(year, month - 1));

    const firstDayOfMonth = getDay(start);
    const daysFromPrevMonth = firstDayOfMonth;

    // Calculate total days needed to fill 6 rows (42 days)
    const totalDaysNeeded = 42;
    const currentMonthDaysCount = end.getDate();
    const remainingDays =
        totalDaysNeeded - (daysFromPrevMonth + currentMonthDaysCount);

    const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
        const date = subDays(start, daysFromPrevMonth - i);
        return {
            date: format(date, "yyyy-MM-dd"),
            weekday: getDay(date),
            isCurrentMonth: false,
        };
    });

    const currentMonthDays = eachDayOfInterval({ start, end }).map((date) => ({
        date: format(date, "yyyy-MM-dd"),
        weekday: getDay(date),
        isCurrentMonth: true,
    }));

    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => {
        const date = addDays(end, i + 1);
        return {
            date: format(date, "yyyy-MM-dd"),
            weekday: getDay(date),
            isCurrentMonth: false,
        };
    });

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
}
