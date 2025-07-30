"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
    startDate: Date;
    setStartDate: (date: Date) => void;
}

export default function DatePicker({
    startDate,
    setStartDate,
}: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "bg-subflow-100 text-subflow-800 hover:bg-subflow-100 hover:text-subflow-800 h-10 w-full cursor-pointer justify-start text-left text-xs font-normal tracking-wider sm:text-base",
                        !startDate && "text-muted-foreground",
                    )}
                >
                    <CalendarIcon className="h-4 w-4" strokeWidth={2.7} />
                    {startDate ? (
                        format(startDate, "PPP")
                    ) : (
                        <span>Pick a date</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                />
            </PopoverContent>
        </Popover>
    );
}
