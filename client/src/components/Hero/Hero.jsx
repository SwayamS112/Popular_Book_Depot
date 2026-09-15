import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const defaultHero = {
  badge: "STEP INTO A BETTER YOU",
  title: "FOOTWEAR",
  highlight: "FOR EVERY MOVE",
  description:
    "From everyday comfort to standout style — find your perfect pair at Popular Book Depot.",

  primaryButton: {
    text: "SHOP NOW",
    link: "/products/men",
  },

  secondaryButton: {
    text: "",
    link: "",
  },

  trustTitle: "50+ Years of Trust",

  trustDescription:
    "Serving generations with quality, comfort and customer belief.",

  stats: [
    {
      value: "50+",
      label: "Years of Trust",
    },
    {
      value: "10K+",
      label: "Happy Customers",
    },
    {
      value: "Premium",
      label: "Quality Footwear",
    },
  ],

  heroImage: {
    url: "",
    publicId: "",
  },

  isActive: true,
};

function Hero() {
  const [hero, setHero] = useState(defaultHero);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     FETCH HERO DATA
  ========================================================= */

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/hero-section`
        );

        const data = await response.json();

        if (response.ok && data.success && data.hero) {
          setHero({
            ...defaultHero,
            ...data.hero,

            primaryButton: {
              ...defaultHero.primaryButton,
              ...(data.hero.primaryButton || {}),
            },

            secondaryButton: {
              ...defaultHero.secondaryButton,
              ...(data.hero.secondaryButton || {}),
            },

            heroImage: {
              ...defaultHero.heroImage,
              ...(data.hero.heroImage || {}),
            },

            stats:
              data.hero.stats?.length > 0
                ? data.hero.stats
                : defaultHero.stats,
          });
        }
      } catch (error) {
        console.error(
          "Error loading Hero section:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="relative h-[430px] overflow-hidden bg-zinc-950">
        <div className="flex h-full items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
        </div>
      </section>
    );
  }

  /* =========================================================
     HERO DISABLED FROM ADMIN
  ========================================================= */

  if (!hero.isActive) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950">

      {/* =====================================================
          HERO BACKGROUND IMAGE
      ===================================================== */}

      <div className="absolute inset-0">

        {hero.heroImage?.url ? (
          <img
            src={hero.heroImage.url}
            alt="Popular Footwear"
            className="h-full w-full object-cover object-center"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-zinc-950 via-zinc-800 to-zinc-950" />
        )}

        {/* Overall image darkening */}

        <div className="absolute inset-0 bg-black/25" />

        {/* Left text readability */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 via-45% to-black/10" />

        {/* Bottom fade */}

        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />

      </div>

      {/* =====================================================
          MAIN HERO CONTAINER
      ===================================================== */}

      <div className="relative mx-auto flex min-h-[430px] max-w-[1480px] items-center px-6 py-12 sm:px-8 lg:min-h-[470px] lg:px-10 xl:px-14">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="relative z-20 max-w-[650px]">

          {/* EYEBROW */}

          <div className="hero-reveal">

            <p className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.27em] text-red-400 sm:text-[10px]">

              <span className="h-[1px] w-8 bg-red-500 sm:w-10" />

              {hero.badge}

            </p>

          </div>

          {/* =================================================
              TITLE
          ================================================= */}

          <div className="hero-reveal hero-reveal-delay-1 mt-4 sm:mt-5">

            <h1 className="font-['Outfit'] text-[clamp(3.2rem,6.4vw,6.3rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.065em] text-white">

              {hero.title}

              {hero.highlight && (
                <span className="block text-white">
                  {hero.highlight}
                </span>
              )}

            </h1>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          {hero.description && (
            <div className="hero-reveal hero-reveal-delay-2">

              <p className="mt-5 max-w-[500px] text-[13px] leading-[1.65] text-white/80 sm:mt-6 sm:text-sm sm:leading-6">

                {hero.description}

              </p>

            </div>
          )}

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="hero-reveal hero-reveal-delay-3 mt-6 flex flex-wrap items-center gap-3">

            {/* PRIMARY */}

            {hero.primaryButton?.text && (
              <Link
                to={
                  hero.primaryButton.link ||
                  "/products/men"
                }
                className="group inline-flex min-h-[45px] items-center gap-3 rounded-full bg-white px-4 pl-5 text-[11px] font-bold text-zinc-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:text-white hover:shadow-2xl sm:min-h-[48px] sm:gap-4 sm:pl-6 sm:text-xs"
              >

                <span>
                  {hero.primaryButton.text}
                </span>

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-sm text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-zinc-950">
                  →
                </span>

              </Link>
            )}

            {/* SECONDARY */}

            {hero.secondaryButton?.text && (
              <Link
                to={
                  hero.secondaryButton.link ||
                  "/products/women"
                }
                className="group inline-flex min-h-[45px] items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-[11px] font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-zinc-950 sm:min-h-[48px] sm:px-6 sm:text-xs"
              >

                {hero.secondaryButton.text}

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>

              </Link>
            )}

          </div>

        </div>

        {/* ===================================================
            RIGHT SIDE — GOOD SHOES / BRIGHTER DAYS
        =================================================== */}

        <div className="pointer-events-none absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 lg:right-8 lg:block xl:right-12">

          <div className="flex flex-col items-end">

            <p className="font-['Outfit'] text-[23px] font-medium italic leading-[1.05] text-white/85 xl:text-[27px]">

              Good
              <br />

              Shoes
              <br />

              Brighter
              <br />

              Days

            </p>

            {/* Handwritten-style underline */}

            <div className="relative mt-4 h-4 w-16">

              <span className="absolute right-0 top-1 h-px w-14 rotate-[-7deg] bg-white/70" />

              <span className="absolute right-3 top-3 h-px w-9 rotate-[5deg] bg-white/50" />

            </div>

          </div>

        </div>

        {/* ===================================================
            SMALL TRUST LABEL
        =================================================== */}

        <div className="hero-floating-card absolute bottom-16 right-7 z-20 hidden lg:block xl:right-12">

          <div className="rounded-xl border border-white/20 bg-black/35 px-4 py-3 backdrop-blur-md">

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-white/55">
              Trusted Since
            </p>

            <p className="mt-1 font-['Outfit'] text-xl font-extrabold leading-none text-white">
              {hero.stats?.[0]?.value || "50+"}
            </p>

            <p className="mt-1 text-[8px] text-white/60">
              Years of Trust
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM TRUST / FEATURE STRIP
      ===================================================== */}

      <div className="relative border-t border-white/10 bg-[#f8f6f2]">

        <div className="mx-auto grid max-w-[1480px] grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              FREE SHIPPING
          ================================================= */}

          <div className="flex min-h-[70px] items-center gap-3 border-zinc-200 px-5 py-3 lg:border-r lg:px-7">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[22px] text-zinc-950">
              🚚
            </div>

            <div>

              <p className="text-[11px] font-bold text-zinc-950 sm:text-xs">
                Free Shipping
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                On orders above ₹999
              </p>

            </div>

          </div>

          {/* =================================================
              EASY RETURNS
          ================================================= */}

          <div className="flex min-h-[70px] items-center gap-3 border-zinc-200 px-5 py-3 lg:border-r lg:px-7">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[22px] text-zinc-950">
              ↻
            </div>

            <div>

              <p className="text-[11px] font-bold text-zinc-950 sm:text-xs">
                Easy Returns
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                Hassle-free within 7 days
              </p>

            </div>

          </div>

          {/* =================================================
              SECURE PAYMENTS
          ================================================= */}

          <div className="flex min-h-[70px] items-center gap-3 border-zinc-200 px-5 py-3 lg:border-r lg:px-7">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[22px] text-zinc-950">
              ◈
            </div>

            <div>

              <p className="text-[11px] font-bold text-zinc-950 sm:text-xs">
                Secure Payments
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                100% secure & trusted
              </p>

            </div>

          </div>

          {/* =================================================
              CUSTOMER SUPPORT
          ================================================= */}

          <div className="flex min-h-[70px] items-center gap-3 px-5 py-3 lg:px-7">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center text-[22px] text-zinc-950">
              ☎
            </div>

            <div>

              <p className="text-[11px] font-bold text-zinc-950 sm:text-xs">
                Customer Support
              </p>

              <p className="mt-0.5 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                We're here to help
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;