"use client";

import { useLocale } from "next-intl";
import { formatNumberWithUnit } from "@/utils/currency";

interface FormattedNumberProps {
    value: number;
    className?: string;
}

export default function FormattedNumber({
    value,
    className,
}: FormattedNumberProps) {
    const locale = useLocale();

    const { value: formattedValue, unit } = formatNumberWithUnit(value, locale);

    if (!unit) {
        return <span className={className}>{formattedValue}</span>;
    }

    return (
        <span className={className}>
            {formattedValue}
            {unit}
        </span>
    );
}
