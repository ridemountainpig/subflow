/* eslint-disable @next/next/no-img-element */
import { useTranslations, useLocale } from "next-intl";
import { Coins, CalendarSync, DollarSign } from "lucide-react";
import GetStartBtn from "@/components/homepage/get-start-btn";
import GoSubscriptionBtn from "@/components/homepage/go-subscription-btn";
import SubscriptionStackAnimation from "@/components/homepage/subscription-stack-animation";
import SplitText from "@/components/homepage/split-text";
import CardSwapDescription from "@/components/homepage/card-swap-description";
import SpotlightCard from "@/components/homepage/spotlight-card";
import SpotlightCardContent from "@/components/homepage/spotlight-card-content";
import FloatingIcons from "@/components/homepage/floating-icons";
import Footer from "@/components/footer";

export default function Home() {
    const t = useTranslations("HomePage");
    const locale = useLocale();
    return (
        <div className="bg-subflow-900 flex h-fit w-full flex-col items-center justify-center">
            <div className="relative flex h-[calc(100vh-120px)] min-h-[600px] flex-col items-center justify-center gap-y-10">
                <GoSubscriptionBtn />
                <div className="flex flex-col items-center px-4">
                    <h2 className="hidden">{t("title")}</h2>
                    <SubscriptionStackAnimation />
                    <SplitText
                        text={t("titleSplitOne")}
                        delay={locale === "zh" ? 150 : 200}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 text-center text-3xl leading-tight font-bold tracking-widest lg:text-5xl xl:text-[55px]"
                    />
                    <SplitText
                        text={t("titleSplitTwo")}
                        delay={locale === "zh" ? 150 : 200}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 text-center text-3xl leading-tight font-bold tracking-widest lg:text-5xl xl:text-[55px]"
                    />
                </div>
                <span className="text-subflow-500 px-4 text-center text-base font-bold tracking-widest lg:text-lg">
                    {t("subtitle")}
                </span>
                <div className="flex items-center justify-center gap-x-2">
                    <div className="bg-subflow-800 border-subflow-800 flex h-full items-center justify-center rounded-lg border-2 p-2 px-1.5 sm:rounded-xl sm:px-3">
                        <span className="text-subflow-50 text-xs font-bold tracking-widest select-none md:text-sm lg:text-base">
                            {t("free")}
                        </span>
                    </div>
                    <GetStartBtn />
                </div>
            </div>
            <CardSwapDescription />
            <div className="bg-subflow-900 flex w-full flex-col items-center justify-center py-20 pt-20 lg:pt-44">
                <SplitText
                    text={t("spotlightTitle")}
                    delay={locale === "zh" ? 30 : 50}
                    duration={1}
                    splitType={locale === "zh" ? "chars" : "words"}
                    className="text-subflow-50 px-6 text-center text-3xl leading-tight font-bold tracking-widest lg:text-5xl"
                />
                <div className="mt-10 grid w-[95%] grid-cols-9 gap-4 2xl:w-[85%]">
                    <SpotlightCard
                        className="custom-spotlight-card col-span-9 w-full rounded-xl lg:col-span-5"
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
                        className="custom-spotlight-card col-span-9 w-full rounded-xl lg:col-span-4"
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
                        className="custom-spotlight-card col-span-9 w-full rounded-xl lg:col-span-4"
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
                        className="custom-spotlight-card col-span-9 w-full rounded-xl lg:col-span-5"
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
            <div className="bg-subflow-900 flex w-full justify-center py-34 lg:py-44">
                <div className="relative flex h-[50vh] min-h-fit w-2/3 flex-col items-center justify-center gap-y-8">
                    <SplitText
                        text={t("bottomTitle")}
                        delay={locale === "zh" ? 20 : 50}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-50 z-20 text-center text-2xl font-bold tracking-widest sm:text-3xl"
                    />
                    <SplitText
                        text={t("bottomSubtitle")}
                        delay={locale === "zh" ? 20 : 50}
                        duration={1}
                        splitType={locale === "zh" ? "chars" : "words"}
                        className="text-subflow-700 z-20 text-center text-sm font-bold tracking-widest sm:text-base lg:text-lg"
                    />
                    <GetStartBtn />
                    <FloatingIcons />
                </div>
            </div>
            <Footer />
        </div>
    );
}
