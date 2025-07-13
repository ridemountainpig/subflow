/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

const Dot = () => {
    return <div className="h-1.5 w-1.5 rounded-full bg-white" />;
};

export default function CreditCard() {
    return (
        <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} scale={1.05}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="from-subflow-900 to-subflow-700 relative h-fit w-[380px] rounded-2xl bg-gradient-to-br p-6 tracking-widest text-white shadow-xl select-none"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">SUBFLOW CARD</h2>
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
                        <div className="flex items-center space-x-2">
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Dot />
                            <Dot />
                            <Dot />
                            <Dot />
                        </div>
                        <span className="text-base">0802</span>
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
