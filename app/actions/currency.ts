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

    return data;
}
