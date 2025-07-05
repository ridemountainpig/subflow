import { ComponentType } from "react";
import { subscriptionServices } from "@/data/subscriptionServices";
import { Subscription } from "@/types/subscription";
import UpdateSubscriptionDialog from "@/components/subscription/update-subscription-dialog";
import DeleteSubscriptionDialog from "@/components/subscription/delete-subscription-dialog";

interface SubscriptionListItemProps {
    subscription: Subscription;
    onSuccess?: () => void;
}

export default function SubscriptionListItem({
    subscription,
    onSuccess,
}: SubscriptionListItemProps) {
    const Icon = subscriptionServices.find(
        (service) => service.uuid === subscription.serviceId,
    )?.icon as ComponentType<{ className?: string }>;

    return (
        <div className="flex flex-col gap-y-1 px-0.5">
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
                    <span className="text-base">{subscription.price}</span>
                    <span className="text-[11px]">{subscription.currency}</span>
                </div>
            </div>
            <div className="text-subflow-400 flex items-center justify-between gap-x-2 tracking-widest">
                <span className="text-[13px]">
                    {subscription.paymentCycle.charAt(0).toUpperCase() +
                        subscription.paymentCycle.slice(1)}
                </span>
                <div className="flex items-center gap-x-0.5">
                    <UpdateSubscriptionDialog
                        subscription={subscription}
                        onSuccess={onSuccess}
                    />
                    <DeleteSubscriptionDialog
                        subscription={subscription}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    );
}
