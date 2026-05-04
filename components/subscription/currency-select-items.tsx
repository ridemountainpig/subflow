"use client";

import {
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
} from "@/components/ui/select";
import type { CurrenciesList } from "@/types/currency";

interface CurrencySelectItemsProps {
    currenciesList: CurrenciesList;
    topCurrencies: string[];
    frequentCurrenciesLabel: string;
    itemClassName?: string;
    labelClassName?: string;
}

export default function CurrencySelectItems({
    currenciesList,
    topCurrencies,
    frequentCurrenciesLabel,
    itemClassName = "cursor-pointer text-xs sm:text-base",
    labelClassName = "text-xs sm:text-sm",
}: CurrencySelectItemsProps) {
    const topCurrencySet = new Set(topCurrencies);
    const currencyKeys = Object.keys(currenciesList.currencies);

    return (
        <>
            {topCurrencies.length > 0 && (
                <>
                    <SelectGroup>
                        <SelectLabel className={labelClassName}>
                            {frequentCurrenciesLabel}
                        </SelectLabel>
                        {topCurrencies.map((key) => (
                            <SelectItem
                                key={`top-${key}`}
                                value={key}
                                className={itemClassName}
                            >
                                {key}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectSeparator />
                </>
            )}
            {currencyKeys
                .filter((key) => !topCurrencySet.has(key))
                .map((key) => (
                    <SelectItem key={key} value={key} className={itemClassName}>
                        {key}
                    </SelectItem>
                ))}
        </>
    );
}
