import { ArrowUpRight } from "lucide-react";
import { Barlow_Condensed } from "next/font/google";

/**
 * Nike-style contact / help page:
 * - giant uppercase condensed title on the left with two pill actions
 * - contact details as ruled rows (label left, value right), like Nike's help lists
 * - full-width map below, square corners
 */

const headline = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["800"],
  display: "swap",
});

type Row = { label: string; value: string; href?: string; external?: boolean };

const ROWS: Row[] = [
  { label: "Phone", value: "024 095 8968", href: "tel:0240958968" },
  {
    label: "WhatsApp",
    value: "Chat with us",
    href: "https://wa.me/233240958968",
    external: true,
  },
  {
    label: "Instagram",
    value: "@_supreme_collections",
    href: "https://instagram.com/_supreme_collections",
    external: true,
  },
  { label: "Location", value: "KNUST Campus" },
  { label: "Hours", value: "Monday to Sunday, 9AM to 8PM" },
];

const pill =
  "inline-flex h-10 items-center rounded-full px-6 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function ContactRow({ row }: { row: Row }) {
  const inner = (
    <>
      <span className="text-base text-neutral-500 sm:w-48">{row.label}</span>
      <span className="flex flex-1 items-center justify-between gap-4 text-xl font-medium">
        <span className="group-hover:underline">{row.value}</span>
        {row.external && (
          <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden />
        )}
      </span>
    </>
  );

  const base = "flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-0";

  return (
    <li>
      {row.href ? (
        <a
          href={row.href}
          target={row.external ? "_blank" : undefined}
          rel={row.external ? "noopener noreferrer" : undefined}
          className={`group ${base} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black`}
        >
          {inner}
        </a>
      ) : (
        <div className={base}>{inner}</div>
      )}
    </li>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-white px-4 py-12 font-sans text-black sm:px-12 sm:py-20"
    >
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h2
            id="contact-heading"
            className={`${headline.className} text-[clamp(3.5rem,10vw,8rem)] font-extrabold uppercase leading-[0.9] tracking-tight`}
          >
            Get in
            <br />
            touch
          </h2>
          <p className="mt-6 max-w-sm text-base text-neutral-600">
            Have questions about sizes, orders or delivery? We&apos;d love to
            hear from you.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href="https://wa.me/233240958968"
              target="_blank"
              rel="noopener noreferrer"
              className={`${pill} bg-black text-white hover:bg-neutral-700`}
            >
              Chat on WhatsApp
            </a>
            <a
              href="tel:0240958968"
              className={`${pill} bg-neutral-100 text-black hover:bg-neutral-300`}
            >
              Call us
            </a>
          </div>
        </div>

        <ul className="divide-y divide-neutral-300 border-y border-neutral-300 self-start">
          {ROWS.map((row) => (
            <ContactRow key={row.label} row={row} />
          ))}
        </ul>
      </div>

      <iframe
        title="Map showing KNUST Campus"
        src="https://www.google.com/maps?q=KNUST+Campus,+Kumasi&output=embed"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="mt-12 block h-[420px] w-full border-0 bg-neutral-200"
      />
    </section>
  );
}
