/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CalendarDays, CreditCardIcon, ChartPie } from "lucide-react";
import CardSwap, { Card } from "@/components/homepage/card-swap";
import CardDescription from "@/components/homepage/card-description";

export default function CardSwapDescription() {
    const t = useTranslations("HomePage");

    const [cardSwapWidth, setCardSwapWidth] = useState(0);
    const cardSwapRefs = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (cardSwapRefs.current) {
                setCardSwapWidth(cardSwapRefs.current.offsetWidth);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className="bg-subflow-800 border-subflow-800 -mt-6 grid w-[95%] grid-cols-1 overflow-hidden rounded-xl border-4 lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[750px] 2xl:w-[85%]"
            style={{
                height:
                    cardSwapWidth > 1024 ? `${cardSwapWidth + 50}px` : "auto",
            }}
        >
            <div className="col-span-1 flex flex-col items-center justify-center gap-y-12 py-12 lg:py-0">
                <div className="flex flex-col gap-y-12">
                    <CardDescription
                        icon={
                            <CalendarDays
                                size={28}
                                strokeWidth={2.2}
                                className="text-subflow-50"
                            />
                        }
                        title={t("cardOne.title")}
                        description={t("cardOne.description")}
                        img="homepage-images/card-one.png"
                    />
                    <CardDescription
                        icon={
                            <CreditCardIcon
                                size={28}
                                strokeWidth={2.2}
                                className="text-subflow-50"
                            />
                        }
                        title={t("cardTwo.title")}
                        description={t("cardTwo.description")}
                        img="homepage-images/card-two.png"
                    />
                    <CardDescription
                        icon={
                            <ChartPie
                                size={28}
                                strokeWidth={2.2}
                                className="text-subflow-50"
                            />
                        }
                        title={t("cardThree.title")}
                        description={t("cardThree.description")}
                        img="homepage-images/card-three.png"
                    />
                </div>
            </div>
            <div
                className="relative col-span-1 hidden lg:block"
                ref={cardSwapRefs}
            >
                <CardSwap
                    width={cardSwapWidth}
                    height={cardSwapWidth - 100}
                    cardDistance={80}
                    verticalDistance={100}
                    delay={5000}
                    skewAmount={0}
                    pauseOnHover={false}
                >
                    <Card>
                        <img src="homepage-images/card-one.png" alt="Card 1" />
                    </Card>
                    <Card>
                        <img src="homepage-images/card-two.png" alt="Card 2" />
                    </Card>
                    <Card>
                        <img
                            src="homepage-images/card-three.png"
                            alt="Card 3"
                        />
                    </Card>
                </CardSwap>
            </div>
        </div>
    );
}
