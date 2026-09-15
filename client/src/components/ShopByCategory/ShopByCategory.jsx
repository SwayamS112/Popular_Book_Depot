import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const categories = [
  {
    key: "men",
    title: "Men",
    subtitle: "Stylish & Comfortable",
    link: "/products/men",
    fallback:
      "linear-gradient(135deg, #172316 0%, #293c24 55%, #101510 100%)",
  },
  {
    key: "women",
    title: "Women",
    subtitle: "Trendy & Elegant",
    link: "/products/women",
    fallback:
      "linear-gradient(135deg, #c9948c 0%, #e4b8ae 55%, #9e6c66 100%)",
  },
  {
    key: "kids",
    title: "Kids",
    subtitle: "Fun for Every Step",
    link: "/products/kids",
    fallback:
      "linear-gradient(135deg, #7094ad 0%, #9dbbd0 55%, #52778f 100%)",
  },
  {
    key: "accessories",
    title: "Accessories",
    subtitle: "Complete Your Style",
    link: "/products/accessories",
    fallback:
      "linear-gradient(135deg, #4b2523 0%, #803a35 55%, #301514 100%)",
  },
];

function ShopByCategory() {
  const [categoryImages, setCategoryImages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            try {
              const response = await fetch(
                `${API_BASE}/api/products?section=${category.key}&limit=1`
              );

              if (!response.ok) {
                return {
                  key: category.key,
                  image: "",
                };
              }

              const data = await response.json();

              const product = data?.products?.[0];

              const image =
                product?.variants?.[0]?.images?.[0]?.url ||
                "";

              return {
                key: category.key,
                image,
              };
            } catch (error) {
              console.error(
                `Error loading ${category.title} category image:`,
                error
              );

              return {
                key: category.key,
                image: "",
              };
            }
          })
        );

        const imageMap = {};

        results.forEach((item) => {
          imageMap[item.key] = item.image;
        });

        setCategoryImages(imageMap);
      } catch (error) {
        console.error(
          "Error loading category images:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryImages();
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
            const image = categoryImages[category.key];

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
                  className="absolute inset-0"
                  style={{
                    background: category.fallback,
                  }}
                />

                {/* =================================================
                    PRODUCT IMAGE
                ================================================= */}

                {!loading && image && (
                  <img
                    src={image}
                    alt={category.title}
                    className="absolute bottom-[-3%] right-[-3%] z-[2] h-[92%] w-[72%] object-contain object-right-bottom drop-shadow-[0_20px_20px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-x-1"
                  />
                )}

                {/* =================================================
                    DARK GRADIENT
                ================================================= */}

                <div className="absolute inset-0 z-[3] bg-gradient-to-r from-black/35 via-black/5 to-transparent" />

                {/* =================================================
                    TOP CONTENT
                ================================================= */}

                <div className="relative z-[5] flex h-full flex-col justify-between p-5 sm:p-6">

                  <div>
                    <h3 className="font-['Outfit'] text-[24px] font-extrabold tracking-[-0.04em] text-white sm:text-[26px]">
                      {category.title}
                    </h3>

                    <p className="mt-1 max-w-[150px] text-[10px] font-medium text-white/85 sm:text-[11px]">
                      {category.subtitle}
                    </p>
                  </div>

                  {/* =================================================
                      ARROW
                  ================================================= */}

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-zinc-950 shadow-md transition-all duration-300 group-hover:translate-x-1 group-hover:bg-red-600 group-hover:text-white">
                    →
                  </div>

                </div>

                {/* =================================================
                    HOVER BORDER
                ================================================= */}

                <div className="pointer-events-none absolute inset-0 z-[10] rounded-[12px] border border-white/0 transition-all duration-500 group-hover:border-white/30" />

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