import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const defaultCategories = [
  {
    key: "men",
    title: "Men",
    subtitle: "Stylish & Comfortable",
    link: "/products/men",
    image: "",
    fallback:
      "linear-gradient(135deg, #172316 0%, #293c24 55%, #101510 100%)",
  },

  {
    key: "women",
    title: "Women",
    subtitle: "Trendy & Elegant",
    link: "/products/women",
    image: "",
    fallback:
      "linear-gradient(135deg, #c9948c 0%, #e4b8ae 55%, #9e6c66 100%)",
  },

  {
    key: "kids",
    title: "Kids",
    subtitle: "Fun for Every Step",
    link: "/products/kids",
    image: "",
    fallback:
      "linear-gradient(135deg, #7094ad 0%, #9dbbd0 55%, #52778f 100%)",
  },

  {
    key: "accessories",
    title: "Accessories",
    subtitle: "Complete Your Style",
    link: "/products/accessories",
    image: "",
    fallback:
      "linear-gradient(135deg, #4b2523 0%, #803a35 55%, #301514 100%)",
  },
];

function ShopByCategory() {
  const [categories, setCategories] = useState(
    defaultCategories
  );

  const [loading, setLoading] = useState(true);

  /* =========================================================
     LOAD SHOP BY CATEGORY FROM HOME SECTIONS
     
     Images now come from:
     
     Admin Home
        ↓
     Shop By Category
        ↓
     Individual poster
        ↓
     MongoDB / Cloudinary
        ↓
     Homepage
  ========================================================= */

  useEffect(() => {
    const fetchShopByCategory = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/home-sections`
        );

        if (!response.ok) {
          throw new Error(
            "Unable to load Shop By Category section."
          );
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to load Shop By Category section."
          );
        }

        const section = (data.sections || []).find(
          (item) =>
            item.sectionKey === "shop-by-category"
        );

        /*
          If the admin section does not exist yet,
          keep the existing fallback category layout.
        */

        if (!section) {
          setCategories(defaultCategories);
          return;
        }

        const adminItems = Array.isArray(section.items)
          ? [...section.items]
              .filter((item) => item.isActive !== false)
              .sort(
                (a, b) =>
                  (a.order ?? 0) -
                  (b.order ?? 0)
              )
          : [];

        /*
          Match admin items with our predefined
          category routes/design.

          This ensures that changing the poster
          from Admin does not accidentally change
          the customer's existing navigation.
        */

        const updatedCategories =
          defaultCategories.map((category) => {
            const adminItem =
              adminItems.find(
                (item) =>
                  item.key === category.key
              );

            if (!adminItem) {
              return category;
            }

            return {
              ...category,

              title:
                adminItem.title ||
                category.title,

              subtitle:
                adminItem.subtitle ||
                category.subtitle,

              image:
                adminItem.image?.url ||
                "",

              link:
                adminItem.buttonLink ||
                category.link,
            };
          });

        setCategories(updatedCategories);
      } catch (error) {
        console.error(
          "Error loading Shop By Category:",
          error
        );

        /*
          If backend data cannot be loaded,
          the homepage still shows the normal
          fallback design.
        */

        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchShopByCategory();
  }, []);

  return (
    <section className="bg-[#f8f7f4] px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">

      <div className="mx-auto max-w-[1480px]">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-8">

          <div>

            <p className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-red-600 sm:text-[10px]">

              <span className="h-[2px] w-6 bg-red-600" />

              Explore

            </p>

            <h2 className="font-['Outfit'] text-[30px] font-extrabold tracking-[-0.045em] text-zinc-950 sm:text-[36px] lg:text-[40px]">
              Shop by Category
            </h2>

          </div>

          <Link
            to="/products/men"
            className="group hidden items-center gap-2 pb-1 text-xs font-bold text-zinc-800 transition-colors hover:text-red-600 sm:flex"
          >

            View All

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>

          </Link>

        </div>

        {/* =================================================
            CATEGORY GRID
        ================================================= */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {categories.map((category) => {
            const image = category.image;

            return (
              <Link
                key={category.key}
                to={category.link}
                className="group relative block aspect-[1.55] overflow-hidden rounded-[12px] bg-zinc-200 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* =================================================
                    BACKGROUND
                ================================================= */}

                <div
                  className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                  style={{
                    background:
                      category.fallback,
                  }}
                />

                {/* =================================================
                    ADMIN POSTER IMAGE
                ================================================= */}

                {!loading && image && (
                  <img
                    src={image}
                    alt={category.title}
                    className="absolute inset-0 z-[2] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                )}

                {/* =================================================
                    IMAGE OVERLAY
                ================================================= */}

                <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/55 via-black/15 to-transparent transition-all duration-500 group-hover:from-black/60" />

                <div className="absolute inset-x-0 bottom-0 z-[3] h-[55%] bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="relative z-[5] flex h-full flex-col justify-between p-5 sm:p-6">

                  {/* TOP */}

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="h-[2px] w-5 bg-red-500 transition-all duration-300 group-hover:w-8" />

                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/70">
                        Collection
                      </span>

                    </div>

                    <h3 className="mt-2 font-['Outfit'] text-[24px] font-extrabold tracking-[-0.04em] text-white sm:text-[26px]">
                      {category.title}
                    </h3>

                    <p className="mt-1 max-w-[160px] text-[10px] font-medium leading-4 text-white/85 sm:text-[11px]">
                      {category.subtitle}
                    </p>

                  </div>

                  {/* BOTTOM */}

                  <div className="flex items-end justify-between">

                    <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/60 transition-colors group-hover:text-white">
                      Explore
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950 shadow-md transition-all duration-300 group-hover:translate-x-1 group-hover:bg-red-600 group-hover:text-white">
                      →
                    </div>

                  </div>

                </div>

                {/* =================================================
                    HOVER BORDER
                ================================================= */}

                <div className="pointer-events-none absolute inset-0 z-[10] rounded-[12px] border border-white/0 transition-all duration-500 group-hover:border-white/40" />

                {/* =================================================
                    RED BOTTOM ACCENT
                ================================================= */}

                <div className="absolute bottom-0 left-0 z-[11] h-[3px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />

              </Link>
            );
          })}

        </div>

        {/* =================================================
            MOBILE VIEW ALL
        ================================================= */}

        <Link
          to="/products/men"
          className="group mt-6 flex items-center justify-center gap-2 text-xs font-bold text-zinc-800 sm:hidden"
        >

          View All

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>

        </Link>

      </div>

    </section>
  );
}

export default ShopByCategory;