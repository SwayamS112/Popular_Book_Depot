import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API_BASE from "../../config/api.js";

const defaultHero = {
  badge: "FOOTWEAR FOR EVERY STEP",
  title: "STEP INTO",
  highlight: "STYLE.",
  description:
    "From everyday comfort to statement-making style, discover footwear designed for every journey, every occasion and every step.",
  primaryButton: {
    text: "SHOP MEN",
    link: "/products/men",
  },
  secondaryButton: {
    text: "SHOP WOMEN",
    link: "/products/women",
  },
  trustTitle: "50+ Years of Trust",
  trustDescription:
    "Serving generations with quality, comfort and customer belief.",
  stats: [
    { value: "50+", label: "Years of Trust" },
    { value: "10K+", label: "Happy Customers" },
    { value: "Premium", label: "Quality Footwear" },
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

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/hero-section`);
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
        console.error("Error loading Hero section:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className="relative isolate overflow-hidden bg-[#f5f3ee]">
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
        </div>
      </section>
    );
  }

  if (!hero.isActive) {
    return null;
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f3ee]">
      {/* ================= BACKGROUND ================= */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full border border-black/[0.04]" />

        <div className="absolute -right-24 bottom-[-70px] h-80 w-80 rounded-full border border-black/[0.04]" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/[0.035] lg:block" />
      </div>

      {/* ================= MAIN HERO ================= */}
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1586px] items-center gap-2 px-6 py-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-6 xl:px-16">
        {/* ================= LEFT CONTENT ================= */}
        <div className="relative z-20 max-w-[620px]">
          {/* Badge */}
          <div className="hero-reveal">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.25em] text-zinc-500">
              <span className="h-px w-10 bg-red-600" />
              {hero.badge}
            </p>
          </div>

          {/* Heading */}
          <div className="hero-reveal hero-reveal-delay-1">
            <h1 className="font-['Outfit'] text-[clamp(3.5rem,6.7vw,7rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-zinc-950">
              {hero.title}
              <span className="block text-red-600">{hero.highlight}</span>
            </h1>
          </div>

          {/* Description */}
          <div className="hero-reveal hero-reveal-delay-2">
            <p className="mt-7 max-w-[560px] text-base leading-8 text-zinc-600 sm:text-lg">
              {hero.description}
            </p>
          </div>

          {/* CTA */}
          <div className="hero-reveal hero-reveal-delay-3 mt-8 flex flex-wrap items-center gap-4">
            {hero.primaryButton?.text && (
              <Link
                to={hero.primaryButton.link || "/products/men"}
                className="group inline-flex items-center gap-4 rounded-full bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30"
              >
                {hero.primaryButton.text}

                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-zinc-950 transition duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}

            {hero.secondaryButton?.text && (
              <Link
                to={hero.secondaryButton.link || "/products/women"}
                className="group inline-flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-6 py-4 text-sm font-bold text-zinc-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:text-red-600 hover:shadow-md"
              >
                {hero.secondaryButton.text}

                <span className="transition duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            )}
          </div>

          {/* Trust */}
          <div className="hero-reveal hero-reveal-delay-4 mt-9 flex flex-wrap items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-xl text-white shadow-lg shadow-red-600/20">
              ★
            </div>

            <div>
              <p className="font-['Outfit'] text-lg font-bold text-zinc-950">
                {hero.trustTitle}
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                {hero.trustDescription}
              </p>
            </div>
          </div>

          {/* Stats */}
          {hero.stats?.length > 0 && (
            <div className="hero-reveal hero-reveal-delay-4 mt-7 flex flex-wrap gap-x-9 gap-y-5 border-t border-black/10 pt-6">
              {hero.stats.map((stat, index) => (
                <div key={index}>
                  <p className="font-['Outfit'] text-2xl font-bold text-zinc-950">
                    {stat.value}
                  </p>

                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT PRODUCT SHOWCASE ================= */}
        <div className="relative flex min-h-[470px] items-center justify-center lg:min-h-[650px]">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute right-[5%] top-1/2 h-[min(40rem,70vw)] w-[min(40rem,70vw)] -translate-y-1/2 rounded-full bg-red-500/10 blur-3xl" />

          {/* Decorative circles behind image */}
          <div className="pointer-events-none absolute right-[5%] top-1/2 h-[min(38rem,68vw)] w-[min(38rem,68vw)] -translate-y-1/2 rounded-full border border-red-600/[0.08]" />

          <div className="pointer-events-none absolute right-[8%] top-1/2 h-[min(32rem,58vw)] w-[min(32rem,58vw)] -translate-y-1/2 rounded-full border border-red-600/[0.06]" />

          {/* Product image */}
          <div className="hero-reveal hero-reveal-delay-2 group relative z-10 w-full max-w-[820px]">
            {hero.heroImage?.url ? (
              <div className="relative overflow-visible">
                <img
                  src={hero.heroImage.url}
                  alt="Popular Footwear"
                  className="mx-auto block h-auto w-full max-h-[650px] object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.12)] transition duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.018] group-hover:drop-shadow-[0_42px_60px_rgba(0,0,0,0.18)]"
                />

                {/* Premium hover pill */}
                <div className="pointer-events-none absolute bottom-[7%] left-1/2 -translate-x-1/2 translate-y-3 rounded-full border border-white/70 bg-white/90 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-700 opacity-0 shadow-xl backdrop-blur-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  Premium Footwear
                </div>
              </div>
            ) : (
              <div className="mx-auto flex aspect-[16/10] w-full max-w-[820px] items-center justify-center rounded-[3rem] bg-gradient-to-br from-red-600 via-red-500 to-orange-400 p-8 shadow-[0_35px_90px_rgba(220,38,38,0.22)]">
                <div className="flex h-full w-full items-center justify-center rounded-[2.5rem] border border-white/20 bg-white/10 text-center backdrop-blur">
                  <div>
                    <div className="rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-white">
                      POPULAR FOOTWEAR
                    </div>

                    <p className="mt-6 font-['Outfit'] text-5xl font-extrabold tracking-[-0.06em] text-white sm:text-7xl">
                      WALK
                    </p>

                    <p className="font-['Outfit'] text-5xl font-extrabold tracking-[-0.06em] text-zinc-950 sm:text-7xl">
                      BOLD.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Floating trust card — outside the uploaded image */}
          <div className="hero-floating-card absolute right-[1%] top-[8%] z-30 rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Since Day One
            </p>

            <p className="mt-1 font-['Outfit'] text-lg font-bold text-zinc-950">
              {hero.trustTitle}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Trusted by generations
            </p>
          </div>

          {/* Small floating 50+ badge */}
          <div className="hero-floating-card absolute bottom-[10%] left-[3%] z-30 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-red-100 bg-white/95 text-center shadow-xl backdrop-blur-xl">
            <span className="font-['Outfit'] text-xl font-extrabold text-red-600">
              {hero.stats?.[0]?.value || "50+"}
            </span>

            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
              Years of
              <br />
              Trust
            </span>
          </div>

          {/* Vertical quality text */}
          <p className="absolute -right-1 bottom-20 hidden origin-center rotate-90 text-[10px] font-bold tracking-[0.3em] text-zinc-400 xl:block">
            QUALITY • COMFORT • TRUST
          </p>
        </div>
      </div>

      {/* ================= BOTTOM MARQUEE ================= */}
      <div className="relative border-y border-black/10 bg-white/70 py-3 backdrop-blur">
        <div className="hero-marquee whitespace-nowrap text-xs font-bold tracking-[0.18em] text-zinc-600">
          <span>
            50+ YEARS OF TRUST • PREMIUM FOOTWEAR • WALK WITH CONFIDENCE •
            EVERYDAY COMFORT • STYLE FOR EVERY GENERATION • 50+ YEARS OF TRUST •
            PREMIUM FOOTWEAR • WALK WITH CONFIDENCE • EVERYDAY COMFORT •
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;