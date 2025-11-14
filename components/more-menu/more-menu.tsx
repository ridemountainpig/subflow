"use client";

import { useState } from "react";
import { CircleEllipsis } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EmailNotifyDialog from "@/components/more-menu/email-notify-dialog";
import PreferencesDialog from "@/components/more-menu/preferences-dialog";

export default function MoreMenu() {
    const [open, setOpen] = useState(false);

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
                <EmailNotifyDialog setDropdownMenuOpen={setOpen} />
                <PreferencesDialog setDropdownMenuOpen={setOpen} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
