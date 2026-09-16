import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const defaultMoments = [
  {
    key: "college",
    title: "College",
    subtitle: "Stay Stylish",
    link: "/products/men?subcategory=sneakers",
    fallback:
      "linear-gradient(160deg, #9b795e 0%, #d2b293 48%, #6f5441 100%)",
  },
  {
    key: "work",
    title: "Work",
    subtitle: "Look Professional",
    link: "/products/men?subcategory=formal-shoes",
    fallback:
      "linear-gradient(160deg, #181818 0%, #464646 50%, #101010 100%)",
  },
  {
    key: "travel",
    title: "Travel",
    subtitle: "Go Further",
    link: "/products/men?subcategory=sports-shoes",
    fallback:
      "linear-gradient(160deg, #647b63 0%, #a6b49b 48%, #3e4b40 100%)",
  },
  {
    key: "play",
    title: "Play",
    subtitle: "Keep Moving",
    link: "/products/men?subcategory=sports-shoes",
    fallback:
      "linear-gradient(160deg, #9c795b 0%, #d2ad85 48%, #66503d 100%)",
  },
];

function EveryMoment() {
  const [moments, setMoments] = useState(defaultMoments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEveryMoment = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/home-sections`);

        if (!response.ok) {
          throw new Error("Unable to load Every Moment section.");
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.sections)) {
          return;
        }

        const section = data.sections.find(
          (item) => item.sectionKey === "every-moment"
        );

        /*
          If the admin section has not been created yet,
          keep the original fallback cards.
        */
        if (!section) {
          return;
        }

        const adminItems = Array.isArray(section.items)
          ? section.items
              .filter((item) => item?.isActive !== false)
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          : [];

        /*
          Match Admin CMS items with the four default cards.

          This means even if an item is missing from the database,
          the card can still fall back to its default content.
        */
        const updatedMoments = defaultMoments
          .map((defaultMoment) => {
            const adminItem = adminItems.find(
              (item) => item.key === defaultMoment.key
            );

            if (!adminItem) {
              return defaultMoment;
            }

            return {
              ...defaultMoment,
              title: adminItem.title || defaultMoment.title,
              subtitle: adminItem.subtitle || defaultMoment.subtitle,
              link: adminItem.buttonLink || defaultMoment.link,
              image: adminItem.image?.url || "",
            };
          })
          .filter((moment) => {
            /*
              If an item exists in the CMS but is hidden,
              remove it from the storefront.
            */
            const adminItem = adminItems.find(
              (item) => item.key === moment.key
            );

            if (!adminItem) {
              return true;
            }

            return adminItem.isActive !== false;
          });

        setMoments(updatedMoments);
      } catch (error) {
        console.error("Error loading Every Moment section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEveryMoment();
  }, []);

  return (
    <section className="bg-[#f8f6f1] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-[68px]">
      <div className="mx-auto max-w-[1480px]">
        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[0.92fr_2.08fr] lg:gap-10 xl:gap-12">
          {/* ===================================================
              LEFT CONTENT
          =================================================== */}

          <div className="px-1 sm:px-3 lg:px-1 xl:pr-4">
            {/* SMALL LABEL */}

            <div className="flex items-center gap-3">
              <span className="h-[2px] w-7 bg-red-600" />

              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-red-600 sm:text-[10px]">
                For Every Moment
              </p>
            </div>

            {/* HEADING */}

            <h2 className="mt-4 max-w-[380px] font-['Outfit'] text-[39px] font-extrabold leading-[0.94] tracking-[-0.055em] text-zinc-950 sm:text-[45px] lg:text-[48px] xl:text-[52px]">
              Step Into
              <br />
              What Matters
            </h2>

            {/* DESCRIPTION */}

            <p className="mt-5 max-w-[400px] text-[13px] leading-[1.7] text-zinc-600 sm:text-sm sm:leading-6">
              Whether it's college, work, travel or play — we have the right
              pair to match your journey.
            </p>

            {/* =================================================
                EXPLORE BUTTON
            ================================================= */}

            <Link
              to="/products/men"
              className="group mt-7 inline-flex min-h-[45px] items-center gap-4 rounded-full bg-zinc-950 px-5 pl-6 text-[11px] font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-800 hover:shadow-xl sm:min-h-[48px] sm:text-xs"
            >
              <span>Explore More</span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* ===================================================
              RIGHT — MOMENT CARDS
          =================================================== */}

          <div
            className={`grid gap-3 ${
              moments.length >= 4
                ? "grid-cols-2 sm:grid-cols-4 sm:gap-4"
                : moments.length === 3
                ? "grid-cols-2 sm:grid-cols-3 sm:gap-4"
                : moments.length === 2
                ? "grid-cols-2 sm:gap-4"
                : "grid-cols-1 sm:grid-cols-2 sm:gap-4"
            }`}
          >
            {loading
              ? defaultMoments.map((moment) => (
                  <div
                    key={moment.key}
                    className="relative aspect-[0.72] min-h-[250px] animate-pulse overflow-hidden rounded-[10px] bg-zinc-200 sm:min-h-[300px] lg:min-h-[350px]"
                  />
                ))
              : moments.map((moment) => {
                  return (
                    <Link
                      key={moment.key}
                      to={moment.link}
                      className="group relative aspect-[0.72] min-h-[250px] overflow-hidden rounded-[10px] bg-zinc-300 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:min-h-[300px] lg:aspect-[0.70] lg:min-h-[350px]"
                    >
                      {/* =================================================
                          FALLBACK BACKGROUND
                      ================================================= */}

                      <div
                        className="absolute inset-0"
                        style={{
                          background: moment.fallback,
                        }}
                      />

                      {/* =================================================
                          ADMIN POSTER IMAGE
                      ================================================= */}

                      {moment.image && (
                        <img
                          src={moment.image}
                          alt={moment.title}
                          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      )}

                      {/* =================================================
                          TOP SOFT OVERLAY
                      ================================================= */}

                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />

                      {/* =================================================
                          BOTTOM DARK GRADIENT
                      ================================================= */}

                      <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                      {/* =================================================
                          CARD CONTENT
                      ================================================= */}

                      <div className="absolute inset-x-0 bottom-0 z-10 p-4 text-center sm:p-5">
                        <h3 className="font-['Outfit'] text-[18px] font-extrabold tracking-[-0.035em] text-white sm:text-[20px] lg:text-[21px]">
                          {moment.title}
                        </h3>

                        <p className="mt-1 text-[9px] font-medium text-white/80 sm:text-[10px]">
                          {moment.subtitle}
                        </p>
                      </div>

                      {/* =================================================
                          HOVER ARROW
                      ================================================= */}

                      <div className="absolute right-3 top-3 z-20 flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-white/90 text-xs font-bold text-zinc-950 opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        →
                      </div>

                      {/* =================================================
                          HOVER RED ACCENT
                      ================================================= */}

                      <div className="absolute bottom-0 left-0 z-20 h-[3px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />
                    </Link>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EveryMoment; 