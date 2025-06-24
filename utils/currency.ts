import { getCurrenciesLive } from "@/app/action";

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
