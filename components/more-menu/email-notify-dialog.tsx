"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Mail, LoaderCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { getEmail, upsertEmail } from "@/app/action";

export interface EmailNotifyDialogProps {
    setDropdownMenuOpen: (open: boolean) => void;
}

export default function EmailNotifyDialog({
    setDropdownMenuOpen,
}: EmailNotifyDialogProps) {
    const t = useTranslations("MoreMenu.emailNotifyDialog");
    const currentLocale = useLocale();
    const [open, setOpen] = useState(false);

    const [notify, setNotify] = useState(false);
    const [email, setEmail] = useState("");
    const [emailLanguage, setEmailLanguage] = useState<"en" | "zh" | "ja">(
        "en",
    );

    const [emailError, setEmailError] = useState(false);
    const [savingEmail, setSavingEmail] = useState(false);

    useEffect(() => {
        const fetchEmail = async () => {
            const email = await getEmail();
            if (email.length > 0) {
                setEmail(email[0].email);
                setNotify(email[0].notify);
                setEmailLanguage(email[0].language);
            } else {
                setEmailLanguage(currentLocale as "en" | "zh" | "ja");
            }
        };
        fetchEmail();
    }, [open, currentLocale]);

    const handleSaveEmail = async () => {
        if (notify && (email === "" || !isValidEmail(email))) {
            setEmailError(true);
            return;
        } else {
            setEmailError(false);
        }
        setSavingEmail(true);
        await upsertEmail(email || "", emailLanguage, notify);
        setSavingEmail(false);
        setOpen(false);
        setDropdownMenuOpen(false);
        toast.success(t("emailNotifySaved"));
    };

    const isValidEmail = (email: string) => {
        const input = document.createElement("input");
        input.type = "email";
        input.value = email;
        return input.validity.valid;
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (open) {
                    setEmailError(false);
                    setSavingEmail(false);
                } else {
                    setDropdownMenuOpen(false);
                }
            }}
        >
            <DialogTrigger title="Email Notify">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(e) => {
                        e.preventDefault();
                        setOpen(true);
                    }}
                >
                    <Mail strokeWidth={2.8} className="h-5 w-5 text-black" />
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
                            {t("notify")}{" "}
                            {emailError && (
                                <span className="text-sm text-red-400/90 sm:text-base">
                                    {t("emailError")}
                                </span>
                            )}
                        </span>
                        <Switch
                            checked={notify}
                            onCheckedChange={setNotify}
                            className="data-[state=checked]:bg-subflow-100 data-[state=unchecked]:bg-subflow-600 mr-1 scale-125 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                    </div>
                    <div className="text-subflow-300 pb-2 text-xs tracking-widest sm:text-sm">
                        {t("notifyDescription")}
                    </div>
                    <Input
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        min={0}
                        className="text-subflow-800 bg-subflow-100 col-span-3 h-10 w-full rounded-md text-xs tracking-widest sm:text-base"
                        value={email || ""}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="text-subflow-50 pb-2 text-sm tracking-widest sm:text-base">
                        {t("emailLanguage")}
                    </div>
                    <Select
                        value={emailLanguage}
                        onValueChange={(value) =>
                            setEmailLanguage(value as "en" | "zh" | "ja")
                        }
                    >
                        <SelectTrigger className="text-subflow-800 bg-subflow-100 h-10 w-full cursor-pointer text-xs tracking-widest sm:text-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="tracking-wider">
                            <SelectItem
                                value="en"
                                className="text-xs sm:text-base"
                            >
                                English
                            </SelectItem>
                            <SelectItem
                                value="zh"
                                className="text-xs sm:text-base"
                            >
                                中文
                            </SelectItem>
                            <SelectItem
                                value="ja"
                                className="text-xs sm:text-base"
                            >
                                日本語
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <button
                        className={`bg-subflow-600 text-subflow-50 mt-4 h-10 w-full rounded-md text-xs tracking-widest sm:text-base ${
                            savingEmail
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }`}
                        onClick={handleSaveEmail}
                        disabled={savingEmail}
                    >
                        {savingEmail ? (
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
