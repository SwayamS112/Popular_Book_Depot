import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  Truck,
  RotateCcw,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

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
     HERO DISABLED
  ========================================================= */

  if (!hero.isActive) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-zinc-950">

      {/* =====================================================
          HERO IMAGE
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

        {/* Main dark overlay */}

        <div className="absolute inset-0 bg-black/30" />

        {/* Strong left readability */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 via-45% to-black/15" />

        {/* Right subtle overlay */}

        <div className="absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-black/20 to-transparent" />

        {/* Bottom fade */}

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      </div>

      {/* =====================================================
          MAIN HERO
      ===================================================== */}

      <div className="relative mx-auto min-h-[430px] max-w-[1480px] px-6 py-10 sm:px-8 lg:min-h-[470px] lg:px-10 xl:px-14">

        {/* ===================================================
            LEFT CONTENT
        =================================================== */}

        <div className="relative z-20 flex min-h-[390px] items-center">

          <div className="max-w-[650px]">

            {/* EYEBROW */}

            <div className="hero-reveal">

              <p className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.28em] text-red-400 sm:text-[10px]">

                <span className="h-[1px] w-9 bg-red-500 sm:w-10" />

                {hero.badge}

              </p>

            </div>

            {/* TITLE */}

            <div className="hero-reveal hero-reveal-delay-1 mt-4 sm:mt-5">

              <h1 className="font-['Outfit'] text-[clamp(3.2rem,6.4vw,6.3rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.065em] text-white">

                {hero.title}

                {hero.highlight && (
                  <span className="block">
                    {hero.highlight}
                  </span>
                )}

              </h1>

            </div>

            {/* DESCRIPTION */}

            {hero.description && (
              <div className="hero-reveal hero-reveal-delay-2">

                <p className="mt-5 max-w-[500px] text-[13px] leading-[1.65] text-white/80 sm:mt-6 sm:text-sm sm:leading-6">
                  {hero.description}
                </p>

              </div>
            )}

            {/* BUTTONS */}

            <div className="hero-reveal hero-reveal-delay-3 mt-6 flex flex-wrap items-center gap-3">

              {hero.primaryButton?.text && (
                <Link
                  to={
                    hero.primaryButton.link ||
                    "/products/men"
                  }
                  className="group inline-flex min-h-[46px] items-center gap-3 rounded-full bg-white px-4 pl-5 text-[11px] font-bold text-zinc-950 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-600 hover:text-white hover:shadow-2xl sm:min-h-[48px] sm:gap-4 sm:pl-6 sm:text-xs"
                >

                  <span>
                    {hero.primaryButton.text}
                  </span>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-zinc-950">
                    →
                  </span>

                </Link>
              )}

              {hero.secondaryButton?.text && (
                <Link
                  to={
                    hero.secondaryButton.link ||
                    "/products/women"
                  }
                  className="group inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 text-[11px] font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:text-zinc-950 sm:min-h-[48px] sm:px-6 sm:text-xs"
                >

                  {hero.secondaryButton.text}

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>

                </Link>
              )}

            </div>

          </div>

        </div>

        {/* ===================================================
            RIGHT SIDE — NEW HERITAGE PANEL
        =================================================== */}

        <div className="pointer-events-none absolute inset-y-8 right-5 z-30 hidden items-center lg:flex xl:right-10">

          <div className="hero-floating-card relative h-[350px] w-[205px] overflow-hidden rounded-[28px] border border-white/15 bg-[#171717]/92 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl xl:h-[365px] xl:w-[225px]">

            {/* =================================================
                DECORATIVE RED CIRCLE
            ================================================= */}

            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-600/20" />

            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full border border-red-500/20" />

            {/* =================================================
                CARD CONTENT
            ================================================= */}

            <div className="relative flex h-full flex-col p-5 xl:p-6">

              {/* TOP BRAND LINE */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="h-[2px] w-7 bg-red-500" />

                  <span className="text-[7px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Popular Heritage
                  </span>

                </div>

                <Sparkles
                  size={13}
                  className="text-red-500"
                  strokeWidth={1.7}
                />

              </div>

              {/* 50+ */}

              <div className="mt-7">

                <p className="text-[8px] font-bold uppercase tracking-[0.26em] text-white/40">
                  Trusted Since
                </p>

                <p className="mt-1 font-['Outfit'] text-[55px] font-extrabold leading-none tracking-[-0.07em] text-white xl:text-[62px]">
                  {hero.stats?.[0]?.value || "50+"}
                </p>

                <p className="mt-1 text-[9px] font-medium uppercase tracking-[0.16em] text-white/45">
                  Years of Trust
                </p>

              </div>

              {/* DIVIDER */}

              <div className="my-5 h-px bg-white/10" />

              {/* BRAND MESSAGE */}

              <div>

                <p className="font-['Outfit'] text-[27px] font-semibold italic leading-[0.94] tracking-[-0.04em] text-[#f5f0e8] xl:text-[30px]">

                  Good
                  <br />

                  Shoes
                  <br />

                  <span className="text-red-500">
                    Brighter
                  </span>
                  <br />

                  Days

                </p>

              </div>

              {/* DECORATIVE LINES */}

              <div className="relative mt-4 h-5 w-20">

                <span className="absolute left-0 top-1 h-[2px] w-16 rotate-[-6deg] bg-white/70" />

                <span className="absolute left-4 top-3 h-[2px] w-11 rotate-[4deg] bg-red-500" />

              </div>

              {/* BOTTOM QUALITY BADGE */}

              <div className="mt-auto flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-3">

                <div>

                  <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-white/40">
                    Our Promise
                  </p>

                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-white">
                    Quality • Comfort
                  </p>

                </div>

                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600">

                  <ArrowUpRight
                    size={13}
                    className="text-white"
                  />

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          PREMIUM BENEFITS BAR
      ===================================================== */}

      <div className="relative border-t border-zinc-200 bg-[#faf8f4]">

        <div className="mx-auto grid max-w-[1480px] grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              FREE SHIPPING
          ================================================= */}

          <div className="group flex min-h-[88px] items-center gap-3 border-b border-zinc-200 px-5 py-4 transition-all duration-300 hover:bg-white lg:border-b-0 lg:border-r lg:px-7">

            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-red-600 group-hover:text-white">

              <Truck
                size={21}
                strokeWidth={1.8}
              />

              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />

            </div>

            <div>

              <p className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-zinc-950 sm:text-xs">
                Free Shipping
              </p>

              <p className="mt-1 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                On orders above ₹999
              </p>

            </div>

          </div>

          {/* =================================================
              EASY RETURNS
          ================================================= */}

          <div className="group flex min-h-[88px] items-center gap-3 border-b border-zinc-200 px-5 py-4 transition-all duration-300 hover:bg-white lg:border-b-0 lg:border-r lg:px-7">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-zinc-950 group-hover:text-white">

              <RotateCcw
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <p className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-zinc-950 sm:text-xs">
                Easy Returns
              </p>

              <p className="mt-1 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                Hassle-free within 7 days
              </p>

            </div>

          </div>

          {/* =================================================
              SECURE PAYMENTS
          ================================================= */}

          <div className="group flex min-h-[88px] items-center gap-3 border-b border-zinc-200 px-5 py-4 transition-all duration-300 hover:bg-white lg:border-b-0 lg:border-r lg:px-7">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-red-600 group-hover:text-white">

              <ShieldCheck
                size={21}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <p className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-zinc-950 sm:text-xs">
                50+ Years of Experience   
              </p>

              <p className="mt-1 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
                A legacy built on quality & comfort
              </p>

            </div>

          </div>

          {/* =================================================
              CUSTOMER SUPPORT
          ================================================= */}

          <div className="group flex min-h-[88px] items-center gap-3 px-5 py-4 transition-all duration-300 hover:bg-white lg:px-7">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-zinc-950 group-hover:text-white">

              <PhoneCall
                size={20}
                strokeWidth={1.8}
              />

            </div>

            <div>

              <p className="text-[11px] font-extrabold uppercase tracking-[0.04em] text-zinc-950 sm:text-xs">
                Customer Support
              </p>

              <p className="mt-1 text-[9px] leading-4 text-zinc-500 sm:text-[10px]">
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