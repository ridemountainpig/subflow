/* eslint-disable @next/next/no-img-element */
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
    return (
        <div className="bg-subflow-900 flex h-fit w-full flex-col items-center justify-center">
            <div className="relative flex h-[calc(100vh-120px)] w-full flex-col items-center justify-center gap-y-10">
                <GoSubscriptionBtn />
                <div className="flex flex-col items-center">
                    <h2 className="hidden">
                        Flow Through Your Subscriptions with Clarity.
                    </h2>
                    <SubscriptionStackAnimation />
                    <SplitText
                        text="Flow Through Your"
                        delay={200}
                        duration={1}
                        splitType="words"
                        className="text-subflow-50 font-poetsen text-center text-[55px] leading-tight font-bold tracking-widest"
                    />
                    <SplitText
                        text="Subscriptions with Clarity"
                        delay={200}
                        duration={1}
                        splitType="words"
                        className="text-subflow-50 font-poetsen text-center text-[55px] leading-tight font-bold tracking-widest"
                    />
                </div>
                <span className="text-subflow-500 font-poetsen text-center text-lg font-bold tracking-widest">
                    Track, organize, and simplify your subscription flow.
                </span>
                <div className="flex items-center justify-center gap-x-2">
                    <div className="bg-subflow-800 border-subflow-800 rounded-xl border-2 p-2 px-3">
                        <span className="text-subflow-50 font-poetsen text-base font-bold tracking-widest select-none">
                            No Pricing. Just Free.
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
                            title="Manage All Your Subscriptions"
                            description="Track, edit, and organize your subscriptions in one place."
                        />
                        <CardDescription
                            icon={
                                <CreditCardIcon
                                    size={28}
                                    strokeWidth={2.2}
                                    className="text-subflow-50"
                                />
                            }
                            title="Never Miss a Subscription Again"
                            description="See upcoming charges right on your calendar."
                        />
                        <CardDescription
                            icon={
                                <ChartPie
                                    size={28}
                                    strokeWidth={2.2}
                                    className="text-subflow-50"
                                />
                            }
                            title="Visualize Your Subscription Flow"
                            description="Understand your spending at a glance."
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
                    text="What Makes Subflow Stand Out"
                    delay={50}
                    duration={1}
                    splitType="words"
                    className="text-subflow-50 font-poetsen text-center text-5xl leading-tight font-bold tracking-widest"
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
                            title="Free Forever"
                            description="No pricing tiers. No paywalls. Subflow is completely free to use."
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
                            title="Multiple Default Services with SVGL"
                            description={
                                <span>
                                    Start quickly with built-in services powered
                                    by{" "}
                                    <a
                                        className="text-subflow-500 underline decoration-wavy"
                                        href="https://svgl.app"
                                        target="_blank"
                                    >
                                        SVGL
                                    </a>{" "}
                                    icons.
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
                            title="Always in Sync"
                            description="Your subscription data is always up to date wherever you log in."
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
                            title="Multi-Currency Support"
                            description="Track your subscriptions in any currency that matters to you."
                        />
                    </SpotlightCard>
                </div>
            </div>
            <div className="bg-subflow-900 flex w-full justify-center py-44">
                <div className="relative flex h-[50vh] w-2/3 flex-col items-center justify-center gap-y-8">
                    <SplitText
                        text="Never lose track of your subscriptions again."
                        delay={50}
                        duration={1}
                        splitType="words"
                        className="text-subflow-50 font-poetsen z-20 text-center text-3xl font-bold tracking-widest"
                    />
                    <SplitText
                        text="Use Subflow for free, forever and stay fully in control."
                        delay={50}
                        duration={1}
                        splitType="words"
                        className="text-subflow-700 font-poetsen z-20 text-center text-lg font-bold tracking-widest"
                    />
                    <GetStartBtn />
                    <FloatingIcons />
                </div>
            </div>
            <Footer />
        </div>
    );
}
