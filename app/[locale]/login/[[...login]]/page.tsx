import { SignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Footer from "@/components/footer";

export default function Login() {
    const t = useTranslations("LoginPage");
    return (
        <>
            <div className="bg-subflow-900 flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-y-8 sm:min-h-[calc(100vh-7.25rem)]">
                <span className="text-subflow-50 text-xl font-bold tracking-widest sm:text-2xl md:text-3xl">
                    {t("title")}
                </span>
                <div className="bg-subflow-50/50 border-subflow-50/70 rounded-2xl border-[1.5px] p-1">
                    <SignIn />
                </div>
                <span className="text-subflow-50 text-xs tracking-widest md:text-sm">
                    {t("secure")}
                </span>
            </div>
            <Footer />
        </>
    );
}
