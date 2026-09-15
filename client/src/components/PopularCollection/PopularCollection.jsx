import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const fallbackCollections = [
  {
    sectionKey: "most-popular",
    title: "Most Popular Right Now",
    subtitle: "Our customers' favourite styles",
    buttonText: "Shop Popular",
    buttonLink: "/collection/most-popular",
    image: {
      url: "",
    },
  },
  {
    sectionKey: "best-sellers",
    title: "Best Sellers",
    subtitle: "Our most purchased footwear",
    buttonText: "Explore",
    buttonLink: "/collection/best-sellers",
    image: {
      url: "",
    },
  },
  {
    sectionKey: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Fresh styles just added",
    buttonText: "Explore",
    buttonLink: "/collection/new-arrivals",
    image: {
      url: "",
    },
  },
];

function PopularCollection() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH COLLECTIONS
  ========================================================= */

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/home-sections`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch home collections"
          );
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.sections)) {
          const activeSections = data.sections
            .filter((section) => section.isActive)
            .sort((a, b) => {
              const orderA = Number(a.order || 0);
              const orderB = Number(b.order || 0);

              return orderA - orderB;
            });

          setCollections(activeSections);
        } else {
          setCollections([]);
        }
      } catch (error) {
        console.error(
          "Error loading collections:",
          error
        );

        setCollections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="bg-[#f8f7f4] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-4 md:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[300px] animate-pulse rounded-[18px] bg-zinc-200"
            />
          ))}
        </div>
      </section>
    );
  }

  /* =========================================================
     USE FALLBACK ONLY IF API HAS NO SECTIONS
  ========================================================= */

  const displayCollections =
    collections.length > 0
      ? collections.slice(0, 3)
      : fallbackCollections;

  return (
    <section className="bg-[#f8f7f4] px-4 pb-14 pt-2 sm:px-6 sm:pb-16 lg:px-8">

      <div className="mx-auto max-w-[1480px]">

        {/* =====================================================
            COLLECTION GRID
        ===================================================== */}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {displayCollections.map(
            (collection, index) => {
              const imageUrl =
                collection.image?.url || "";

              const collectionNumber =
                String(index + 1).padStart(2, "0");

              const buttonLink =
                collection.buttonLink ||
                "/collection/most-popular";

              return (
                <article
                  key={
                    collection._id ||
                    collection.sectionKey ||
                    index
                  }
                  className="group relative min-h-[330px] overflow-hidden rounded-[18px] bg-zinc-900 shadow-[0_12px_35px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(0,0,0,0.16)] sm:min-h-[350px]"
                >

                  {/* =================================================
                      BACKGROUND IMAGE
                  ================================================= */}

                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={collection.title || "Collection"}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 ${
                        index === 0
                          ? "bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-950"
                          : index === 1
                          ? "bg-gradient-to-br from-[#351416] via-[#641d21] to-zinc-950"
                          : "bg-gradient-to-br from-[#39352f] via-[#696052] to-zinc-950"
                      }`}
                    />
                  )}

                  {/* =================================================
                      IMAGE OVERLAY
                  ================================================= */}

                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />

                  {/* =================================================
                      SUBTLE HOVER GLOW
                  ================================================= */}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-red-500/[0.08] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* =================================================
                      CARD CONTENT
                  ================================================= */}

                  <div className="relative z-10 flex min-h-[330px] flex-col p-5 sm:min-h-[350px] sm:p-6">

                    {/* =================================================
                        COLLECTION NUMBER
                    ================================================= */}

                    <div className="flex items-center gap-3">

                      <span className="text-[9px] font-bold tracking-[0.18em] text-white">
                        {collectionNumber}
                      </span>

                      <span className="h-[1px] w-8 bg-red-500" />

                      <span className="text-[8px] font-bold tracking-[0.24em] text-white/75">
                        COLLECTION
                      </span>

                    </div>

                    {/* =================================================
                        BOTTOM CONTENT
                    ================================================= */}

                    <div className="mt-auto max-w-[310px]">

                      {/* LABEL */}

                      <p className="mb-2 text-[8px] font-bold uppercase tracking-[0.22em] text-red-400">
                        Discover the Collection
                      </p>

                      {/* TITLE */}

                      <h2 className="font-['Outfit'] text-[25px] font-extrabold leading-[0.98] tracking-[-0.045em] text-white sm:text-[28px] lg:text-[30px]">
                        {collection.title}
                      </h2>

                      {/* SUBTITLE */}

                      {collection.subtitle && (
                        <p className="mt-3 text-[11px] leading-5 text-white/75 sm:text-xs">
                          {collection.subtitle}
                        </p>
                      )}

                      {/* =================================================
                          BUTTON
                      ================================================= */}

                      {collection.buttonText && (
                        <Link
                          to={buttonLink}
                          className="group/button mt-5 inline-flex min-h-[39px] items-center gap-3 rounded-full bg-white px-4 pl-4 text-[10px] font-bold text-zinc-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-600 hover:text-white sm:min-h-[42px] sm:pl-5 sm:text-[11px]"
                        >

                          <span>
                            {collection.buttonText}
                          </span>

                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950 text-[11px] text-white transition-all duration-300 group-hover/button:translate-x-1 group-hover/button:bg-white group-hover/button:text-zinc-950">
                            →
                          </span>

                        </Link>
                      )}

                    </div>

                  </div>

                  {/* =================================================
                      BOTTOM RED ACCENT
                  ================================================= */}

                  <div className="absolute bottom-0 left-0 h-[3px] w-full bg-red-600 opacity-80 transition-all duration-500 group-hover:h-[5px]" />

                </article>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}

export default PopularCollection;