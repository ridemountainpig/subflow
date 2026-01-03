import { ComponentType } from "react";
import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { subscriptionServices } from "@/data/subscriptionServices";
import { Subscription } from "@/types/subscription";
import FormattedNumber from "@/components/subscription/formatted-number";
import UpdateSubscriptionDialog from "@/components/subscription/update-subscription-dialog";
import DeleteSubscriptionDialog from "@/components/subscription/delete-subscription-dialog";
import LeaveCoSubscriptionDialog from "@/components/subscription/leave-co-subscription-dialog";
import { usePreferences } from "@/app/contexts/PreferencesContext";

interface SubscriptionListItemProps {
    subscription: Subscription;
    onSuccess?: () => void;
}

export default function SubscriptionListItem({
    subscription,
    onSuccess,
}: SubscriptionListItemProps) {
    const t = useTranslations("SubscriptionPage");
    const { notAmortizeYearlySubscriptions } = usePreferences();
    const Icon = subscriptionServices.find(
        (service) => service.uuid === subscription.serviceId,
    )?.icon as ComponentType<{ className?: string }>;

    return (
        <div className="flex flex-col gap-y-2 px-0.5 lg:gap-y-1">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-2">
                    {Icon ? (
                        <Icon className="h-5 w-5" />
                    ) : (
                        <span className="bg-subflow-900 border-subflow-100 flex h-7 w-7 items-center justify-center rounded-md border-2 text-lg">
                            {subscription.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="text-base tracking-wider">
                        {subscription.name.charAt(0).toUpperCase() +
                            subscription.name.slice(1)}
                    </span>
                </div>
                <div className="flex items-center gap-x-2 tracking-widest">
                    <FormattedNumber
                        value={Math.round(
                            subscription.paymentCycle === "yearly" &&
                                !notAmortizeYearlySubscriptions
                                ? subscription.price / 12
                                : subscription.price,
                        )}
                        className="text-base"
                    />
                    <span className="text-[11px]">{subscription.currency}</span>
                </div>
            </div>
            <div className="text-subflow-400 flex items-center justify-between gap-x-2 tracking-widest">
                <span className="text-[13px]">
                    {t(subscription.paymentCycle)}
                    {subscription.paymentCycle === "yearly" &&
                        !notAmortizeYearlySubscriptions &&
                        t("yearlyDescription")}
                    {subscription.isCoSubscription
                        ? ", " + t("sharedSubscription")
                        : ""}
                </span>
                {subscription.isCoSubscription ? (
                    <LeaveCoSubscriptionDialog
                        subscription={subscription}
                        onSuccess={onSuccess}
                    />
                ) : (
                    <div className="flex items-center gap-x-0.5">
                        {(subscription.coSubscribers?.length ?? 0) > 0 && (
                            <div
                                className="flex h-6 w-6 items-center justify-center"
                                title={t("sharedSubscription")}
                            >
                                <Users size={16} strokeWidth={2.5} />
                            </div>
                        )}
                        <UpdateSubscriptionDialog
                            subscription={subscription}
                            onSuccess={onSuccess}
                        />
                        <DeleteSubscriptionDialog
                            subscription={subscription}
                            onSuccess={onSuccess}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
