/**
 * Nike-style gallery:
 * - left-aligned title row with a grey pill link
 * - edge-to-edge mosaic with tight 6px gutters and square corners
 * - mixed tile sizes (one large feature, one wide banner, small squares)
 * - captions sit on the photo, bottom-left, with a white pill button
 * - no scale-on-hover, no entrance animations
 */

type Tile = {
  id: string;
  title: string;
  caption?: string; // show copy + CTA on the tile when set
  cta?: string;
  href: string;
  src?: string; // image url
  alt?: string;
  className: string; // grid span for this tile
};

const TILES: Tile[] = [
  {
    id: "feature",
    title: "The Supreme Collection",
    caption: "Made for the moments worth dressing up for.",
    cta: "Shop",
    href: "#",
    src: "https://i.pinimg.com/1200x/63/cb/f5/63cbf55fe540febdfc4bdebdee7a2e3a.jpg",
    className: "col-span-2 row-span-1 lg:row-span-2",
  },
  {
    id: "detail",
    title: "Detail",
    href: "#",
    src: "https://i.pinimg.com/1200x/00/75/a4/0075a4c9b227570621d10566105e9e73.jpg",
    className: "col-span-1",
  },
  {
    id: "street",
    title: "Street",
    href: "#",
    src: "https://i.pinimg.com/1200x/88/03/dd/8803dd8f76ef6361f3a99365ec5d9ff8.jpg",
    className: "col-span-1",
  },
  {
    id: "studio",
    title: "Studio",
    href: "#",
    src: "https://i.pinimg.com/736x/d1/4f/f6/d14ff622ed2d9e5347995f49b66ccd70.jpg",
    className: "col-span-1",
  },
  {
    id: "celebrate",
    title: "Celebrate",
    href: "#",
    src: "https://i.pinimg.com/1200x/2f/6c/7a/2f6c7a711708f3bb1eb77b04d8ddf9d3.jpg",
    className: "col-span-1",
  },
  {
    id: "banner",
    title: "New arrivals",
    caption: "See what just landed.",
    cta: "Shop",
    href: "#",
    src: "https://i.pinimg.com/736x/c0/d4/1e/c0d41eff5df3c1b177c4b26b899807d2.jpg",
    className: "col-span-2",
  },
];

const pill =
  "inline-flex h-10 items-center rounded-full px-6 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

function GalleryTile({ tile }: { tile: Tile }) {
  return (
    <a
      href={tile.href}
      aria-label={tile.title}
      className={`group relative block overflow-hidden bg-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${tile.className}`}
    >
      {tile.src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tile.src}
          alt={tile.alt ?? tile.title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {tile.caption ? (
        <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
          <h3 className="text-base font-medium">{tile.title}</h3>
          <p className="mt-1 max-w-xs text-base">{tile.caption}</p>
          <span
            className={`${pill} mt-4 bg-white text-black group-hover:bg-neutral-300`}
          >
            {tile.cta}
          </span>
        </div>
      ) : (
        <span className="absolute bottom-4 left-4 text-base font-medium text-white">
          {tile.title}
        </span>
      )}
    </a>
  );
}

export function Gallery() {
  return (
    <section
      className="bg-white py-12 font-sans text-black"
      aria-labelledby="gallery-heading"
    >
      <div className="mb-4 flex items-center justify-between px-4 sm:px-12">
        <h2 id="gallery-heading" className="text-2xl font-medium">
          Our gallery
        </h2>
        <a
          href="#"
          className={`${pill} bg-neutral-100 text-black hover:bg-neutral-300 focus-visible:outline-black`}
        >
          View all
        </a>
      </div>

      <div className="grid auto-rows-[46vw] grid-cols-2 gap-1.5 px-4 sm:px-12 lg:auto-rows-[20vw] lg:grid-cols-4">
        {TILES.map((tile) => (
          <GalleryTile key={tile.id} tile={tile} />
        ))}
      </div>
    </section>
  );
}
