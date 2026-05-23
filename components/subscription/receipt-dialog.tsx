/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
    AnimatePresence,
    animate as motionAnimate,
    motion,
    useMotionValue,
    useMotionValueEvent,
    useTransform,
} from "framer-motion";
import { Download, Receipt as ReceiptIcon, X } from "lucide-react";
import { toPng } from "html-to-image";
import { toast } from "sonner";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    SubscriptionPaymentCycle,
    SubscriptionWithPrice,
} from "@/types/subscription";
import { subscriptionVisibleInMonth } from "@/utils/subscriptionCycle";
import { getEffectiveConvertedPrice } from "./chart-dialog-utils";

interface ReceiptDialogProps {
    subscriptions: SubscriptionWithPrice[];
    year: number;
    month: number;
    currency: string;
    userEmail?: string;
}

interface ReceiptItem {
    name: string;
    amount: number;
    currency: string;
    convertedAmount: number;
    cycle: SubscriptionPaymentCycle;
}

type Stage = "ready" | "printing" | "printed";

const PRINT_DURATION = 2.4;
const PULL_THRESHOLD = 120;
const PULL_MAX = 260;

// framer-motion's color interpolator needs parseable endpoints; `var(...)` is
// opaque to it, so we mirror the literal hex from globals.css here.
const SUBFLOW_900 = "#27272a";
const RELEASE_GREEN = "#10b981";

// Fixed but irregular barcode pattern — keeps every receipt looking like a
// real barcode without spending real bandwidth on encoding anything.
const BARCODE_BARS = [
    3, 1, 5, 1, 2, 4, 1, 3, 2, 5, 1, 2, 4, 1, 3, 1, 2, 5, 1, 4, 2, 1, 3, 5, 1,
    2, 4, 1, 3, 2, 1, 5, 2, 3, 1, 4, 1, 2, 5, 1, 3, 4, 1, 2, 1, 5, 3, 1, 2, 4,
    1, 3, 5, 2, 1, 4, 2, 1, 3, 1, 5, 2, 4, 1, 3, 1, 2,
];

const amountFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const formatAmount = (value: number) => amountFormatter.format(value);

const ZIGZAG_TOP =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 8' preserveAspectRatio='none'><polygon points='0,8 10,0 20,8' fill='%23ffffff'/></svg>\")";
const ZIGZAG_BOTTOM =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 8' preserveAspectRatio='none'><polygon points='0,0 10,8 20,0' fill='%23ffffff'/></svg>\")";

// Rubber-band easing: as raw grows, the result asymptotes to PULL_MAX so the
// pull feels resistant the further you go, never running away to infinity.
const rubberBand = (raw: number) => {
    if (raw <= 0) return 0;
    return (raw * PULL_MAX) / (raw + PULL_MAX);
};

