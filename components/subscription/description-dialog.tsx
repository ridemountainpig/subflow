"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
    CircleArrowLeft,
    CircleArrowRight,
    CirclePlus,
    ChartPie,
    CircleEllipsis,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function DescriptionDialog() {
    const t = useTranslations("SubscriptionPage");
    const [open, setOpen] = useState(() => {
        if (typeof window === "undefined") return false;
        const getDescriptionDialogShow = localStorage.getItem(
            "descriptionDialogShow",
        );
        if (!getDescriptionDialogShow) {
            localStorage.setItem("descriptionDialogShow", "true");
            return true;
        }
        return false;
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-subflow-900 border-subflow-100 rounded-2xl border-[3px] p-4 sm:p-6">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-subflow-50 text-lg tracking-widest sm:text-xl md:text-2xl">
                        {t("descriptionDialog.title")}
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                    <div className="text-subflow-50 space-y-4 text-sm tracking-wide sm:text-base">
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-subflow-50 pb-2 text-base tracking-widest sm:text-lg">
                                {t("descriptionDialog.monthSwitch.title")}
                            </span>
                            <div className="text-subflow-500">
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.monthSwitch.description",
                                    )}
                                </span>
                                <CircleArrowLeft
                                    className="text-subflow-50 mx-1 inline h-4 w-4 align-middle"
                                    strokeWidth={2.5}
                                />
                                <CircleArrowRight
                                    className="text-subflow-50 mx-1 inline h-4 w-4 align-middle"
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-subflow-50 pb-2 text-base tracking-widest sm:text-lg">
                                {t("descriptionDialog.addSubscription.title")}
                            </span>
                            <div className="text-subflow-500">
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.addSubscription.description1",
                                    )}
                                </span>
                                <CirclePlus
                                    className="text-subflow-50 mx-1 inline h-4 w-4 align-middle"
                                    strokeWidth={2.5}
                                />
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.addSubscription.description2",
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-subflow-50 pb-2 text-base tracking-widest sm:text-lg">
                                {t(
                                    "descriptionDialog.manageSubscription.title",
                                )}
                            </span>
                            <div className="text-subflow-500">
                                <span className="hidden lg:block">
                                    {t(
                                        "descriptionDialog.manageSubscription.desktop",
                                    )}
                                </span>
                                <span className="lg:hidden">
                                    {t(
                                        "descriptionDialog.manageSubscription.mobile",
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-subflow-50 pb-2 text-base tracking-widest sm:text-lg">
                                {t("descriptionDialog.analytics.title")}
                            </span>
                            <div className="text-subflow-500">
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.analytics.description1",
                                    )}
                                </span>
                                <ChartPie
                                    className="text-subflow-50 mx-1 inline h-4 w-4 align-middle"
                                    strokeWidth={2.5}
                                />
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.analytics.description2",
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-0.5">
                            <span className="text-subflow-50 pb-2 text-base tracking-widest sm:text-lg">
                                {t("descriptionDialog.moreMenu.title")}
                            </span>
                            <div className="text-subflow-500">
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.moreMenu.description1",
                                    )}
                                </span>
                                <CircleEllipsis
                                    className="text-subflow-50 mx-1 inline h-4 w-4 align-middle"
                                    strokeWidth={2.5}
                                />
                                <span className="align-middle">
                                    {t(
                                        "descriptionDialog.moreMenu.description2",
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
