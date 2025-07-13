import { SignIn } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import Footer from "@/components/footer";

export default function Login() {
    const t = useTranslations("LoginPage");
    return (
        <>
            <div className="bg-subflow-900 flex h-[calc(100vh-7.25rem)] flex-col items-center justify-center gap-y-8">
                <span className="text-subflow-50 text-3xl font-bold tracking-widest">
                    {t("title")}
                </span>
                {/* <span className="text-subflow-50 text-lg  tracking-wider">Sign in to continue your subflow</span> */}
                <div className="bg-subflow-50/50 border-subflow-50/70 rounded-2xl border-[1.5px] p-1">
                    <SignIn />
                </div>
                <span className="text-subflow-50 text-sm tracking-widest">
                    {t("secure")}
                </span>
            </div>
            <Footer />
        </>
    );
}
