export interface CurrenciesList {
    currencies: Record<string, string>;
}

export interface CurrenciesLive {
    success: boolean;
    timestamp: number;
    source: string;
    quotes: Record<string, number>;
}
