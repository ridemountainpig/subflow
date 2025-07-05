import { useState, useEffect } from "react";
import { Calendar } from "@/types/calendar";
import { getCalendarData } from "@/utils/calendar";

export const useCalendar = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [calendar, setCalendar] = useState<Calendar[]>([]);

    useEffect(() => {
        const calendarData = getCalendarData(year, month);
        setCalendar(calendarData);
    }, [year, month]);

    const handlePreviousMonth = () => {
        if (month === 1) {
            setYear(year - 1);
            setMonth(12);
        } else {
            setMonth(month - 1);
        }
    };

    const handleNextMonth = () => {
        if (month === 12) {
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    };

    return {
        year,
        month,
        calendar,
        handlePreviousMonth,
        handleNextMonth,
    };
};
