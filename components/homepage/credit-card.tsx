/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { useState, useEffect, useMemo } from "react";
import { getSubscriptionCount } from "@/app/action";

export default function CreditCard() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            const subscriptionCount = await getSubscriptionCount();
            setCount(subscriptionCount);
        };

        fetchCount();
    }, []);

    const groups = useMemo(() => {
        const countString = count.toString();
        const totalDots = 16 - countString.length;

        const elements = Array.from({ length: 16 }, (_, i) => {
            if (i < totalDots) {
                return <Dot key={`dot-${i}`} />;
            }
            const digitIndex = i - totalDots;
            return (
                <span key={`digit-${digitIndex}`} className="text-lg">
                    {countString[digitIndex]}
                </span>
            );
        });

        return Array.from({ length: 4 }, (_, i) =>
            elements.slice(i * 4, (i + 1) * 4),
        );
    }, [count]);

    return (
        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="from-subflow-900 to-subflow-700 relative h-fit w-[350px] rounded-2xl bg-gradient-to-br p-6 tracking-widest text-white shadow-xl select-none sm:w-[360px] lg:w-[380px]"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">SUBSCRIPTIONS TRACKED</h2>
                    <div className="h-10 w-10 rounded-full bg-white/10">
                        <img
                            src="/subflow-dark.svg"
                            alt="Subflow"
                            className="h-10 w-10"
                        />
                    </div>
                </div>

                <div className="mt-4 flex h-fit items-center">
                    <div className="flex space-x-4">
                        {groups.map((group, groupIndex) => (
                            <div
                                key={`group-${groupIndex}`}
                                className="flex items-center space-x-2"
                            >
                                {group}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex items-end justify-between">
                    <div>
                        <p className="text-subflow-400 text-sm">
                            Manage Subscriptions with
                        </p>
                        <p className="text-lg font-medium">Subflow</p>
                    </div>
                </div>
            </motion.div>
        </Tilt>
    );
}

function Dot() {
    return <div className="h-[6.5px] w-[6.5px] rounded-full bg-white" />;
}
