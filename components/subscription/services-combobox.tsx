"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Check, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { subscriptionServices } from "@/data/subscriptionServices";

interface ServicesComboboxProps {
    selectedServiceName: string;
    setSelectedServiceName: (serviceName: string) => void;
    selectedServiceUuid: string;
    setSelectedServiceUuid: (serviceUuid: string) => void;
}

export default function ServicesCombobox({
    selectedServiceName,
    setSelectedServiceName,
    selectedServiceUuid,
    setSelectedServiceUuid,
}: ServicesComboboxProps) {
    const t = useTranslations("SubscriptionPage");
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    return (
        <>
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="bg-subflow-100 text-subflow-800 hover:bg-subflow-100 hover:text-subflow-800 w-full cursor-pointer justify-between"
                onClick={() => setOpen(true)}
            >
                {selectedServiceName ? (
                    selectedServiceUuid === "custom" ? (
                        <div className="flex items-center gap-2">
                            <div className="bg-subflow-900 text-subflow-100 flex h-5 w-5 items-center justify-center rounded-full text-xl">
                                {selectedServiceName[0].toUpperCase()}
                            </div>
                            <span className="text-sm tracking-widest">
                                {selectedServiceName}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4">
                                {(() => {
                                    const service = subscriptionServices.find(
                                        (service) =>
                                            service.name ===
                                            selectedServiceName,
                                    );
                                    return service?.icon
                                        ? React.createElement(service.icon)
                                        : null;
                                })()}
                            </div>
                            <span className="text-sm tracking-widest">
                                {
                                    subscriptionServices.find(
                                        (service) =>
                                            service.name ===
                                            selectedServiceName,
                                    )?.name
                                }
                            </span>
                        </div>
                    )
                ) : (
                    t("servicePlaceholder")
                )}
                <MousePointerClick />
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                className="border-subflow-100 w-[95%] rounded-2xl border-[3px]"
            >
                <CommandInput
                    placeholder={t("searchService")}
                    className="bg-subflow-900 text-subflow-100 h-9 tracking-widest"
                    onValueChange={(value) => {
                        setSearchValue(value);
                    }}
                    onKeyDown={(e) => {
                        if (
                            e.key === "Enter" &&
                            !subscriptionServices.some((service) =>
                                service.name
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase()),
                            ) &&
                            searchValue
                        ) {
                            setSelectedServiceName(searchValue);
                            setSelectedServiceUuid("custom");
                            setOpen(false);
                        }
                    }}
                />
                <CommandList className="bg-subflow-900 text-subflow-100 custom-scrollbar py-2">
                    <CommandEmpty className="px-2 py-1">
                        <div
                            className="text-subflow-900 bg-subflow-100 cursor-pointer rounded-sm focus:outline-none"
                            onClick={() => {
                                setSelectedServiceName(searchValue);
                                setSelectedServiceUuid("custom");
                                setOpen(false);
                            }}
                            tabIndex={0}
                            role="button"
                        >
                            <div className="flex h-fit items-center gap-3 px-2 py-3">
                                <div className="bg-subflow-900 text-subflow-100 flex h-5 w-5 items-center justify-center rounded-full text-xl">
                                    {searchValue &&
                                        searchValue[0].toUpperCase()}
                                </div>
                                <span className="text-sm tracking-widest">
                                    {searchValue}
                                </span>
                            </div>
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        {subscriptionServices.map((service) => (
                            <CommandItem
                                key={service.uuid}
                                value={service.name}
                                onSelect={(currentValue) => {
                                    setSelectedServiceName(
                                        currentValue === selectedServiceName
                                            ? ""
                                            : currentValue,
                                    );
                                    setSelectedServiceUuid(
                                        currentValue === selectedServiceName
                                            ? ""
                                            : service.uuid,
                                    );
                                    setOpen(false);
                                }}
                                className="text-subflow-100 cursor-pointer tracking-widest"
                            >
                                <div className="flex h-fit items-center gap-3">
                                    <div className="h-4 w-4">
                                        <service.icon />
                                    </div>
                                    <span>{service.name}</span>
                                </div>
                                <Check
                                    className={cn(
                                        "ml-auto",
                                        selectedServiceUuid === service.uuid
                                            ? "opacity-100"
                                            : "opacity-0",
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
