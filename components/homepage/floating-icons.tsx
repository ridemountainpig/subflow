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
}

const SELECTED_ICONS = [
    { name: "Lovable", x: 50, y: -10 },
    { name: "Vercel", x: 30, y: -16 },
    { name: "OpenAI", x: 40, y: 100 },
    { name: "Zeabur", x: 60, y: 90 },
    { name: "Raycast", x: 10, y: -5 },
    { name: "GitHub Copilot", x: 5, y: 20 },
    { name: "Figma", x: 100, y: 25 },
    { name: "VS Code", x: 10, y: 80 },
    { name: "Discord", x: 90, y: 70 },
    { name: "Spotify", x: 80, y: 5 },
    { name: "Claude AI", x: 65, y: -15 },
    { name: "Netflix", x: 15, y: 55 },
    { name: "YouTube", x: 85, y: 45 },
    { name: "Gemini", x: 20, y: 90 },
    { name: "Notion", x: 75, y: 85 },
    { name: "Slack", x: -5, y: 60 },
];

export default function FloatingIcons() {
    const [services, setServices] = useState<ServiceWithPosition[]>([]);

    useEffect(() => {
        const selectedServices = SELECTED_ICONS.map((icon, index) => {
            const service = subscriptionServices.find(
                (s) => s.name === icon.name,
            );
            if (!service) return null;

            return {
                ...service,
                x: icon.x,
                y: icon.y,
                delay: (index * 0.2) % 3,
                duration: 4,
            };
        }).filter(
            (service): service is ServiceWithPosition => service !== null,
        );

        setServices(selectedServices);
    }, []);

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
                        className="absolute z-10"
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
                        <Icon className="h-14 w-14 rounded-lg" />
                    </motion.div>
                );
            })}
        </>
    );
}
