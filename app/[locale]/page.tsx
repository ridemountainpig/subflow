/* eslint-disable @next/next/no-img-element */
import { useTranslations, useLocale } from "next-intl";
import {
    CalendarDays,
    CreditCard as CreditCardIcon,
    ChartPie,
    Coins,
    CalendarSync,
    DollarSign,
} from "lucide-react";
import GetStartBtn from "@/components/homepage/get-start-btn";
import GoSubscriptionBtn from "@/components/homepage/go-subscription-btn";
import SubscriptionStackAnimation from "@/components/homepage/subscription-stack-animation";
import SplitText from "@/components/homepage/split-text";
import CardSwap, { Card } from "@/components/homepage/card-swap";
import CardDescription from "@/components/homepage/card-description";
import SpotlightCard from "@/components/homepage/spotlight-card";
import SpotlightCardContent from "@/components/homepage/spotlight-card-content";
import FloatingIcons from "@/components/homepage/floating-icons";
import Footer from "@/components/footer";

export default function Home() {
    const t = useTranslations("HomePage");
    const locale = useLocale();
    return (
        <div className="bg-subflow-900 flex h-fit w-full flex-col items-center justify-center">
            <div className="relative flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-y-10">
                <GoSubscriptionBtn />
                <div className="flex flex-col items-center">
                    <h2 className="hidden">{t("title")}</h2>
                    <SubscriptionStackAnimation />
                    <SplitText
                        text={t("titleSplitOne")}
                        delay={locale === "zh" ? 150 : 200}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 text-center text-[55px] leading-tight font-bold tracking-widest"
                    />
                    <SplitText
                        text={t("titleSplitTwo")}
                        delay={locale === "zh" ? 150 : 200}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 text-center text-[55px] leading-tight font-bold tracking-widest"
                    />
                </div>
                <span className="text-subflow-500 text-center text-lg font-bold tracking-widest">
                    {t("subtitle")}
                </span>
                <div className="flex items-center justify-center gap-x-2">
                    <div className="bg-subflow-800 border-subflow-800 rounded-xl border-2 p-2 px-3">
                        <span className="text-subflow-50 text-base font-bold tracking-widest select-none">
                            {t("free")}
                        </span>
                    </div>
                    <GetStartBtn />
                </div>
            </div>
            <div className="bg-subflow-800 border-subflow-800 -mt-6 grid h-[700px] w-[85%] grid-cols-2 overflow-hidden rounded-xl border-4">
                <div className="col-span-1 flex flex-col items-center justify-center gap-y-12">
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
                        />
                    </div>
                </div>
                <div className="relative col-span-1">
                    <CardSwap
                        width={700}
                        height={600}
                        cardDistance={80}
                        verticalDistance={100}
                        delay={5000}
                        skewAmount={0}
                        pauseOnHover={false}
                    >
                        <Card>
                            <img
                                src="homepage-images/card-one.png"
                                alt="Card 1"
                            />
                        </Card>
                        <Card>
                            <img
                                src="homepage-images/card-two.png"
                                alt="Card 2"
                            />
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
            <div className="bg-subflow-900 flex w-full flex-col items-center justify-center py-20 pt-44">
                <SplitText
                    text={t("spotlightTitle")}
                    delay={locale === "zh" ? 30 : 50}
                    duration={1}
                    splitType={locale === "zh" ? "chars" : "words"}
                    className="text-subflow-50 text-center text-5xl leading-tight font-bold tracking-widest"
                />
                <div className="mt-10 grid w-[85%] grid-cols-9 gap-4">
                    <SpotlightCard
                        className="custom-spotlight-card col-span-5 w-full rounded-xl"
                        spotlightColor="rgba(250, 240, 230, 0.1)"
                    >
                        <SpotlightCardContent
                            icon={
                                <Coins
                                    size={28}
                                    strokeWidth={2.5}
                                    className="text-subflow-50"
                                />
                            }
                            title={t("spotlightCardOne.title")}
                            description={t("spotlightCardOne.description")}
                        />
                    </SpotlightCard>
                    <SpotlightCard
                        className="custom-spotlight-card col-span-4 w-full rounded-xl"
                        spotlightColor="rgba(250, 240, 230, 0.2)"
                    >
                        <SpotlightCardContent
                            icon={
                                <img
                                    src="homepage-images/svgl.svg"
                                    alt="SVGL"
                                    width={30}
                                    height={30}
                                    className="text-subflow-50 scale-170"
                                />
                            }
                            title={t("spotlightCardTwo.title")}
                            description={
                                <span>
                                    {t("spotlightCardTwo.descriptionOne")}{" "}
                                    <a
                                        className="text-subflow-500 underline decoration-wavy"
                                        href="https://svgl.app"
                                        target="_blank"
                                    >
                                        SVGL
                                    </a>{" "}
                                    {t("spotlightCardTwo.descriptionTwo")}
                                </span>
                            }
                        />
                    </SpotlightCard>
                    <SpotlightCard
                        className="custom-spotlight-card col-span-4 w-full rounded-xl"
                        spotlightColor="rgba(250, 240, 230, 0.2)"
                    >
                        <SpotlightCardContent
                            icon={
                                <CalendarSync
                                    size={28}
                                    strokeWidth={2.5}
                                    className="text-subflow-50"
                                />
                            }
                            title={t("spotlightCardThree.title")}
                            description={t("spotlightCardThree.description")}
                        />
                    </SpotlightCard>
                    <SpotlightCard
                        className="custom-spotlight-card col-span-5 w-full rounded-xl"
                        spotlightColor="rgba(250, 240, 230, 0.2)"
                    >
                        <SpotlightCardContent
                            icon={
                                <DollarSign
                                    size={28}
                                    strokeWidth={2.5}
                                    className="text-subflow-50"
                                />
                            }
                            title={t("spotlightCardFour.title")}
                            description={t("spotlightCardFour.description")}
                        />
                    </SpotlightCard>
                </div>
            </div>
            <div className="bg-subflow-900 flex w-full justify-center py-44">
                <div className="relative flex h-[50vh] w-2/3 flex-col items-center justify-center gap-y-8">
                    <SplitText
                        text={t("bottomTitle")}
                        delay={locale === "zh" ? 20 : 50}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 z-20 text-center text-3xl font-bold tracking-widest"
                    />
                    <SplitText
                        text={t("bottomSubtitle")}
                        delay={locale === "zh" ? 20 : 50}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-700 z-20 text-center text-lg font-bold tracking-widest"
                    />
                    <GetStartBtn />
                    <FloatingIcons />
                </div>
            </div>
            <Footer />
        </div>
    );
}
