"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { getCurrenciesList } from "@/app/actions/currency";
import { getTopCurrencies } from "@/app/actions/action";
import { CurrenciesList } from "@/types/currency";
import { useAuth } from "@clerk/nextjs";

interface CurrencyContextType {
    currenciesList: CurrenciesList;
    currency: string;
    setCurrency: (currency: string) => void;
    currencyListLoading: boolean;
    topCurrencies: string[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
    undefined,
);

interface CurrencyProviderProps {
    children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
    const { userId } = useAuth();
    const [currenciesList, setCurrenciesList] = useState<CurrenciesList>({
        currencies: {},
    });
    const [currencyListLoading, setCurrencyListLoading] = useState(true);
    const [currency, setCurrency] = useState("USD");
    const [topCurrencies, setTopCurrencies] = useState<string[]>([]);

    useEffect(() => {
        const fetchCurrenciesList = async () => {
            try {
                const currenciesList = await getCurrenciesList();
                setCurrenciesList(currenciesList);
                setTimeout(() => {
                    setCurrencyListLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Failed to fetch currencies list:", error);
                setCurrencyListLoading(false);
            }
        };

        const fetchLocalStorage = () => {
            if (typeof window !== "undefined") {
                const savedCurrency = localStorage.getItem("currency");
                if (savedCurrency) {
                    setCurrency(savedCurrency);
                }
            }
        };

        fetchCurrenciesList();
        fetchLocalStorage();
    }, []);

    useEffect(() => {
        const fetchTopCurrencies = async () => {
            if (!userId) {
                setTopCurrencies([]);
                return;
            }

            try {
                const top = await getTopCurrencies();
                setTopCurrencies(top);
            } catch {
                setTopCurrencies([]);
            }
        };

        fetchTopCurrencies();
    }, [userId]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("currency", currency);
        }
    }, [currency]);

    const value: CurrencyContextType = {
        currenciesList,
        currency,
        setCurrency,
        currencyListLoading,
        topCurrencies,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);

    if (context === undefined) {
        throw new Error("useCurrency must be used within a CurrencyProvider");
    }

    return context;
}
