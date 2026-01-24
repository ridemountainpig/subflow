import { getCurrenciesLive } from "@/app/actions/action";

export async function convertCurrency(
    amount: number,
    from: string,
    to: string,
) {
    const CurrenciesLive = await getCurrenciesLive();
    const fromRate = CurrenciesLive.quotes[`USD${from}`] || 1;
    const toRate = CurrenciesLive.quotes[`USD${to}`] || 1;
    const convertedAmount = Math.floor((amount / fromRate) * toRate);
    return convertedAmount;
}

export function formatNumberWithUnit(
    num: number,
    locale?: string,
): { value: string; unit: string } {
    if (num === 0) return { value: "0", unit: "" };
    if (isNaN(num)) return { value: "0", unit: "" };
    if (!isFinite(num)) return { value: "∞", unit: "" };

    const absNum = Math.abs(num);

    if (absNum < 10000) {
        return {
            value: new Intl.NumberFormat("en-US").format(num),
            unit: "",
        };
    }

    switch (locale) {
        case "zh":
            if (absNum >= 1e8) {
                const formatted = (num / 1e8).toFixed(1);
                const cleanFormatted = parseFloat(formatted).toString();
                return { value: cleanFormatted, unit: "億" };
            }
            if (absNum >= 1e4) {
                const formatted = (num / 1e4).toFixed(1);
                const cleanFormatted = parseFloat(formatted).toString();
                return { value: cleanFormatted, unit: "萬" };
            }
            break;

        case "ja":
            if (absNum >= 1e8) {
                const formatted = (num / 1e8).toFixed(1);
                const cleanFormatted = parseFloat(formatted).toString();
                return { value: cleanFormatted, unit: "億" };
            }
            if (absNum >= 1e4) {
                const formatted = (num / 1e4).toFixed(1);
                const cleanFormatted = parseFloat(formatted).toString();
                return { value: cleanFormatted, unit: "万" };
            }
            break;

        default:
            const abbreviations = [
                { value: 1e9, symbol: "B" },
                { value: 1e6, symbol: "M" },
                { value: 1e3, symbol: "K" },
            ];

            for (const { value, symbol } of abbreviations) {
                if (absNum >= value) {
                    const formatted = (num / value).toFixed(1);
                    const cleanFormatted = parseFloat(formatted).toString();
                    return { value: cleanFormatted, unit: symbol };
                }
            }
            break;
    }

    return {
        value: new Intl.NumberFormat("en-US").format(num),
        unit: "",
    };
}
