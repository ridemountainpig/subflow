"use client";

import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    ReactElement,
    ReactNode,
    RefObject,
    useEffect,
    useMemo,
    useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
    width?: number | string;
    height?: number | string;
    cardDistance?: number;
    verticalDistance?: number;
    delay?: number;
    pauseOnHover?: boolean;
    onCardClick?: (idx: number) => void;
    skewAmount?: number;
    easing?: "linear" | "elastic";
    children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ customClass, ...rest }, ref) => (
        <div
            ref={ref}
            {...rest}
            className={`text-subflow-50 border-subflow-50 bg-subflow-900 absolute top-1/3 left-1/2 overflow-hidden rounded-xl border-4 [will-change:transform] [backface-visibility:hidden] [transform-style:preserve-3d] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
        />
    ),
);
Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
    x: number;
    y: number;
    z: number;
    zIndex: number;
}

const makeSlot = (
    i: number,
    distX: number,
    distY: number,
    total: number,
): Slot => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: "center center",
        zIndex: slot.zIndex,
        force3D: true,
    });

const CardSwap: React.FC<CardSwapProps> = ({
    width = 500,
    height = 400,
    cardDistance = 60,
    verticalDistance = 70,
    delay = 5000,
    pauseOnHover = false,
    onCardClick,
    skewAmount = 6,
    easing = "elastic",
    children,
}) => {
    const config =
        easing === "elastic"
            ? {
                  ease: "elastic.out(0.6,0.9)",
                  durDrop: 2,
                  durMove: 2,
                  durReturn: 2,
                  promoteOverlap: 0.9,
                  returnDelay: 0.05,
              }
            : {
                  ease: "power1.inOut",
                  durDrop: 0.8,
                  durMove: 0.8,
                  durReturn: 0.8,
                  promoteOverlap: 0.45,
                  returnDelay: 0.2,
              };

    const childArr = useMemo(
        () => Children.toArray(children) as ReactElement<CardProps>[],
        [children],
    );
    const refs = useMemo<CardRef[]>(
        () => childArr.map(() => React.createRef<HTMLDivElement>()),
        [childArr],
    );

    const order = useRef<number[]>(
        Array.from({ length: childArr.length }, (_, i) => i),
    );

    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number | undefined>(undefined);
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) =>
            placeNow(
                r.current!,
                makeSlot(i, cardDistance, verticalDistance, total),
                skewAmount,
            ),
        );

        const swap = () => {
            if (order.current.length < 2) return;

            const [front, ...rest] = order.current;
            const elFront = refs[front].current!;
            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, {
                y: "+=500",
                duration: config.durDrop,
                ease: config.ease,
            });

            tl.addLabel(
                "promote",
                `-=${config.durDrop * config.promoteOverlap}`,
            );
            rest.forEach((idx, i) => {
                const el = refs[idx].current!;
                const slot = makeSlot(
                    i,
                    cardDistance,
                    verticalDistance,
                    refs.length,
                );
                tl.set(el, { zIndex: slot.zIndex }, "promote");
                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease,
                    },
                    `promote+=${i * 0.15}`,
                );
            });

            const backSlot = makeSlot(
                refs.length - 1,
                cardDistance,
                verticalDistance,
                refs.length,
            );
            tl.addLabel(
                "return",
                `promote+=${config.durMove * config.returnDelay}`,
            );
            tl.call(
                () => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                "return",
            );
            tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return");
            tl.to(
                elFront,
                {
                    y: backSlot.y,
                    duration: config.durReturn,
                    ease: config.ease,
                },
                "return",
            );

            tl.call(() => {
                order.current = [...rest, front];
            });
        };

        swap();
        intervalRef.current = window.setInterval(swap, delay);

        if (pauseOnHover) {
            const node = container.current!;
            const pause = () => {
                tlRef.current?.pause();
                clearInterval(intervalRef.current);
            };
            const resume = () => {
                tlRef.current?.play();
                intervalRef.current = window.setInterval(swap, delay);
            };
            node.addEventListener("mouseenter", pause);
            node.addEventListener("mouseleave", resume);
            return () => {
                node.removeEventListener("mouseenter", pause);
                node.removeEventListener("mouseleave", resume);
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
    }, [
        cardDistance,
        verticalDistance,
        delay,
        pauseOnHover,
        skewAmount,
        easing,
        config.durDrop,
        config.durMove,
        config.durReturn,
        config.ease,
        config.promoteOverlap,
        config.returnDelay,
        refs,
    ]);

    const rendered = childArr.map((child, i) =>
        isValidElement<CardProps>(child)
            ? cloneElement(child, {
                  key: i,
                  ref: refs[i],
                  style: { width, height, ...(child.props.style ?? {}) },
                  onClick: (e) => {
                      child.props.onClick?.(
                          e as React.MouseEvent<HTMLDivElement>,
                      );
                      onCardClick?.(i);
                  },
              } as CardProps & React.RefAttributes<HTMLDivElement>)
            : child,
    );

    return (
        <div
            ref={container}
            className="absolute right-0 bottom-0 origin-bottom-right translate-x-[5%] translate-y-[20%] transform overflow-visible perspective-[900px] max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
            style={{ width, height }}
        >
            {rendered}
        </div>
    );
};

export default CardSwap;
