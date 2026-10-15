import { Star } from "lucide-react";

/**
 * Nike-style reviews:
 * - plain title row with the average rating on the right
 * - three columns, each capped with a black rule; no cards, shadows or italics
 * - solid black stars, review text in regular weight, name in medium
 */

type Review = { name: string; rating: number; text: string };

const REVIEWS: Review[] = [
  {
    name: "Taufiq Yussif",
    rating: 5,
    text: "Best shoes I've ever owned. Extremely comfortable and stylish!",
  },
  {
    name: "Christian Frimpong",
    rating: 5,
    text: "Fast delivery and excellent customer service. Highly recommended!",
  },
  {
    name: "Joseph Korm",
    rating: 5,
    text: "Premium quality at affordable prices. Will definitely buy again.",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="sr-only">{rating} out of 5 stars</span>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={`h-4 w-4 ${
            i < rating ? "fill-black text-black" : "text-neutral-300"
          }`}
        />
      ))}
    </div>
  );
}

export function Reviews() {
  const average =
    REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="bg-white px-4 py-12 font-sans text-black sm:px-12"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 id="reviews-heading" className="text-2xl font-medium">
          What customers say
        </h2>
        <div className="flex items-center gap-3">
          <Stars rating={Math.round(average)} />
          <p className="text-base">
            {average.toFixed(1)} from {REVIEWS.length} reviews
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <li key={r.name} className="flex flex-col border-t border-black pt-4">
            <Stars rating={r.rating} />
            <p className="mt-4 text-base">{r.text}</p>
            <p className="mt-6 text-base font-medium">{r.name}</p>
            <p className="text-base text-neutral-500">Verified customer</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
