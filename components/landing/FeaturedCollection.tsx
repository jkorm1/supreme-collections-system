"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface Slide {
  image: string; // image URL or a file in /public
  label: string;
  title: string;
  cta: string;
}

const IMG = [
  "https://i.pinimg.com/736x/11/5e/75/115e758ea526495491ada49e7019f1ed.jpg",
  "https://i.pinimg.com/736x/5d/e3/d1/5de3d15782d1af16466df756ba996f9a.jpg",
  "https://i.pinimg.com/1200x/65/bf/5f/65bf5f7c2f8ea98f3151cafd727bf68f.jpg",
  "https://i.pinimg.com/1200x/db/3a/41/db3a411cc7f85c6da8510f0406d51e38.jpg",
  "https://i.pinimg.com/1200x/d1/7b/33/d17b33b860e4af2c3ce308ffe6bd5db8.jpg",
  "https://i.pinimg.com/1200x/b4/02/34/b40234cd350b7febac9e2c0d5239965a.jpg",
];

/** Left side rotates through the first three, right side through the last three. */
const LEFT_SLIDES: Slide[] = [
  {
    image: IMG[0],
    label: "Supreme Collections",
    title: "Step In Excellence",
    cta: "Shop the collection",
  },
  {
    image: IMG[1],
    label: "Men's Collection",
    title: "Worn With Confidence",
    cta: "Shop the collection",
  },
  {
    image: IMG[2],
    label: "New In",
    title: "Timeless Craft",
    cta: "Shop the collection",
  },
];

const RIGHT_SLIDES: Slide[] = [
  {
    image: IMG[3],
    label: "Made in Ghana",
    title: "Comfort Meets Style",
    cta: "Shop the collection",
  },
  {
    image: IMG[4],
    label: "Supreme Collections",
    title: "Made To Be Worn",
    cta: "Shop the collection",
  },
  {
    image: IMG[5],
    label: "New In",
    title: "Everyday Luxury",
    cta: "Shop the collection",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

const scrollToShowcase = () =>
  document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });

function Panel({ slides, interval }: { slides: Slide[]; interval: number }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  // Auto-change. Hovering does NOT pause it, so both sides always keep moving.
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      interval,
    );
    return () => clearTimeout(t);
  }, [interval, slides.length, index]);

  // Preload the next image so the crossfade never waits on the network
  useEffect(() => {
    if (slides.length < 2) return;
    const img = new Image();
    img.referrerPolicy = "no-referrer";
    img.src = slides[(index + 1) % slides.length].image;
  }, [index, slides]);

  const slide = slides[index];

  return (
    <div
      className="group relative h-[75vh] min-h-[460px] overflow-hidden bg-neutral-900 md:h-[92vh]"
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Images: crossfade, slow zoom, extra zoom on hover */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.image}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: hovered && !reduce ? 1.06 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="absolute inset-0 bg-gradient-to-br from-primary/60 to-neutral-950"
        >
          {!failed[slide.image] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={slide.image}
              alt={slide.title}
              referrerPolicy="no-referrer"
              onError={() => setFailed((f) => ({ ...f, [slide.image]: true }))}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Legibility gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
      />

      {/* Text + CTA */}
      <div className="absolute inset-x-0 bottom-0 p-6 pb-14 sm:p-10 sm:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className="mb-2 text-sm font-medium text-white/80">
              {slide.label}
            </p>
            <h3 className="max-w-md font-sans text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {slide.title}
            </h3>
            <button
              onClick={scrollToShowcase}
              className="mt-6 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition-colors duration-300 hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {slide.cta}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress lines (click to jump) */}
      {slides.length > 1 && (
        <div className="absolute inset-x-6 bottom-6 flex gap-2 sm:inset-x-10">
          {slides.map((s, i) => (
            <button
              key={s.image}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === index}
              className="group/bar flex-1 py-2"
            >
              <span className="relative block h-[3px] overflow-hidden bg-white/30">
                <span
                  className={`absolute inset-y-0 left-0 bg-white transition-all duration-500 ${
                    i === index ? "w-full" : "w-0"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function FeaturedCollection() {
  return (
    <section aria-labelledby="featured-heading" className="bg-black">
      <h2 id="featured-heading" className="sr-only">
        Featured Collection
      </h2>

      {/* Two halves, no gap */}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        <Panel slides={LEFT_SLIDES} interval={5000} />
        {/* different interval so the two sides change at different moments */}
        <Panel slides={RIGHT_SLIDES} interval={5800} />
      </div>
    </section>
  );
}
