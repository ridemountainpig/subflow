"use client";

import React, { useEffect, useState, ComponentType } from "react";
import {
    subscriptionServices,
    SubscriptionServices,
} from "@/data/subscriptionServices";
import { motion, AnimatePresence } from "framer-motion";

// randomize the order of the services
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function SubscriptionStackAnimation() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledServices, setShuffledServices] = useState<
        SubscriptionServices[]
    >(() => {
        return subscriptionServices;
    });
    const displayCount = 3;

    useEffect(() => {
        const timer = setTimeout(() => {
            setShuffledServices(shuffleArray(subscriptionServices));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (shuffledServices.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % shuffledServices.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [shuffledServices.length]);

    const getVisibleServices = () => {
        if (shuffledServices.length === 0) return [];

        const services = [];
        for (let i = 0; i < displayCount; i++) {
            const index = (currentIndex + i) % shuffledServices.length;
            const service = shuffledServices[index];
            if (service) {
                services.push(service);
            }
        }
        return services;
    };

    const getStackBackground = (index: number) => {
        const backgrounds = [
            "bg-subflow-800",
            "bg-subflow-500",
            "bg-subflow-200",
        ];
        return backgrounds[index] || "bg-gray-400";
    };

    return (
        <div className="relative h-30 w-20 perspective-midrange md:w-22">
            <AnimatePresence mode="popLayout">
                {getVisibleServices().map((service, index) => {
                    const Icon = service.icon;
                    const isTopCard = index === 0;
                    const isBottomCard = index === displayCount - 1;
                    const stackOffset = index * 12;
                    const scaleReduction = index * 0.1;

                    return (
                        <motion.div
                            key={`${service.uuid}-${currentIndex}-${index}`}
                            initial={{
                                opacity: isBottomCard ? 0 : 1,
                                scale: isBottomCard
                                    ? 0.8
                                    : 1 - (index + 1) * 0.1,
                                y: isBottomCard ? 40 : -(index + 1) * 20,
                                z: isBottomCard ? -50 : 0,
                                rotateX: isBottomCard ? 15 : (index + 1) * 3,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1 - scaleReduction,
                                y: -stackOffset,
                                z: 0,
                                rotateX: index * 3,
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.7,
                                y: isTopCard ? -40 : -stackOffset,
                                z: isTopCard ? 50 : 0,
                                rotateX: isTopCard ? -15 : index * 3,
                            }}
                            transition={{
                                duration: 0.6,
                                ease: [0.25, 0.46, 0.45, 0.94],
                                opacity: { duration: 0.4 },
                            }}
                            className={`absolute top-0 left-0 rounded-2xl p-3 ${getStackBackground(index)} `}
                            style={{
                                zIndex: displayCount - index,
                                transformStyle: "preserve-3d",
                            }}
                        >
                            {isTopCard ? (
                                <div className="h-14 w-14 overflow-hidden rounded-lg md:h-16 md:w-16">
                                    {React.createElement(
                                        Icon as ComponentType<{
                                            className?: string;
                                        }>,
                                        {
                                            className: "h-full w-full",
                                        },
                                    )}
                                </div>
                            ) : (
                                <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-gray-400 to-gray-500 opacity-50 shadow-inner md:h-16 md:w-16" />
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
