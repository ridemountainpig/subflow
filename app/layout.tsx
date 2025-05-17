import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const localization = {
    signIn: {
        start: {
            subtitleCombined: "Manage subscription with Subflow",
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider localization={localization}>
            <html lang="en">
                <body>{children}</body>
            </html>
        </ClerkProvider>
    );
}
