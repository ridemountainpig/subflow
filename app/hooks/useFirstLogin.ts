import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useLocale } from "next-intl";
import { upsertEmail } from "@/app/actions/action";

export function useFirstLogin() {
    const { user } = useUser();
    const currentLocale = useLocale();

    useEffect(() => {
        const checkFirstLogin = async () => {
            if (!user?.id || !user?.createdAt) return;

            try {
                const userCreatedAt = new Date(user.createdAt);
                const now = new Date();
                const timeDifference = now.getTime() - userCreatedAt.getTime();
                const isNewUser = timeDifference < 30000; // 30 seconds

                if (isNewUser) {
                    if (user?.primaryEmailAddress?.emailAddress) {
                        await upsertEmail(
                            user.primaryEmailAddress.emailAddress,
                            currentLocale as "en" | "zh" | "ja",
                            true,
                        );
                    }
                }
            } catch (error) {
                console.error("Error checking first login", error);
            }
        };

        checkFirstLogin();
    }, [
        user?.id,
        user?.createdAt,
        currentLocale,
        user?.primaryEmailAddress?.emailAddress,
    ]);
}
