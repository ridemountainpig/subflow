"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface RaycastSpotlightGalleryProps {
    images: {
        src: string;
        alt: string;
    }[];
}

export default function RaycastSpotlightGallery({
    images,
}: RaycastSpotlightGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const total = images.length;

    const showPrevious = () => {
        setActiveIndex((current) => (current - 1 + total) % total);
    };

    const showNext = () => {
        setActiveIndex((current) => (current + 1) % total);
    };

    return (
        <div className="flex-1">
            <div className="lg:hidden">
                <div className="overflow-hidden rounded-xl shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={images[activeIndex].src}
                        alt={images[activeIndex].alt}
                        className="h-auto w-full"
                    />
                </div>
                <div className="mt-3 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={showPrevious}
                        aria-label="Previous screenshot"
                        className="bg-subflow-900/60 border-subflow-700 text-subflow-50 hover:bg-subflow-900 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                        <ChevronLeft size={18} strokeWidth={2.8} />
                    </button>
                    <div className="flex items-center gap-2">
                        {images.map((image, index) => (
                            <button
                                key={image.src}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Show screenshot ${index + 1}`}
                                className={`h-2.5 rounded-full transition-all ${
                                    index === activeIndex
                                        ? "bg-subflow-50 w-6"
                                        : "bg-subflow-500/50 w-2.5"
                                }`}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={showNext}
                        aria-label="Next screenshot"
                        className="bg-subflow-900/60 border-subflow-700 text-subflow-50 hover:bg-subflow-900 inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                    >
                        <ChevronRight size={18} strokeWidth={2.8} />
                    </button>
                </div>
            </div>

            <div className="hidden grid-cols-2 gap-3 lg:grid">
                {images.map((image) => (
                    <div
                        key={image.src}
                        className="overflow-hidden rounded-xl shadow-xl"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="h-auto w-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
