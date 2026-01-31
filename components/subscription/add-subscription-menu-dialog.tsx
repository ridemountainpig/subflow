import { useTranslations } from "next-intl";
import { useState } from "react";
import { CirclePlus, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AddSubscriptionDialog from "@/components/subscription/add-subscription-dialog";

interface AddSubscriptionMenuDialogProps {
    userId: string;
    onSuccess?: () => void;
}

export default function AddSubscriptionMenuDialog({
    userId,
    onSuccess,
}: AddSubscriptionMenuDialogProps) {
    const t = useTranslations("SubscriptionPage");
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        onSuccess?.();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger title={t("addSubscriptionDialog.title")}>
                <CirclePlus className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
            </DialogTrigger>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px] p-3 sm:p-5">
                <DialogHeader className="text-left">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-subflow-50 text-base tracking-widest sm:text-xl md:text-2xl">
                                {t("addSubscriptionDialog.title")}
                            </DialogTitle>
                            <DialogDescription className="text-subflow-300 text-xs tracking-widest sm:text-sm md:text-base">
                                {t("addSubscriptionDialog.description")}
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                        <AddSubscriptionDialog
                            userId={userId}
                            onSuccess={handleSuccess}
                        />
                        <Link
                            href="/smart-add"
                            className="bg-subflow-800/50 flex h-fit w-full cursor-pointer items-center gap-x-4 rounded-lg p-2 sm:p-4"
                        >
                            <div className="bg-subflow-900 flex items-center justify-center rounded-md p-1.5">
                                <Sparkles className="text-subflow-50 size-5 cursor-pointer p-0.5 sm:size-6" />
                            </div>
                            <span className="text-subflow-50 text-sm tracking-widest sm:text-lg">
                                {t("addSubscriptionDialog.smartAdd")}
                            </span>
                        </Link>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
