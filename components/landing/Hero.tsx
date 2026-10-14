"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MouseEvent } from "react";

interface HeroProps {
  onOrderClick: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Colour of the section that comes AFTER the hero.
 * Change this to match its background so the curve blends perfectly.
 */
const NEXT_SECTION_COLOR = "#faf6f0";

/** One soft, flowing S-curve. Edit the numbers to adjust the sweep. */
const EDGE_PATH = "M0,96 C480,350 960,-180 1440,170";

export function Hero({ onOrderClick }: HeroProps) {
  const reduce = useReducedMotion();

  // Mouse parallax (the shoe leans toward the cursor)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  const shoeX = useTransform(sx, [-0.5, 0.5], [-28, 28]);
  const shoeY = useTransform(sy, [-0.5, 0.5], [-18, 18]);
  const shoeRotate = useTransform(sx, [-0.5, 0.5], [-4, 4]);
  const glowX = useTransform(sx, [-0.5, 0.5], [40, -40]);
  const glowY = useTransform(sy, [-0.5, 0.5], [30, -30]);
  const wordX = useTransform(sx, [-0.5, 0.5], [-18, 18]);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  const scrollToShowcase = () =>
    document.getElementById("showcase")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      onMouseMove={handleMove}
      className="relative isolate min-h-screen overflow-hidden bg-primary"
    >
      {/* ---------- Atmosphere ---------- */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 70% 45%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(ellipse 120% 90% at 50% 120%, rgba(0,0,0,0.65), transparent 60%), radial-gradient(ellipse 100% 80% at 0% 0%, rgba(0,0,0,0.45), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Oversized monogram watermark */}
      <motion.span
        aria-hidden
        style={{ x: reduce ? 0 : wordX }}
        className="pointer-events-none absolute -bottom-10 left-1/2 -z-10 -translate-x-1/2 select-none whitespace-nowrap font-serif text-[34vw] font-bold leading-none text-transparent lg:-bottom-24 lg:text-[26vw]"
      >
        <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.10)" }}>
          SC
        </span>
      </motion.span>

      {/* ---------- Content ---------- */}
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-5 pb-28 pt-28 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:px-10 lg:pb-32 lg:pt-24">
        {/* Left: words */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-6 flex items-center justify-center gap-4 font-serif text-lg italic text-accent lg:justify-start"
          >
            <span className="h-px w-12 bg-accent/70" />
            Supreme Collections
          </motion.p>

          <h1 className="font-serif font-bold leading-[0.95] text-white">
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.2 }}
                className="block text-6xl sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              >
                Step In
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-3">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.35 }}
                className="block bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-6xl italic text-transparent sm:text-7xl lg:text-[5.5rem] xl:text-[6.5rem]"
              >
                Excellence
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
            className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-white/80 lg:mx-0"
          >
            Premium men&apos;s classic shoes and authentic Ghana-made slippers,
            where luxury craftsmanship meets comfort.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <button
              onClick={scrollToShowcase}
              className="group relative w-full overflow-hidden rounded-full bg-accent px-9 py-4 text-lg font-semibold text-primary shadow-[0_10px_40px_-10px] shadow-accent/60 transition-transform duration-300 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto"
            >
              <span className="relative z-10">Order now</span>
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-white/50 opacity-0 transition-all duration-700 group-hover:left-[130%] group-hover:opacity-100"
              />
            </button>

            <button
              onClick={scrollToShowcase}
              className="w-full rounded-full border border-accent/60 px-9 py-4 text-lg font-semibold text-accent backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:w-auto"
            >
              Explore the collection
            </button>
          </motion.div>
        </div>

        {/* Right: the hero object */}
        <div className="relative order-1 mx-auto flex w-full max-w-[34rem] items-center justify-center lg:order-2">
          {/* Spotlight */}
          <motion.div
            aria-hidden
            style={{ x: reduce ? 0 : glowX, y: reduce ? 0 : glowY }}
            className="absolute h-[85%] w-[85%] rounded-full bg-accent/25 blur-[90px]"
          />

          {/* Arch window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.15 }}
            className="relative aspect-[4/5] w-[78%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] border border-accent/40"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 45%, rgba(0,0,0,0.35) 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.25), 0 40px 80px -30px rgba(0,0,0,0.7)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
              }}
            />
          </motion.div>

          {/* Rotating logo (public/logo.png) */}
          <motion.div
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            className="absolute -right-2 top-2 z-20 h-10 w-10 sm:-right-4 sm:h-36 sm:w-36"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logoo.png"
              alt="Supreme Collections logo"
              className="h-full w-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            />
          </motion.div>

          {/* The shoe (public/shoe.png) */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: -8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.5 }}
            className="absolute inset-x-[-6%] top-1/2 -translate-y-1/2"
          >
            <motion.div
              style={{
                x: reduce ? 0 : shoeX,
                y: reduce ? 0 : shoeY,
                rotate: reduce ? 0 : shoeRotate,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/shoe.png"
                alt="Supreme Collections signature shoe"
                className="w-full drop-shadow-[0_35px_35px_rgba(0,0,0,0.55)]"
              />
            </motion.div>

            <div
              aria-hidden
              className="mx-auto -mt-4 h-5 w-[70%] rounded-[100%] bg-black/60 blur-xl"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        onClick={scrollToShowcase}
        aria-label="Scroll to collection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-20 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent md:flex"
      >
        <span className="relative h-10 w-px overflow-hidden bg-white/20">
          <motion.span
            animate={reduce ? undefined : { y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-accent"
          />
        </span>
      </motion.button>

      {/* ---------- Curved edge ---------- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 leading-[0]"
      >
        <svg
          viewBox="0 0 1440 170"
          preserveAspectRatio="none"
          className="block h-[80px] w-full sm:h-[100px] lg:h-[120px]"
        >
          <path
            d={`${EDGE_PATH} L1440,170 L0,170 Z`}
            fill={NEXT_SECTION_COLOR}
          />
          <path
            d={EDGE_PATH}
            fill="none"
            stroke="#d9b97a"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </section>
  );
}
