import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "lucide-react";

export default function GetStartBtn() {
    const t = useTranslations("HomePage");
    return (
        <Link
            href="/subscription"
            className="border-subflow-50/70 hover:bg-subflow-50 group text-subflow-50 flex cursor-pointer items-center gap-x-2 rounded-xl border-2 p-2 px-3 duration-300"
        >
            <span className="group-hover:text-subflow-900 text-base font-bold tracking-widest">
                {t("start")}
            </span>
            <div className="bg-subflow-50/40 group-hover:bg-subflow-400 flex items-center justify-center rounded-full p-1">
                <ArrowRightIcon strokeWidth={3.5} size={18} />
            </div>
        </Link>
    );
}
