"use client";

import { useRef, useState } from "react";

const differenceSlides = [
  {
    title: "Beyond Nutrition Labels",
    tag: "Clarity",
    text: "PAUSTICA explains what sugar, salt, fat, additives, and processing levels actually mean before you decide what to eat.",
  },
  {
    title: "Personalized Health Goals",
    tag: "Personalized",
    text: "Choose goals like diabetes friendly, heart health, weight loss, muscle gain, or kids nutrition for smarter food insights.",
  },
  {
    title: "Ingredient Intelligence",
    tag: "AI Analysis",
    text: "Understand risky additives, ultra-processing signals, and ingredient quality in simple, friendly language.",
  },
  {
    title: "Smarter Alternatives",
    tag: "Better Choices",
    text: "When a product is not ideal, PAUSTICA helps suggest better options instead of only showing warnings.",
  },
  {
    title: "Food Confidence",
    tag: "Trust",
    text: "PAUSTICA turns complex nutrition data into clear scores, warnings, positives, and simple next steps.",
  },
];

export default function DifferenceCarousel() {
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scrollToSlide = (index: number) => {
    const slider = carouselRef.current;
    if (!slider) return;

    const slide = slider.children[index] as HTMLElement;
    if (!slide) return;

    slide.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });

    setActiveSlide(index);
  };

  return (
    <section className="mt-24 max-w-6xl mx-auto px-4 sm:px-6 text-left">
      <div className="p-0">
        <div className="max-w-3xl">
          <p className="text-sm font-black text-orange-400 uppercase tracking-wide mb-3">
            Why PAUSTICA is Different
          </p>

          <h2 className="heading-font text-3xl sm:text-5xl font-black text-gray tracking-tight mb-5">
            Food labels show data. PAUSTICA explains what it means.
          </h2>

          <p className="text-lg text-gray-500 leading-relaxed">
            Most people see calories, sugar, salt, additives, and ingredients — but
            still do not know whether a product is actually good for them.
            PAUSTICA turns confusing food labels into simple, personalized health
            intelligence.
          </p>
        </div>

        <div className="mt-10 relative">
          <div
            ref={carouselRef}
            onScroll={() => {
              const slider = carouselRef.current;
              if (!slider) return;

              const slideWidth = slider.scrollWidth / differenceSlides.length;
              const index = Math.round(slider.scrollLeft / slideWidth);
              setActiveSlide(Math.min(index, differenceSlides.length - 1));
            }}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-6">
              {differenceSlides.map((item, index) => (
                <div
                  key={item.title}
                  className="relative min-w-[86%] sm:min-w-[460px] snap-center overflow-hidden rounded-[36px] border border-orange-100 bg-white p-7 sm:p-9 shadow-2xl"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-100 blur-2xl" />

                  <div className="relative z-10">
                    <div className="mb-8 flex items-center justify-between">
                      <span className="rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-wide text-orange-600 border border-orange-100">
                        {item.tag}
                      </span>

                      <span className="text-5xl font-black text-orange-100">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-4">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex gap-2">
              {differenceSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    activeSlide === index
                      ? "w-8 bg-orange-500"
                      : "w-2.5 bg-orange-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}