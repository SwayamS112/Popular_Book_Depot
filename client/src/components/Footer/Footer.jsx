import { Link } from "react-router-dom";

import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";

function Footer() {
  const shopLatitude = 31.834923;
  const shopLongitude = 76.504387;

  const whatsappNumber = "91 9805830001";
  const phoneNumber = "+91 9816072001";
  const emailAddress = "pbd.sujanpur@gmail.com";

  const whatsappMessage = encodeURIComponent(
    "Hello Popular Book Depot, I would like to know more about your footwear."
  );

  const mapUrl = `https://www.google.com/maps?q=${shopLatitude},${shopLongitude}&z=16&output=embed`;

  return (
    <footer className="bg-[#111212] text-white">

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-7 sm:py-14 lg:px-10 lg:py-16">

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.15fr_1fr_1fr] lg:gap-14 xl:gap-20">

          {/* =================================================
              COLUMN 1 — BRAND
          ================================================= */}

          <div>

            {/* LOGO */}

            <div className="inline-flex flex-col">

              <div className="font-['Outfit'] text-[29px] font-extrabold leading-none tracking-[-0.06em] text-white sm:text-[32px]">
                POPULAR
              </div>

              <div className="mt-1 flex items-center gap-2">

                <span className="h-[8px] w-[40px] bg-red-600" />

                <span className="text-[8px] font-medium tracking-[0.24em] text-white/60">
                  FOOTWEAR
                </span>

              </div>

            </div>

            {/* TAGLINE */}

            <p className="mt-4 font-['Outfit'] text-sm font-semibold text-white">
              Steps to a Better Tomorrow
            </p>

            {/* DESCRIPTION */}

            <p className="mt-4 max-w-[390px] text-[12px] leading-[1.8] text-white/65 sm:text-[13px]">

              At Popular Book Depot, we bring you a wide
              range of footwear for every age, style and
              occasion. Quality products, great prices and
              a better shopping experience — always.

            </p>

            {/* =================================================
                SOCIAL ICONS
            ================================================= */}

            <div className="mt-6 flex items-center gap-3">

              {/* Instagram

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:-translate-y-1 hover:border-red-500 hover:bg-red-600"
              >
                <Instagram size={17} strokeWidth={1.8} />
              </a> */}

              {/* WhatsApp */}

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-600"
              >
                <MessageCircle size={17} strokeWidth={1.8} />
              </a>

            </div>

          </div>

          {/* =================================================
              COLUMN 2 — STORE
          ================================================= */}

          <div>

            {/* TITLE */}

            <div className="flex items-center gap-3">

              <h3 className="font-['Outfit'] text-[19px] font-bold text-white">
                Our Store
              </h3>

            </div>

            {/* RED LINE */}

            <div className="mt-2 h-[2px] w-7 bg-red-600" />

            {/* ADDRESS */}

            <div className="mt-5 flex items-start gap-3">

              <MapPin
                size={20}
                className="mt-0.5 flex-shrink-0 text-white"
                strokeWidth={2}
              />

              <div className="text-[12px] leading-[1.6] text-white/75 sm:text-[13px]">

                <p>
                  Main Market, Popular Book Depot
                </p>

                <p>
                  Sujanpur Tira, Himachal Pradesh - 176110
                </p>

              </div>

            </div>

            {/* =================================================
                MAP
            ================================================= */}

            <div className="mt-5 overflow-hidden rounded-[10px] border border-white/10 bg-white/5">

              <iframe
                title="Popular Book Depot Location"
                src={mapUrl}
                width="100%"
                height="190"
                style={{
                  border: 0,
                  display: "block",
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

            </div>

            {/* VIEW ON MAP */}

            <a
              href={`https://www.google.com/maps?q=${shopLatitude},${shopLongitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-3 inline-flex items-center gap-2 text-[10px] font-semibold text-white/70 transition-colors duration-300 hover:text-white"
            >

              <span>
                View on Google Maps
              </span>

              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </a>

          </div>

          {/* =================================================
              COLUMN 3 — CONTACT
          ================================================= */}

          <div>

            {/* TITLE */}

            <h3 className="font-['Outfit'] text-[19px] font-bold text-white">
              Get in Touch
            </h3>

            {/* RED LINE */}

            <div className="mt-2 h-[2px] w-7 bg-red-600" />

            {/* CONTACT ITEMS */}

            <div className="mt-5 space-y-4">

              {/* PHONE */}

              <a
                href={`tel:${phoneNumber.replace(/\s/g, "")}`}
                className="group flex items-center gap-3 text-[12px] text-white/75 transition-colors duration-300 hover:text-white sm:text-[13px]"
              >

                <Phone
                  size={18}
                  className="flex-shrink-0 text-white"
                  strokeWidth={1.8}
                />

                <span>
                  {phoneNumber}
                </span>

              </a>

              {/* EMAIL */}

              <a
                href={`mailto:${emailAddress}`}
                className="group flex items-center gap-3 break-all text-[12px] text-white/75 transition-colors duration-300 hover:text-white sm:text-[13px]"
              >

                <Mail
                  size={18}
                  className="flex-shrink-0 text-white"
                  strokeWidth={1.8}
                />

                <span>
                  {emailAddress}
                </span>

              </a>

              {/* HOURS */}

              <div className="flex items-start gap-3 text-[12px] text-white/75 sm:text-[13px]">

                <Clock
                  size={18}
                  className="mt-0.5 flex-shrink-0 text-white"
                  strokeWidth={1.8}
                />

                <div className="leading-[1.6]">

                  <p>
                    Mon - Sat, 8:30 AM - 9:00 PM
                  </p>

                  <p>
                    Sunday: Closed
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                WHATSAPP BUTTON
            ================================================= */}

            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex min-h-[45px] items-center gap-3 rounded-full bg-white px-5 pl-5 text-[11px] font-bold text-zinc-950 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#25D366] hover:text-white hover:shadow-xl sm:text-xs"
            >

              <MessageCircle
                size={17}
                strokeWidth={2}
              />

              <span>
                Chat on WhatsApp
              </span>

              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />

            </a>

            {/* CLOSING MESSAGE */}

            <div className="mt-7 hidden lg:block">

              <p className="font-['Outfit'] text-[18px] font-medium italic leading-[1.15] text-white/80">
                Thank you
              </p>

              <p className="mt-1 font-['Outfit'] text-[15px] font-medium italic text-white/65">
                for being a part of our journey!
              </p>

              <div className="mt-3 h-[2px] w-8 rotate-[-8deg] bg-red-600" />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          BOTTOM BAR
      ===================================================== */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-5 py-4 text-[9px] text-white/60 sm:px-7 sm:text-[10px] lg:flex-row lg:items-center lg:justify-between lg:px-10">

          {/* COPYRIGHT */}

          <p>
            © {new Date().getFullYear()} Popular Book Depot. All rights reserved.
          </p>

          </div>

        </div>

    </footer>
  );
}

export default Footer;