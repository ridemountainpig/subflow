"use client";

import { motion } from "framer-motion";

interface CardDescriptionProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export default function CardDescription({
    icon,
    title,
    description,
}: CardDescriptionProps) {
    return (
        <motion.div
            className="flex flex-col gap-y-4"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
        >
            <div className="flex h-fit items-center gap-x-3">
                <div className="bg-subflow-900 flex h-12 w-12 items-center justify-center rounded-xl p-2">
                    {icon}
                </div>
                <h3 className="text-subflow-50 font-poetsen text-3xl font-bold tracking-wider select-none">
                    {title}
                </h3>
            </div>
            <p className="text-subflow-300 font-poetsen text-lg font-bold tracking-widest select-none">
                {description}
            </p>
        </motion.div>
    );
}
