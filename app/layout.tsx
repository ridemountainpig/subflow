import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";

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
        <ClerkProvider localization={localization} afterSignOutUrl="/">
            <html lang="en">
                <body>
                    <Header />
                    {children}
                    <Toaster
                        toastOptions={{
                            classNames: {
                                toast: "font-poetsen tracking-widest",
                            },
                        }}
                    />
                </body>
            </html>
        </ClerkProvider>
    );
}