export default function ReceiptDialog({
    subscriptions,
    year,
    month,
    currency,
    userEmail,
}: ReceiptDialogProps) {
    const t = useTranslations("SubscriptionPage");
    const locale = useLocale();
    const [isOpen, setIsOpen] = useState(false);
    const [stage, setStage] = useState<Stage>("ready");
    const [isDownloading, setIsDownloading] = useState(false);
    const [printedCount, setPrintedCount] = useState(0);
    const [pastThreshold, setPastThreshold] = useState(false);
    const [isTorn, setIsTorn] = useState(false);
    const receiptRef = useRef<HTMLDivElement>(null);
    const paperRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    // Mutable refs the gesture handlers read so we don't have to re-attach
    // listeners every time React state churns.
    const stageRef = useRef<Stage>("ready");
    const downloadingRef = useRef(false);

    const pullY = useMotionValue(0);
    const paperY = useTransform(pullY, (v) => -v);
    const tearOpacity = useTransform(
        pullY,
        [0, 12, PULL_THRESHOLD * 0.3],
        [0, 1, 1],
        { clamp: true },
    );
    const scrapY = useTransform(pullY, (v) => v);
    const hintOpacity = useTransform(pullY, [0, PULL_THRESHOLD * 0.5], [1, 0], {
        clamp: true,
    });

    useMotionValueEvent(pullY, "change", (latest) => {
        setPastThreshold(latest >= PULL_THRESHOLD);
    });

    useEffect(() => {
        stageRef.current = stage;
    }, [stage]);

    useEffect(() => {
        downloadingRef.current = isDownloading;
    }, [isDownloading]);

    const items = useMemo<ReceiptItem[]>(() => {
        // Hardcoded `true` (non-amortized): a receipt should only list charges
        // that actually hit the user's account this month, regardless of the
        // page's amortize-yearly preference.
        return subscriptions
            .filter((sub) => subscriptionVisibleInMonth(sub, year, month, true))
            .map((sub) => {
                const converted = getEffectiveConvertedPrice(
                    sub,
                    currency,
                    userEmail,
                );
                if (converted == null) return null;
                const coSub =
                    sub.isCoSubscription && userEmail
                        ? sub.coSubscribers?.find((c) => c.email === userEmail)
                        : undefined;
                const original =
                    coSub && coSub.amount !== undefined
                        ? { amount: coSub.amount, currency: coSub.currency }
                        : { amount: sub.price, currency: sub.currency };
                return {
                    name: sub.name,
                    amount: original.amount,
                    currency: original.currency,
                    convertedAmount: converted,
                    cycle: sub.paymentCycle,
                };
            })
            .filter((item): item is ReceiptItem => item !== null)
            .sort((a, b) => b.convertedAmount - a.convertedAmount);
    }, [subscriptions, year, month, currency, userEmail]);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + item.convertedAmount, 0),
        [items],
    );

    const period = `${year}-${String(month).padStart(2, "0")}`;

    const { dateLabel, timeLabel } = useMemo(() => {
        const now = new Date();
        const isCurrentMonth =
            now.getFullYear() === year && now.getMonth() + 1 === month;
        const base = isCurrentMonth ? now : new Date(year, month - 1, 1);
        const date = new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
            .format(base)
            .toUpperCase();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        return { dateLabel: date, timeLabel: `${hh}:${mm}` };
    }, [year, month, locale]);

    useEffect(() => {
        if (stage !== "printing" || items.length === 0) {
            setPrintedCount(items.length);
            return;
        }
        const stepMs = (PRINT_DURATION * 1000) / items.length;
        let count = 1;
        setPrintedCount(1);
        const id = window.setInterval(() => {
            count = Math.min(count + 1, items.length);
            setPrintedCount(count);
            if (count >= items.length) window.clearInterval(id);
        }, stepMs);
        return () => window.clearInterval(id);
    }, [stage, items.length]);

    useEffect(() => {
        if (stage === "ready") {
            pullY.set(0);
            setPastThreshold(false);
            setIsTorn(false);
        }
    }, [stage, pullY]);

    // Auto-scroll the dialog to follow the visible print line. The receipt
    // keeps its full layout height while clip-path reveals it, so scroll by the
    // currently printed height instead of the container's full scrollHeight.
    useEffect(() => {
        if (stage !== "printing") return;
        const scrollEl = scrollRef.current;
        const paperEl = paperRef.current;
        const receiptEl = receiptRef.current;
        if (!scrollEl || !paperEl || !receiptEl) return;

        scrollEl.scrollTop = 0;
        const scrollRect = scrollEl.getBoundingClientRect();
        const paperRect = paperEl.getBoundingClientRect();
        const paperTop = paperRect.top - scrollRect.top;
        const receiptHeight = receiptEl.offsetHeight;
        const clientHeight = scrollEl.clientHeight;
        const controls = motionAnimate(0, 1, {
            duration: PRINT_DURATION,
            ease: "linear",
            onUpdate: (progress) => {
                const printedBottom = paperTop + receiptHeight * progress;
                scrollEl.scrollTop = Math.max(0, printedBottom - clientHeight);
            },
        });

        return () => controls.stop();
    }, [stage]);

    useEffect(() => {
        if (stage !== "printed") return;
        const scrollEl = scrollRef.current;
        if (!scrollEl) return;

        const start = scrollEl.scrollTop;
        const controls = motionAnimate(0, 1, {
            duration: 0.55,
            ease: "easeOut",
            onUpdate: (progress) => {
                const max = Math.max(
                    0,
                    scrollEl.scrollHeight - scrollEl.clientHeight,
                );
                scrollEl.scrollTop = start + (max - start) * progress;
            },
        });

        return () => controls.stop();
    }, [stage]);

    const resetTimerRef = useRef<number | null>(null);
    useEffect(
        () => () => {
            if (resetTimerRef.current !== null) {
                window.clearTimeout(resetTimerRef.current);
                resetTimerRef.current = null;
            }
        },
        [],
    );
    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (resetTimerRef.current !== null) {
            window.clearTimeout(resetTimerRef.current);
            resetTimerRef.current = null;
        }
        if (open) {
            setStage("printing");
        } else {
            resetTimerRef.current = window.setTimeout(() => {
                setStage("ready");
                resetTimerRef.current = null;
            }, 250);
        }
    };

    const downloadReceipt = async () => {
        if (downloadingRef.current || !receiptRef.current) return;
        setIsDownloading(true);
        // Lock the torn-off state so the zigzag stays visible through the
        // snap-back animation and the captured PNG always shows a torn edge.
        setIsTorn(true);
        try {
            // Settle the paper back at rest before snapping so the captured
            // PNG never carries the user's drag offset.
            await motionAnimate(pullY, 0, {
                duration: 0.2,
                ease: "easeOut",
            });

            const dataUrl = await toPng(receiptRef.current, {
                pixelRatio: 2,
            });
            const link = document.createElement("a");
            link.download = `subflow-receipt-${period}.png`;
            link.href = dataUrl;
            link.click();
        } catch {
            toast.error(t("receipt.downloadFailed"));
        } finally {
            setIsDownloading(false);
        }
    };

    // Drag-to-tear: once printing finishes, the user grabs the receipt and
    // pulls it upward — mouse-drag on desktop, swipe-up on touch — with
    // rubber-band resistance. Releasing past PULL_THRESHOLD downloads the PNG.
    // The scroll wheel is intentionally not bound: it scrolls the dialog
    // normally so the tear is always a deliberate gesture.
    useEffect(() => {
        if (stage !== "printed") return;
        const scrollEl = scrollRef.current;
        const paperEl = receiptRef.current;
        if (!scrollEl || !paperEl) return;

        const isAtBottom = () =>
            scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight <
            2;

        const release = () => {
            if (pullY.get() >= PULL_THRESHOLD) {
                void downloadReceipt();
            } else {
                void motionAnimate(pullY, 0, {
                    duration: 0.3,
                    ease: "easeOut",
                });
            }
        };

        // --- touch ---
        let touchStartY: number | null = null;
        let touchPulling = false;
        let rawTouchDelta = 0;

        const onTouchStart = (e: TouchEvent) => {
            if (stageRef.current !== "printed" || downloadingRef.current)
                return;
            touchStartY = e.touches[0]?.clientY ?? null;
            touchPulling = false;
            rawTouchDelta = 0;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (touchStartY === null) return;
            const y = e.touches[0]?.clientY ?? touchStartY;
            const delta = touchStartY - y; // positive when finger goes up
            if (delta <= 0) {
                if (touchPulling) {
                    pullY.set(0);
                    touchPulling = false;
                }
                touchStartY = y;
                rawTouchDelta = 0;
                return;
            }
            if (!isAtBottom() && !touchPulling) {
                // Still room to scroll — let the browser handle it.
                touchStartY = y;
                return;
            }
            touchPulling = true;
            rawTouchDelta = delta;
            pullY.set(rubberBand(rawTouchDelta));
            e.preventDefault();
        };

        const onTouchEnd = () => {
            if (touchPulling) release();
            touchStartY = null;
            touchPulling = false;
            rawTouchDelta = 0;
        };

        // --- mouse drag (desktop) ---
        let mouseStartY: number | null = null;
        let mouseDragging = false;

        const onMouseDown = (e: MouseEvent) => {
            if (stageRef.current !== "printed" || downloadingRef.current)
                return;
            if (e.button !== 0) return;
            mouseStartY = e.clientY;
            mouseDragging = true;
            // Prevent native text selection while dragging the paper.
            e.preventDefault();
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!mouseDragging || mouseStartY === null) return;
            const delta = mouseStartY - e.clientY; // positive when cursor up
            if (delta <= 0) {
                pullY.set(0);
                return;
            }
            pullY.set(rubberBand(delta));
        };

        const onMouseUp = () => {
            if (!mouseDragging) return;
            mouseDragging = false;
            mouseStartY = null;
            release();
        };

        scrollEl.addEventListener("touchstart", onTouchStart, {
            passive: true,
        });
        scrollEl.addEventListener("touchmove", onTouchMove, { passive: false });
        scrollEl.addEventListener("touchend", onTouchEnd);
        scrollEl.addEventListener("touchcancel", onTouchEnd);
        paperEl.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            scrollEl.removeEventListener("touchstart", onTouchStart);
            scrollEl.removeEventListener("touchmove", onTouchMove);
            scrollEl.removeEventListener("touchend", onTouchEnd);
            scrollEl.removeEventListener("touchcancel", onTouchEnd);
            paperEl.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger
                title={t("receipt.trigger")}
                className="focus-visible:ring-subflow-300/80 rounded-full focus-visible:ring-2 focus-visible:outline-none"
            >
                <ReceiptIcon className="text-subflow-50 size-6 cursor-pointer rounded-full sm:size-[34px]" />
            </DialogTrigger>
            <DialogContent
                showCloseButton={false}
                className="bg-subflow-100 text-subflow-900 flex max-h-[90vh] w-full max-w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-3xl border-none p-0 sm:max-w-md"
            >
                <DialogTitle className="sr-only">
                    {t("receipt.title")}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    {t("receipt.description")}
                </DialogDescription>

                <div
                    ref={scrollRef}
                    className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain p-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:p-6 [&::-webkit-scrollbar]:hidden"
                    style={{ touchAction: "pan-y" }}
                >
                    <div className="flex shrink-0 items-center justify-between px-1">
                        <span className="text-subflow-900 text-lg font-semibold tracking-wider">
                            {t("receipt.title")}
                        </span>
                        <div className="flex items-center gap-2">
                            {stage === "printed" ? (
                                <motion.button
                                    type="button"
                                    onClick={() => void downloadReceipt()}
                                    disabled={isDownloading}
                                    animate={{
                                        backgroundColor: pastThreshold
                                            ? RELEASE_GREEN
                                            : SUBFLOW_900,
                                    }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ duration: 0.15 }}
                                    className="focus-visible:ring-subflow-400 text-subflow-50 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-sm tracking-wider shadow-sm transition-shadow focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Download className="size-3.5" />
                                    {pastThreshold
                                        ? t("receipt.releaseToTear")
                                        : t("receipt.download")}
                                </motion.button>
                            ) : (
                                <span className="text-subflow-600 text-sm tracking-wider tabular-nums">
                                    {t("receipt.printing")}
                                    {items.length > 0 &&
                                        ` ${printedCount}/${items.length}`}
                                </span>
                            )}
                            <DialogClose
                                title={t("close")}
                                className="focus-visible:ring-subflow-400 bg-subflow-900 text-subflow-50 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-sm tracking-wider shadow-sm transition-shadow focus-visible:ring-2 focus-visible:outline-none"
                            >
                                <X className="size-3.5" />
                                {t("close")}
                            </DialogClose>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {stage !== "ready" && (
                            <motion.div
                                key="paper"
                                ref={paperRef}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15 },
                                }}
                                style={{ y: paperY }}
                                className="relative shrink-0"
                            >
                                <motion.div
                                    initial={{
                                        clipPath:
                                            "inset(0 0 100% 0 round 1rem)",
                                    }}
                                    animate={{
                                        clipPath: "inset(0 0 0% 0 round 1rem)",
                                    }}
                                    transition={{
                                        duration: PRINT_DURATION,
                                        ease: "linear",
                                    }}
                                    onAnimationComplete={() => {
                                        if (stage === "printing")
                                            setStage("printed");
                                    }}
                                >
                                    <div
                                        ref={receiptRef}
                                        className={`overflow-hidden rounded-2xl select-none ${
                                            stage === "printed" && !isTorn
                                                ? "cursor-grab active:cursor-grabbing"
                                                : ""
                                        }`}
                                    >
                                        <div
                                            aria-hidden
                                            className="h-3 w-full"
                                            style={{
                                                backgroundImage: ZIGZAG_TOP,
                                                backgroundRepeat: "repeat-x",
                                                backgroundSize: "16px 12px",
                                            }}
                                        />
                                        <div className="bg-white px-6 pt-6 pb-16 font-mono text-black">
                                            <div className="text-center">
                                                <div className="font-exile text-3xl leading-none tracking-[0.25em] text-black">
                                                    SUBFLOW
                                                </div>
                                                <div className="mt-3 text-sm tracking-wider text-neutral-700">
                                                    {t("receipt.header")}
                                                </div>
                                                <div className="mt-2 text-xs tracking-wider text-neutral-500 tabular-nums">
                                                    {dateLabel} · {timeLabel}
                                                </div>
                                                <div className="mt-1 text-xs tracking-wider text-neutral-500 tabular-nums">
                                                    #{period} · {currency}
                                                </div>
                                            </div>

                                            <div className="my-4 border-t border-dashed border-neutral-300" />

                                            {items.length === 0 ? (
                                                <div className="py-4 text-center text-xs tracking-wider text-neutral-500">
                                                    {t("receipt.empty")}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1.5">
                                                    {items.map((item, idx) => (
                                                        <div
                                                            key={`${item.name}-${idx}`}
                                                            className="flex items-baseline justify-between gap-3 text-xs tracking-wider tabular-nums"
                                                        >
                                                            <span className="min-w-0 truncate">
                                                                {item.name}
                                                                {item.cycle !==
                                                                    "monthly" && (
                                                                    <span className="ml-1.5 text-[10px] text-neutral-500">
                                                                        (
                                                                        {t(
                                                                            item.cycle,
                                                                        )}
                                                                        )
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="whitespace-nowrap">
                                                                {formatAmount(
                                                                    item.amount,
                                                                )}{" "}
                                                                {item.currency}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="my-4 border-t border-dashed border-neutral-300" />

                                            <div className="flex items-baseline justify-between text-xs tracking-wider tabular-nums">
                                                <span>
                                                    {t("receipt.items")}
                                                </span>
                                                <span>{items.length}</span>
                                            </div>
                                            <div className="mt-1 flex items-baseline justify-between text-xs tracking-wider tabular-nums">
                                                <span>
                                                    {t("receipt.subtotal")}
                                                </span>
                                                <span>
                                                    {formatAmount(total)}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-baseline justify-between text-sm font-bold tracking-wider tabular-nums">
                                                <span>
                                                    {t("receipt.total")}
                                                </span>
                                                <span>
                                                    {formatAmount(total)}{" "}
                                                    {currency}
                                                </span>
                                            </div>

                                            <div className="my-4 border-t border-dashed border-neutral-300" />

                                            {/* Barcode decoration */}
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div
                                                    aria-hidden
                                                    className="flex h-10 items-stretch justify-center gap-[1.5px]"
                                                >
                                                    {BARCODE_BARS.map(
                                                        (w, i) => (
                                                            <span
                                                                key={i}
                                                                className="block bg-black"
                                                                style={{
                                                                    width: `${w}px`,
                                                                }}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                                <div className="text-[10px] tracking-[0.4em] text-neutral-500 tabular-nums">
                                                    {period}
                                                </div>
                                            </div>

                                            <div className="my-4 border-t border-dashed border-neutral-300" />

                                            <div className="flex flex-col items-center gap-2 pt-1">
                                                <img
                                                    src="/subflow-light.svg"
                                                    alt="Subflow"
                                                    width={48}
                                                    height={48}
                                                    className="h-12 w-12"
                                                    crossOrigin="anonymous"
                                                />
                                                <div className="text-[12px] tracking-[0.28em] text-neutral-500">
                                                    subflow.ing
                                                </div>
                                            </div>
                                        </div>
                                        {/* Bottom tear edge. Starts at 0 height
                                        (flat receipt bottom) and grows the
                                        zigzag teeth downward as the user
                                        pulls. Locked to full height once torn
                                        so the captured PNG always shows the
                                        complete jagged edge. */}
                                        <motion.div
                                            aria-hidden
                                            className="h-3 w-full"
                                            style={{
                                                opacity: isTorn
                                                    ? 1
                                                    : tearOpacity,
                                                backgroundImage: ZIGZAG_BOTTOM,
                                                backgroundRepeat: "repeat-x",
                                                backgroundSize: "16px 12px",
                                                backgroundPosition:
                                                    "bottom center",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                                {/* Torn-off scrap that "stays behind" on the
                                    printer. Counter-translates the paper's
                                    upward lift so it appears stationary while
                                    the receipt rises, opening a perforation
                                    gap with mirrored zigzag teeth pointing up.
                                    Outside receiptRef so it never appears in
                                    the downloaded PNG. */}
                                {!isTorn && (
                                    <motion.div
                                        aria-hidden
                                        className="pointer-events-none absolute top-full right-0 left-0 flex flex-col"
                                        style={{
                                            y: scrapY,
                                            opacity: tearOpacity,
                                        }}
                                    >
                                        <div
                                            className="h-3 w-full"
                                            style={{
                                                backgroundImage: ZIGZAG_TOP,
                                                backgroundRepeat: "repeat-x",
                                                backgroundSize: "16px 12px",
                                                backgroundPosition:
                                                    "top center",
                                            }}
                                        />
                                        <div className="h-10 w-full bg-white" />
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {stage === "printed" && (
                        <motion.div
                            style={{ opacity: hintOpacity }}
                            className="text-subflow-600 flex h-10 shrink-0 flex-col items-center justify-end pb-4 text-center text-xs tracking-wider"
                        >
                            {t("receipt.dragToTearOff")}
                        </motion.div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
