import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "◇",
    title: "Wide Collection",
    description: "Latest styles for everyone",
  },
  {
    icon: "✪",
    title: "Best Prices",
    description: "Great value, always",
  },
  {
    icon: "♧",
    title: "Trusted by Thousands",
    description: "Happy customers across India",
  },
  {
    icon: "♡",
    title: "Quality Assured",
    description: "Only the best for you",
  },
];

function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-[#f5eee5] px-4 py-9 sm:px-6 sm:py-11 lg:px-8 lg:py-12">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute -left-28 -top-32 h-72 w-72 rounded-full border border-zinc-900/[0.025]" />

      <div className="pointer-events-none absolute -bottom-36 right-[-80px] h-80 w-80 rounded-full border border-zinc-900/[0.025]" />

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent" />

      {/* =====================================================
          CONTAINER
      ===================================================== */}

      <div className="relative mx-auto max-w-[1480px]">

        <div className="grid items-center gap-7 lg:grid-cols-[0.82fr_1.55fr_0.68fr] lg:gap-8 xl:grid-cols-[0.82fr_1.6fr_0.72fr] xl:gap-10">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative z-10">

            {/* LABEL */}

            <div className="flex items-center gap-3">

              <span className="h-[2px] w-7 bg-red-600" />

              <span className="text-[9px] font-bold uppercase tracking-[0.23em] text-red-600 sm:text-[10px]">
                Why Choose Popular
              </span>

            </div>

            {/* HEADING */}

            <h2 className="mt-3 max-w-[360px] font-['Outfit'] text-[34px] font-extrabold uppercase leading-[0.91] tracking-[-0.055em] text-zinc-950 sm:text-[39px] lg:text-[40px] xl:text-[44px]">

              Why Choose
              <br />
              Popular
              <br />
              Book Depot?

            </h2>

            {/* DESCRIPTION */}

            <p className="mt-4 max-w-[340px] text-[12px] leading-[1.65] text-zinc-700 sm:text-[13px] sm:leading-[1.7]">

              More than just footwear — we bring you
              quality, comfort and trust, every step of
              the way.

            </p>

            {/* BUTTON */}

            <Link
              to="/products/men"
              className="group mt-6 inline-flex items-center gap-4 rounded-full bg-red-600 py-2 pl-5 pr-2 text-[10px] font-bold text-white shadow-[0_8px_20px_rgba(220,38,38,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-[0_14px_28px_rgba(220,38,38,0.25)] sm:text-[11px]"
            >

              <span>
                Learn More
              </span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-red-600 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

          {/* =================================================
              BENEFIT CARDS
          ================================================= */}

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">

            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="group flex min-h-[135px] flex-col items-center justify-center rounded-[11px] border border-white/90 bg-white/70 px-2.5 py-4 text-center shadow-[0_3px_12px_rgba(0,0,0,0.025)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_10px_25px_rgba(0,0,0,0.07)] sm:min-h-[150px] sm:px-3"
              >

                {/* ICON */}

                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-900/[0.06] bg-white text-[25px] font-light text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:border-red-100 group-hover:bg-red-50 group-hover:text-red-600 sm:h-12 sm:w-12">

                  {benefit.icon}

                </div>

                {/* TITLE */}

                <h3 className="mt-3 max-w-[120px] font-['Outfit'] text-[10px] font-extrabold leading-[1.15] text-zinc-950 sm:text-[11px] lg:text-xs">

                  {benefit.title}

                </h3>

                {/* DESCRIPTION */}

                <p className="mt-2 max-w-[125px] text-[8px] leading-[1.45] text-zinc-500 sm:text-[9px]">

                  {benefit.description}

                </p>

              </div>
            ))}

          </div>

          {/* =================================================
              RIGHT VISUAL
          ================================================= */}

          <div className="relative hidden h-[255px] overflow-hidden rounded-[14px] lg:block xl:h-[275px]">

            {/* =================================================
                BACKGROUND IMAGE / VISUAL
            ================================================= */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#d9c7b0] via-[#c2aa8e] to-[#8b7660]" />

            {/* Decorative large circle */}

            <div className="absolute -right-20 -top-24 h-[310px] w-[310px] rounded-full border border-white/30" />

            <div className="absolute -left-28 -bottom-32 h-[330px] w-[330px] rounded-full border border-white/20" />

            {/* =================================================
                ANGLED SHOE VISUAL
            ================================================= */}

            <div className="absolute left-[50%] top-[49%] w-[88%] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] transition-transform duration-700 group-hover:scale-105">

              {/* Shadow */}

              <div className="absolute bottom-[-16px] left-[6%] h-[22px] w-[88%] rounded-[50%] bg-black/20 blur-xl" />

              {/* Shoe sole */}

              <div className="absolute bottom-0 left-[4%] h-[21px] w-[91%] rounded-[50%] bg-white shadow-[0_7px_12px_rgba(0,0,0,0.18)]" />

              {/* Shoe body */}

              <div className="relative h-[115px] w-full overflow-hidden rounded-[60%_43%_35%_48%] bg-gradient-to-br from-[#f9f9f9] via-[#e7e7e7] to-[#aaa] shadow-[12px_17px_28px_rgba(0,0,0,0.25)]">

                {/* Heel */}

                <div className="absolute right-[4%] top-[8%] h-[70px] w-[27%] rounded-[35%_55%_35%_45%] bg-gradient-to-br from-[#eeeeee] to-[#999]" />

                {/* Main upper panel */}

                <div className="absolute left-[18%] top-[15%] h-[75px] w-[44%] -skew-x-[13deg] rounded-[30%] border-b-[6px] border-zinc-400/40" />

                {/* Lace details */}

                <div className="absolute left-[28%] top-[30%] h-[4px] w-[31%] rotate-[7deg] rounded-full bg-zinc-600/55" />

                <div className="absolute left-[27%] top-[44%] h-[4px] w-[30%] rotate-[7deg] rounded-full bg-zinc-600/45" />

                <div className="absolute left-[26%] top-[58%] h-[4px] w-[29%] rotate-[7deg] rounded-full bg-zinc-600/35" />

                {/* Dark side stripe */}

                <div className="absolute bottom-[20%] left-[16%] h-[9px] w-[45%] rotate-[7deg] rounded-full bg-zinc-950/85" />

                {/* Red accent */}

                <div className="absolute bottom-[29%] right-[21%] h-[5px] w-[22%] rotate-[-13deg] rounded-full bg-red-600/75" />

              </div>

            </div>

            {/* =================================================
                IMAGE TEXT
            ================================================= */}

            <div className="absolute bottom-5 left-5">

              <p className="text-[7px] font-bold uppercase tracking-[0.22em] text-zinc-800/70">
                Quality First
              </p>

              <p className="mt-1 font-['Outfit'] text-[17px] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-zinc-950">
                Good Shoes
                <br />
                Better Days
              </p>

            </div>

            {/* Red line */}

            <span className="absolute bottom-5 right-5 h-[2px] w-8 bg-red-600" />

          </div>

        </div>

      </div>

    </section>
  );
}

export default WhyChooseUs;