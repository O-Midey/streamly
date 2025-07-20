"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps = {
  children: React.ReactNode[];
};

export default function Carousel({ children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: false,
    breakpoints: {
      "(min-width: 768px)": { loop: false }, // disable loop on desktop
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3 md:gap-4">
          {children.map((child, idx) => (
            <div
              key={idx}
              className="min-w-[160px] md:min-w-[240px] flex-shrink-0"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows on desktop only */}
      <div className="hidden md:flex absolute top-1/2 left-0 -translate-y-1/2 z-10">
        {canScrollPrev && (
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="bg-[#1f1d2b] text-white p-2 rounded-full shadow hover:bg-[#ff69b4af] transition-all duration-200"
          >
            <ChevronLeft size={30} />
          </button>
        )}
      </div>
      <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 z-10">
        {canScrollNext && (
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="bg-[#1f1d2b] text-white p-2 rounded-full shadow hover:bg-[#ff69b4af] transition-all duration-300"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>
    </div>
  );
}
