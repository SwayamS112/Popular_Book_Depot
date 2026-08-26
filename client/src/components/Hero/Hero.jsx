import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#f5f3ee]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full border border-black/[0.04]" />
        <div className="absolute -right-24 bottom-[-70px] h-80 w-80 rounded-full border border-black/[0.04]" />

        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/[0.035] lg:block" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-[1440px] items-center gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12 lg:py-10 xl:px-16">
        {/* LEFT CONTENT */}
        <div className="relative z-10 max-w-2xl">
          <div className="hero-reveal">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold tracking-[0.25em] text-zinc-500">
              <span className="h-px w-10 bg-red-600" />
              FOOTWEAR FOR EVERY STEP
            </p>
          </div>

          <div className="hero-reveal hero-reveal-delay-1">
            <h1 className="font-['Outfit'] text-[clamp(3.5rem,7vw,7.2rem)] font-extrabold leading-[0.88] tracking-[-0.06em] text-zinc-950">
              STEP INTO
              <span className="block text-red-600">STYLE.</span>
            </h1>
          </div>

          <div className="hero-reveal hero-reveal-delay-2">
            <p className="mt-7 max-w-lg text-base leading-8 text-zinc-600 sm:text-lg">
              From everyday comfort to statement-making style, discover
              footwear designed for every journey, every occasion and every
              step.
            </p>
          </div>

          {/* CTA */}
          <div className="hero-reveal hero-reveal-delay-3 mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products/men"
              className="group inline-flex items-center gap-4 rounded-full bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl hover:shadow-red-600/30"
            >
              SHOP MEN

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm text-zinc-950 transition duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/products/women"
              className="group inline-flex items-center gap-3 rounded-full border border-zinc-300 bg-white px-6 py-4 text-sm font-bold text-zinc-900 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:text-red-600 hover:shadow-md"
            >
              SHOP WOMEN

              <span className="transition duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Trust / 50 years */}
          <div className="hero-reveal hero-reveal-delay-4 mt-10 flex flex-wrap items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-xl text-white shadow-lg shadow-red-600/20">
              ★
            </div>

            <div>
              <p className="font-['Outfit'] text-lg font-bold text-zinc-950">
                50+ Years of Trust
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Serving generations with quality, comfort and customer belief.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="hero-reveal hero-reveal-delay-4 mt-8 flex flex-wrap gap-x-9 gap-y-5 border-t border-black/10 pt-6">
            <div>
              <p className="font-['Outfit'] text-2xl font-bold text-zinc-950">
                50+
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Years of Trust
              </p>
            </div>

            <div>
              <p className="font-['Outfit'] text-2xl font-bold text-zinc-950">
                10K+
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Happy Customers
              </p>
            </div>

            <div>
              <p className="font-['Outfit'] text-2xl font-bold text-zinc-950">
                Premium
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.15em] text-zinc-500">
                Quality Footwear
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative flex min-h-[430px] items-center justify-center lg:min-h-[590px]">
          {/* Main circle */}
          <div className="absolute h-[min(34rem,82vw)] w-[min(34rem,82vw)] rounded-full bg-gradient-to-br from-red-600 via-red-500 to-orange-400 shadow-[0_35px_90px_rgba(220,38,38,0.22)]" />

          {/* Decorative rings */}
          <div className="absolute h-[min(29rem,70vw)] w-[min(29rem,70vw)] rounded-full border border-white/30" />

          <div className="absolute h-[min(24rem,58vw)] w-[min(24rem,58vw)] rounded-full border border-white/20" />

          {/* Main visual */}
          <div className="hero-shoe-placeholder relative z-10 flex h-[min(27rem,72vw)] w-[min(27rem,72vw)] items-center justify-center rounded-[3rem] border border-white/30 bg-white/15 p-7 shadow-2xl backdrop-blur-md">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-[2.2rem] border border-white/20 bg-gradient-to-br from-white/20 via-white/10 to-black/5 px-8 text-center">
              <div className="rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[10px] font-bold tracking-[0.25em] text-white backdrop-blur">
                POPULAR BOOK DEPOT
              </div>

              <p className="mt-7 font-['Outfit'] text-5xl font-extrabold tracking-[-0.06em] text-white sm:text-7xl">
                WALK
              </p>

              <p className="font-['Outfit'] text-5xl font-extrabold tracking-[-0.06em] text-zinc-950 sm:text-7xl">
                BOLD.
              </p>

              <div className="mt-7 h-px w-20 bg-white/60" />

              <p className="mt-5 text-sm leading-6 text-white/90">
                Style that moves with you.
                <br />
                Comfort you can trust.
              </p>
            </div>
          </div>

          {/* Floating card */}
          <div className="hero-floating-card absolute right-0 top-[10%] z-20 rounded-2xl border border-white/70 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Since Day One
            </p>

            <p className="mt-1 font-['Outfit'] text-lg font-bold text-zinc-950">
              50+ Years Strong
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Trusted by generations
            </p>
          </div>

          {/* Trust badge */}
          <div className="absolute bottom-[8%] left-[3%] z-20 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-black/10 bg-white/85 text-center shadow-lg backdrop-blur">
            <span className="font-['Outfit'] text-xl font-extrabold text-red-600">
              50+
            </span>

            <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-zinc-500">
              Years of
              <br />
              Trust
            </span>
          </div>

          <p className="absolute -right-2 bottom-16 hidden origin-center rotate-90 text-[10px] font-bold tracking-[0.3em] text-zinc-400 xl:block">
            QUALITY • COMFORT • TRUST
          </p>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative border-y border-black/10 bg-white/70 py-3 backdrop-blur">
        <div className="hero-marquee whitespace-nowrap text-xs font-bold tracking-[0.18em] text-zinc-600">
          <span>
            50+ YEARS OF TRUST • PREMIUM FOOTWEAR • WALK WITH CONFIDENCE • EVERYDAY COMFORT • STYLE FOR EVERY GENERATION • 50+ YEARS OF TRUST • PREMIUM FOOTWEAR • WALK WITH CONFIDENCE • EVERYDAY COMFORT •
          </span>
        </div>
      </div>
    </section>
  );
}

export default Hero;