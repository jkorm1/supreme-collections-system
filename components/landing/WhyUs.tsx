import { Barlow_Condensed } from "next/font/google";

/**
 * Nike-style "why us" band:
 * - full-bleed black section for contrast between the white sections around it
 * - giant uppercase condensed statement, left-aligned
 * - four plain text columns, each capped with a thin rule (no icons, no cards)
 * - one white pill CTA
 */

const headline = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

const REASONS = [
  {
    title: "Premium quality",
    desc: "Only the finest materials and craftsmanship.",
  },
  {
    title: "Affordable luxury",
    desc: "Premium products at reasonable prices.",
  },
  {
    title: "Fast delivery",
    desc: "Quick and reliable delivery to your location.",
  },
  {
    title: "Excellent support",
    desc: "24/7 customer service and lifetime support.",
  },
];

export function WhyUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="bg-black px-4 py-16 font-sans text-white sm:px-12 sm:py-24"
    >
      <h2
        id="why-us-heading"
        className={`${headline.className} max-w-5xl text-[clamp(3.5rem,11vw,9rem)] font-extrabold uppercase leading-[0.9] tracking-tight`}
      >
        Why choose
        <br />
        Supreme Collections
      </h2>

      <p className="mt-6 max-w-md text-base text-neutral-300">
        We&apos;re committed to delivering excellence in every part of what we
        do.
      </p>

      <a
        href="#"
        className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-6 text-base font-medium text-black transition-colors hover:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Shop now
      </a>

      <ul className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((r) => (
          <li key={r.title} className="border-t border-white/40 pt-4">
            <h3 className="text-base font-medium">{r.title}</h3>
            <p className="mt-1 max-w-xs text-base text-neutral-400">{r.desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
