"use server";

import {
    CurrenciesList as CurrenciesListType,
    CurrenciesLive as CurrenciesLiveType,
} from "@/types/currency";

export async function getCurrenciesList() {
    const apiKey = process.env.EXCHANGERATE_HOST_API_KEY;
    const url = `https://api.exchangerate.host/list?access_key=${apiKey}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
            Accept: "application/json",
        },
        next: {
            revalidate: 86400 * 7, // 7 days
        },
    });
    const data: CurrenciesListType = await response.json();

    return data;
}

export async function getCurrenciesLive() {
    const apiKey = process.env.EXCHANGERATE_HOST_API_KEY;
    const url = `https://api.exchangerate.host/live?access_key=${apiKey}`;

    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                Accept: "application/json",
            },
            next: {
                revalidate: 86400, // 24 hours
            },
        });
        const data: CurrenciesLiveType = await response.json();

        if (data.success && data.quotes) {
            return data;
        }
    } catch (error) {
        console.error("exchangerate.host live rates failed:", error);
    }

    return getFallbackCurrenciesLive();
}

// Keyless fallback used only when exchangerate.host returns an error (missing
// key, quota reached, outage). ECB reference rates, ~30 currencies; currencies
// it does not cover are simply absent from `quotes`.
// Exchange rates by AllRatesToday — https://allratestoday.com
async function getFallbackCurrenciesLive(): Promise<CurrenciesLiveType> {
    try {
        const response = await fetch(
            "https://allratestoday.com/api/open/latest/USD",
            {
                headers: { Accept: "application/json" },
                next: {
                    revalidate: 86400, // 24 hours
                },
            },
        );
        const data: {
            result?: string;
            time_last_update_unix?: number;
            rates?: Record<string, number>;
        } = await response.json();

        if (data.result === "success" && data.rates) {
            const quotes: Record<string, number> = {};
            for (const [code, rate] of Object.entries(data.rates)) {
                quotes[`USD${code}`] = rate;
            }
            return {
                success: true,
                timestamp: data.time_last_update_unix ?? 0,
                source: "USD",
                quotes,
            };
        }
    } catch (error) {
        console.error("Fallback live rates failed:", error);
    }

    return { success: false, timestamp: 0, source: "USD", quotes: {} };
}
