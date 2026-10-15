"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Barlow_Condensed } from "next/font/google";

// Closest open match to Nike's Futura Condensed Extra Bold headline
const headline = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

// Swap for your own full-bleed photo (landscape works best)
const HERO_IMAGE =
  "https://i.pinimg.com/1200x/63/cb/f5/63cbf55fe540febdfc4bdebdee7a2e3a.jpg";

/**
 * Nike-style layout:
 * - full-bleed hero with a giant uppercase condensed headline, pill CTAs
 * - a left-aligned title row with round prev/next arrows
 * - a snap-scrolling rail of Pinterest video embeds, copy beneath
 *
 * Fonts: headline uses Barlow Condensed (loaded via next/font); body inherits
 * your site's sans font.
 */

type Video = {
  id: string;
  pinId: string; // Pinterest pin id used in the embed url
  title: string;
  description: string;
};

const VIDEOS: Video[] = [
  {
    id: "showcase",
    pinId: "497366352615619202",
    title: "Product Showcase",
    description: "Discover the artistry behind each product.",
  },
  {
    id: "stories",
    pinId: "1008876754057951339",
    title: "Customer Stories",
    description: "Real customers sharing their experiences.",
  },
  {
    id: "bts",
    pinId: "1106970783402703011",
    title: "Behind the Scenes",
    description: "See how we craft excellence.",
  },
  {
    id: "all-types",
    pinId: "940056122243396305",
    title: "All Types",
    description: "See excellence in diverse manners.",
  },
  {
    id: "softlaunch",
    pinId: "1008876754054297461",
    title: "Soft Launch",
    description: "Be the first to experience the new collection.",
  },
  {
    id: "calm",
    pinId: "1008876754059106078",
    title: "Calm",
    description: "Find your center.",
  },
];

const pill =
  "inline-flex h-10 items-center rounded-full px-6 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function VideoCard({ video }: { video: Video }) {
  return (
    <article className="w-[345px] shrink-0 snap-start">
      {/* Pinterest's embed has a fixed 345x714 layout and its own play controls */}
      <iframe
        src={`https://assets.pinterest.com/ext/embed.html?id=${video.pinId}`}
        title={video.title}
        width={345}
        height={714}
        loading="lazy"
        scrolling="no"
        className="block border-0 bg-neutral-200"
      />
      <h3 className="mt-4 text-base font-medium text-black">{video.title}</h3>
      <p className="mt-1 text-base text-neutral-500">{video.description}</p>
    </article>
  );
}

export function VideoShowcase() {
  const rail = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) =>
    rail.current?.scrollBy({
      left: dir * rail.current.clientWidth * 0.8,
      behavior: "smooth",
    });

  return (
    <section
      className="bg-white font-sans text-black"
      aria-labelledby="vs-heading"
    >
      {/* Hero */}
      <div className="relative flex min-h-[90vh] items-end overflow-hidden bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_IMAGE}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* keeps the white headline legible on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 w-full px-4 pb-12 text-white sm:px-12">
          <h2
            id="vs-heading"
            className={`${headline.className} text-[clamp(4rem,15vw,13rem)] font-extrabold uppercase leading-[0.85] tracking-tight`}
          >
            Experience
            <br />
            Supreme
            <br />
            Collections
          </h2>
          <p className="mt-6 max-w-md text-base">
            Watch how our products change the way people walk, celebrate and
            express themselves.
          </p>
          <div className="mt-6 flex gap-2">
            <a
              href="#videos"
              className={`${pill} bg-white text-black hover:bg-neutral-300 focus-visible:outline-white`}
            >
              Watch now
            </a>
            <a
              href="#"
              className={`${pill} bg-black text-white hover:bg-neutral-700 focus-visible:outline-white`}
            >
              Shop
            </a>
          </div>
        </div>
      </div>

      {/* Rail */}
      <div id="videos" className="py-12">
        <div className="mb-4 flex items-center justify-between px-4 sm:px-12">
          <h3 className="text-2xl font-medium">Watch and shop</h3>
          {/* Arrows show on all sizes: swiping on an iframe scrolls the embed, not the rail */}
          <div className="flex gap-2">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scrollBy(dir)}
                aria-label={dir === -1 ? "Previous videos" : "Next videos"}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {dir === -1 ? (
                  <ChevronLeft className="h-6 w-6" />
                ) : (
                  <ChevronRight className="h-6 w-6" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={rail}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] motion-reduce:scroll-auto sm:px-12 [&::-webkit-scrollbar]:hidden"
        >
          {VIDEOS.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
