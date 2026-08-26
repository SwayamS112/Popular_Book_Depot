import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PopularCollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeSections = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/home-sections"
        );

        const data = await response.json();

        if (data.success) {
          setCollections(data.sections || []);
        }
      } catch (error) {
        console.error("Error fetching home sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeSections();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#f7f6f2] px-6 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />

            <p className="mt-5 text-xs font-bold tracking-[0.2em] text-zinc-500">
              LOADING COLLECTIONS
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f7f6f2] px-6 py-20 lg:px-8 lg:py-28">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-[-140px] top-[15%] h-[420px] w-[420px] rounded-full border border-red-600/[0.08]" />

      <div className="pointer-events-none absolute right-[-180px] top-20 h-[500px] w-[500px] rounded-full bg-red-600/[0.025] blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="grid gap-8 border-b border-zinc-200 pb-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-red-600" />

              <p className="text-xs font-bold tracking-[0.25em] text-red-600">
                OUR TOP COLLECTIONS
              </p>
            </div>

            <h2 className="mt-5 font-['Outfit'] text-4xl font-extrabold leading-[0.95] tracking-[-0.05em] text-zinc-950 sm:text-5xl lg:text-6xl">
              Made for Every
              <span className="block text-red-600">Step You Take.</span>
            </h2>
          </div>

          <div className="lg:pb-1">
            <p className="max-w-md text-sm leading-7 text-zinc-500 sm:text-base">
              Explore footwear chosen for comfort, everyday movement and
              standout style. Find the pair that fits your journey.
            </p>
          </div>
        </div>

        {/* Collections */}
        {collections.length > 0 ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            {/* FEATURED LARGE CARD */}
            {collections[0] && (
              <CollectionCard
                collection={collections[0]}
                index={0}
                navigate={navigate}
                featured
              />
            )}

            {/* RIGHT CARDS */}
            <div className="grid gap-5">
              {collections.slice(1, 3).map((collection, index) => (
                <CollectionCard
                  key={collection._id}
                  collection={collection}
                  index={index + 1}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <p className="font-['Outfit'] text-2xl font-bold text-zinc-900">
              New collections are coming soon.
            </p>

            <p className="mt-3 text-sm text-zinc-500">
              Check back soon to explore our latest footwear styles.
            </p>
          </div>
        )}

        {/* Bottom trust line */}
        <div className="mt-12 flex flex-col gap-5 border-t border-zinc-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow-lg shadow-red-600/20">
              50+
            </div>

            <div>
              <p className="text-sm font-bold text-zinc-950">
                Generations of trusted service
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Quality footwear and customer trust for over 50 years.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            New styles arriving regularly
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COLLECTION CARD
========================================================= */

function CollectionCard({
  collection,
  index,
  navigate,
  featured = false,
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] bg-zinc-900 ${
        featured
          ? "min-h-[560px] lg:min-h-[620px]"
          : "min-h-[280px] sm:min-h-[300px]"
      }`}
    >
      {/* Image */}
      <img
        src={collection.image?.url}
        alt={collection.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 ${
          featured
            ? "bg-gradient-to-t from-black via-black/45 to-black/5"
            : "bg-gradient-to-r from-black/85 via-black/35 to-transparent"
        }`}
      />

      {/* Decorative top number */}
      <div className="absolute left-7 top-7 flex items-center gap-3">
        <span className="font-['Outfit'] text-xs font-bold tracking-[0.2em] text-white/60">
          0{index + 1}
        </span>

        <span className="h-px w-9 bg-red-500" />

        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
          Collection
        </span>
      </div>

      {/* Content */}
      <div
        className={`absolute z-10 ${
          featured
            ? "bottom-0 left-0 right-0 p-7 sm:p-10"
            : "inset-y-0 left-0 flex max-w-[70%] flex-col justify-end p-7 sm:p-8"
        }`}
      >
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-red-400">
          Discover the collection
        </p>

        <h3
          className={`font-['Outfit'] font-extrabold leading-tight tracking-[-0.04em] text-white ${
            featured
              ? "text-4xl sm:text-5xl"
              : "text-2xl sm:text-3xl"
          }`}
        >
          {collection.title}
        </h3>

        <p
          className={`mt-3 leading-6 text-white/70 ${
            featured
              ? "max-w-lg text-sm sm:text-base"
              : "text-sm"
          }`}
        >
          {collection.subtitle ||
            "Discover footwear designed for comfort, confidence and every journey."}
        </p>

        <button
          onClick={() => navigate(collection.buttonLink)}
          className="mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:text-white hover:shadow-red-600/30"
        >
          {collection.buttonText || "Explore Collection"}

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-sm text-white transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      {/* Bottom red progress line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-red-600 transition-all duration-700 group-hover:w-full" />
    </article>
  );
}

export default PopularCollection;