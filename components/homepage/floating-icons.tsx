"use client";

import { subscriptionServices } from "@/data/subscriptionServices";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ComponentType } from "react";

interface IconProps {
    className?: string;
}

interface ServiceWithPosition {
    uuid: string;
    name: string;
    icon: string | ComponentType;
    x: number;
    y: number;
    delay: number;
    duration: number;
    className: string;
}

const SELECTED_ICONS = [
    { name: "Lovable", x: 50, y: -10, className: "" },
    { name: "Zeabur", x: 26, y: -16, className: "" },
    { name: "OpenAI", x: 40, y: 100, className: "sm:block hidden" },
    { name: "Vercel", x: 60, y: 90, className: "sm:block hidden" },
    { name: "Raycast", x: 0, y: -5, className: "" },
    { name: "Slack", x: -15, y: 20, className: "" },
    { name: "Netflix", x: 100, y: 25, className: "" },
    { name: "Discord", x: 90, y: 70, className: "sm:block hidden" },
    { name: "Spotify", x: 80, y: 5, className: "" },
    { name: "Claude AI", x: 72, y: -15, className: "" },
    { name: "Supabase", x: 10, y: 65, className: "sm:block hidden" },
    { name: "YouTube", x: 85, y: 45, className: "md:block hidden" },
    { name: "Gemini", x: 20, y: 90, className: "sm:block hidden" },
    { name: "Notion", x: 75, y: 85, className: "md:block hidden" },
    { name: "Figma", x: -5, y: 60, className: "sm:block hidden" },
];

export default function FloatingIcons() {
    const [services] = useState<ServiceWithPosition[]>(() => {
        return SELECTED_ICONS.map((icon, index) => {
            const service = subscriptionServices.find(
                (s) => s.name === icon.name,
            );
            if (!service) return null;

            return {
                ...service,
                x: icon.x,
                y: icon.y,
                className: icon.className,
                delay: (index * 0.2) % 3,
                duration: 4,
            };
        }).filter(
            (service): service is ServiceWithPosition => service !== null,
        );
    });

    if (services.length === 0) {
        return null;
    }

    return (
        <>
            {services.map((service) => {
                const Icon = service.icon as ComponentType<IconProps>;
                return (
                    <motion.div
                        key={service.uuid}
                        className={`absolute z-10 ${service.className}`}
                        style={{
                            left: `${service.x}%`,
                            top: `${service.y}%`,
                        }}
                        initial={{ opacity: 1 }}
                        animate={{
                            opacity: 1,
                            y: [0, -15, 0],
                            x: [0, 15, 0],
                        }}
                        transition={{
                            duration: service.duration,
                            delay: service.delay,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeInOut",
                        }}
                    >
                        <Icon className="h-10 w-10 rounded-lg sm:h-12 sm:w-12 md:h-14 md:w-14" />
                    </motion.div>
                );
            })}
        </>
    );
}
