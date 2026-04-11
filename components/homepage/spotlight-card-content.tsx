import { ArrowUpRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface SpotlightCardContentProps {
    icon: React.ReactNode;
    title: string;
    description: string | React.ReactNode;
    ctaLabel?: string;
    ctaHref?: string;
}

export default function SpotlightCardContent({
    icon,
    title,
    description,
    ctaLabel,
    ctaHref,
}: SpotlightCardContentProps) {
    return (
        <div className="flex flex-col items-center gap-y-4 lg:items-start">
            <div className="bg-subflow-900 flex h-12 w-12 items-center justify-center rounded-xl p-2">
                {icon}
            </div>
            <h3 className="text-subflow-200 text-xl font-bold tracking-widest select-none sm:text-2xl">
                {title}
            </h3>
            <p className="text-subflow-50 text-sm font-bold tracking-widest select-none sm:text-base">
                {description}
            </p>
            {ctaLabel && ctaHref && (
                <Link
                    href={ctaHref}
                    className="group bg-subflow-900/60 border-subflow-700 hover:bg-subflow-900 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors"
                >
                    <span className="text-subflow-50">{ctaLabel}</span>
                    <span className="bg-subflow-50/10 text-subflow-50 group-hover:bg-subflow-50/20 inline-flex items-center justify-center rounded-full p-1 transition-colors">
                        <ArrowUpRightIcon size={12} strokeWidth={2.8} />
                    </span>
                </Link>
            )}
        </div>
    );
}
