/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";

interface CardDescriptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    img: string;
}

export default function CardDescription({
    icon,
    title,
    description,
    img,
}: CardDescriptionProps) {
    return (
        <motion.div
            className="flex flex-col gap-y-4"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="flex h-fit flex-col items-center justify-center gap-x-3 gap-y-4 lg:flex-row lg:justify-start lg:gap-y-0 lg:pl-4">
                <div className="bg-subflow-900 flex h-12 w-12 items-center justify-center rounded-xl p-2 lg:h-10 lg:w-10 xl:h-12 xl:w-12">
                    {icon}
                </div>
                <h3 className="text-subflow-50 text-xl font-bold tracking-wider select-none sm:text-2xl xl:text-3xl">
                    {title}
                </h3>
            </div>
            <p className="text-subflow-300 text-center text-sm font-bold tracking-widest select-none sm:text-base lg:pl-4 lg:text-left xl:text-lg">
                {description}
            </p>
            <div className="flex w-full items-center justify-center lg:hidden">
                <img
                    src={img}
                    alt={title}
                    className="border-subflow-50 w-[90%] rounded-xl border-4 sm:w-[80%]"
                />
            </div>
        </motion.div>
    );
}
