"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--color-subflow-800)",
                    "--normal-text": "var(--color-subflow-50)",
                    "--normal-border": "var(--color-subflow-800)",
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
