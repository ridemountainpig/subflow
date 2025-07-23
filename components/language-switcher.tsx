import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function LanguageSwitcher() {
    const currentLocale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const handleLanguageChange = (locale: string) => {
        if (locale === currentLocale) return;
        router.replace(pathname, { locale });
        router.refresh();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                <Languages
                    className="text-subflow-50 h-5 w-5 sm:h-7 sm:w-7"
                    strokeWidth={2.5}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-[--trigger-width] tracking-widest"
                side="bottom"
                align="center"
                sideOffset={14}
            >
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleLanguageChange("en")}
                >
                    English
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => handleLanguageChange("zh")}
                >
                    中文
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
