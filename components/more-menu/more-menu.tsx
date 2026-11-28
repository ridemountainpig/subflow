"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CircleEllipsis } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmailNotifyDialog from "@/components/more-menu/email-notify-dialog";
import PreferencesDialog from "@/components/more-menu/preferences-dialog";
import ApiKeyDialog from "@/components/more-menu/api-key-dialog";

export default function MoreMenu() {
    const searchParams = useSearchParams();
    // A ?menu= link opens its dialog once. It is cleared when the menu
    // closes, so reopening the menu later doesn't show the dialog again.
    const [menuAction, setMenuAction] = useState(() =>
        searchParams.get("menu"),
    );
    const autoOpenApiKey = menuAction === "api-key";
    // Linked from the payment reminder email footer.
    const autoOpenEmailNotify = menuAction === "email-notify";

    const [open, setOpenState] = useState(
        autoOpenApiKey || autoOpenEmailNotify,
    );
    const setOpen = (next: boolean) => {
        setOpenState(next);
        if (!next) setMenuAction(null);
    };

    useEffect(() => {
        if (searchParams.get("menu")) {
            window.history.replaceState(null, "", window.location.pathname);
        }
    }, [searchParams]);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                <CircleEllipsis
                    className="text-subflow-50 h-7 w-7 sm:h-10 sm:w-10"
                    strokeWidth={2}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="flex min-w-[--trigger-width] flex-col gap-2 tracking-widest"
                side="bottom"
                align="center"
                sideOffset={14}
            >
                <EmailNotifyDialog
                    setDropdownMenuOpen={setOpen}
                    autoOpen={autoOpenEmailNotify}
                />
                <PreferencesDialog setDropdownMenuOpen={setOpen} />
                <ApiKeyDialog
                    setDropdownMenuOpen={setOpen}
                    autoOpen={autoOpenApiKey}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
