"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Settings2, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { upsertPreferences } from "@/app/actions/action";
import { usePreferences } from "@/app/contexts/PreferencesContext";

export interface PreferencesDialogProps {
    setDropdownMenuOpen: (open: boolean) => void;
}

export default function PreferencesDialog({
    setDropdownMenuOpen,
}: PreferencesDialogProps) {
    const t = useTranslations("MoreMenu.preferencesDialog");
    const [open, setOpen] = useState(false);
    const {
        notAmortizeYearlySubscriptions,
        setNotAmortizeYearlySubscriptions,
    } = usePreferences();

    const [
        localNotAmortizeYearlySubscriptions,
        setLocalNotAmortizeYearlySubscriptions,
    ] = useState(notAmortizeYearlySubscriptions);

    const [savingPreferences, setSavingPreferences] = useState(false);

    const handleSavePreferences = async () => {
        setSavingPreferences(true);
        await upsertPreferences(localNotAmortizeYearlySubscriptions);
        setNotAmortizeYearlySubscriptions(localNotAmortizeYearlySubscriptions);
        setSavingPreferences(false);
        setOpen(false);
        setDropdownMenuOpen(false);
        toast.success(t("preferencesSaved"));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (open) {
                    setLocalNotAmortizeYearlySubscriptions(
                        notAmortizeYearlySubscriptions,
                    );
                } else {
                    setDropdownMenuOpen(false);
                }
            }}
        >
            <DialogTrigger title="Preferences">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    <Settings2
                        strokeWidth={2.8}
                        className="h-5 w-5 text-black"
                    />
                    <span>{t("title")}</span>
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 w-120 rounded-2xl border-[3px] p-3 select-none sm:p-4">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription />
                    <div className="flex h-fit items-center justify-between gap-2 pb-0.5">
                        <span className="text-subflow-50 text-sm tracking-widest sm:text-base">
                            {t("notAmortizeYearlySubscriptions")}
                        </span>
                        <Switch
                            checked={localNotAmortizeYearlySubscriptions}
                            onCheckedChange={
                                setLocalNotAmortizeYearlySubscriptions
                            }
                            className="data-[state=checked]:bg-subflow-100 data-[state=unchecked]:bg-subflow-600 mr-1 scale-125 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="text-subflow-300 pb-2 text-xs tracking-widest sm:text-sm">
                        {t("notAmortizeYearlySubscriptionsDescription")}
                    </div>
                    <button
                        className={`bg-subflow-600 text-subflow-50 mt-4 h-10 w-full rounded-md text-xs tracking-widest sm:text-base ${
                            savingPreferences
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        onClick={handleSavePreferences}
                        disabled={savingPreferences}
                    >
                        {savingPreferences ? (
                            <div className="flex items-center justify-center gap-2">
                                <LoaderCircle
                                    className="animate-spin"
                                    size={20}
                                    strokeWidth={3}
                                />
                                <span>{t("savingSettings")}</span>
                            </div>
                        ) : (
                            t("saveSettings")
                        )}
                    </button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
