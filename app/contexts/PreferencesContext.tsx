"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { getPreferences } from "@/app/action";

interface PreferencesContextType {
    notAmortizeYearlySubscriptions: boolean;
    setNotAmortizeYearlySubscriptions: (value: boolean) => void;
    preferencesLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
    undefined,
);

interface PreferencesProviderProps {
    children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
    const [notAmortizeYearlySubscriptions, setNotAmortizeYearlySubscriptions] =
        useState(false);
    const [preferencesLoading, setPreferencesLoading] = useState(true);

    const fetchPreferences = async () => {
        try {
            setPreferencesLoading(true);
            const preferences = await getPreferences();
            if (preferences.length > 0) {
                setNotAmortizeYearlySubscriptions(
                    preferences[0].notAmortizeYearlySubscriptions,
                );
            } else {
                setNotAmortizeYearlySubscriptions(false);
            }
        } catch (error) {
            console.error("Failed to fetch preferences:", error);
            setNotAmortizeYearlySubscriptions(false);
        } finally {
            setPreferencesLoading(false);
        }
    };

    useEffect(() => {
        fetchPreferences();
    }, []);

    const value: PreferencesContextType = {
        notAmortizeYearlySubscriptions,
        setNotAmortizeYearlySubscriptions,
        preferencesLoading,
    };

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error(
            "usePreferences must be used within a PreferencesProvider",
        );
    }
    return context;
}
