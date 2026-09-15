import {
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";

import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../../context/CartContext.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";

function Header() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [womenFancyOpen, setWomenFancyOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { totalItems } = useContext(CartContext);

  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
  } = useContext(AuthContext);

  const navigate = useNavigate();
  const headerRef = useRef(null);

  const closeAllMenus = () => {
    setActiveMenu(null);
    setWomenFancyOpen(false);
    setAccountMenuOpen(false);
  };

  /* =========================================================
     SCROLL EFFECT
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================================================
     CLICK OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate("/");
  };

  /* =========================================================
     EXISTING HOVER STYLES
     Kept intentionally from your original header.
  ========================================================= */

  const menuItemClass =
    "group flex items-center rounded-xl px-4 py-3 text-sm font-medium text-zinc-600 transition-all duration-200 hover:bg-zinc-100 hover:pl-5 hover:text-zinc-950";

  const topMenuClass = (menuName) =>
    `group relative flex h-full items-center gap-1.5 py-1 text-sm font-semibold transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:rounded-full after:bg-red-600 after:transition-all after:duration-300 ${
      activeMenu === menuName
        ? "text-zinc-950 after:w-full"
        : "text-zinc-600 hover:text-zinc-950 after:w-0 hover:after:w-full"
    }`;

  const simpleNavClass =
    "relative py-1 text-sm font-semibold text-zinc-600 transition-colors duration-200 hover:text-zinc-950 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full";

  const shopAllButtonClass =
    "group relative mb-2 flex w-full items-center justify-between overflow-hidden rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 px-4 py-3.5 text-sm font-bold text-red-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500 hover:from-red-600 hover:via-red-600 hover:to-red-500 hover:text-white hover:shadow-lg hover:shadow-red-600/20";

  const DropdownArrow = ({ open }) => (
    <svg
      className={`h-3.5 w-3.5 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-zinc-200/80 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.07)] backdrop-blur-xl"
          : "border-b border-zinc-100 bg-white"
      }`}
    >
      {/* =====================================================
          MAIN HEADER
      ===================================================== */}

      <div className="mx-auto flex h-[64px] max-w-[1480px] items-center justify-between px-5 sm:px-6 lg:px-10">

        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          to="/"
          onClick={closeAllMenus}
          className="group flex shrink-0 items-center"
        >
          <div className="leading-none">
            <p className="font-['Outfit'] text-[21px] font-extrabold tracking-[-0.055em] text-zinc-950 transition-colors duration-200 group-hover:text-zinc-800">
              POPULAR
            </p>

            <div className="mt-[4px] flex items-center gap-1.5">
              <span className="h-[3px] w-8 bg-red-600 transition-all duration-300 group-hover:w-10" />

              <p className="text-[8px] font-bold tracking-[0.28em] text-zinc-500">
                FOOTWEAR
              </p>
            </div>
          </div>
        </Link>

        {/* ===================================================
            DESKTOP NAVIGATION

            Search + Offers intentionally NOT included.
        =================================================== */}

        <nav className="hidden h-full items-center gap-6 lg:flex xl:gap-7">

          {/* HOME */}

          <Link
            to="/"
            onClick={closeAllMenus}
            className={simpleNavClass}
          >
            Home
          </Link>

          {/* =================================================
              MEN
          ================================================= */}

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => {
              setActiveMenu("men");
              setWomenFancyOpen(false);
              setAccountMenuOpen(false);
            }}
            onMouseLeave={() => {
              setActiveMenu(null);
              setWomenFancyOpen(false);
            }}
          >
            <Link
              to="/products/men"
              onClick={closeAllMenus}
              className={topMenuClass("men")}
            >
              Men

              <DropdownArrow
                open={activeMenu === "men"}
              />
            </Link>

            {activeMenu === "men" && (
              <div className="absolute left-1/2 top-full z-50 w-[280px] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]">

                  <Link
                    to="/products/men"
                    onClick={closeAllMenus}
                    className={shopAllButtonClass}
                  >
                    <span className="relative z-10">
                      Shop All Men's Footwear
                    </span>

                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-base font-bold text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-red-600">
                      →
                    </span>
                  </Link>

                  <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Explore
                  </p>

                  <Link
                    to="/products/men?subcategory=sports-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sports Shoes
                  </Link>

                  <Link
                    to="/products/men?subcategory=formal-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Formal Shoes
                  </Link>

                  <Link
                    to="/products/men?subcategory=sneakers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sneakers
                  </Link>

                  <div className="my-1 border-t border-zinc-100" />

                  <Link
                    to="/products/men?subcategory=sandals"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sandals
                  </Link>

                  <Link
                    to="/products/men?subcategory=home-slippers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Home Slippers
                  </Link>

                  <Link
                    to="/products/men?subcategory=outside-slippers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Outside Slippers
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              WOMEN
          ================================================= */}

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => {
              setActiveMenu("women");
              setAccountMenuOpen(false);
            }}
            onMouseLeave={() => {
              setActiveMenu(null);
              setWomenFancyOpen(false);
            }}
          >
            <Link
              to="/products/women"
              onClick={closeAllMenus}
              className={topMenuClass("women")}
            >
              Women

              <DropdownArrow
                open={activeMenu === "women"}
              />
            </Link>

            {activeMenu === "women" && (
              <div className="absolute left-1/2 top-full z-50 w-[285px] -translate-x-1/2 pt-3">
                <div className="overflow-visible rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]">

                  <Link
                    to="/products/women"
                    onClick={closeAllMenus}
                    className={shopAllButtonClass}
                  >
                    <span className="relative z-10">
                      Shop All Women's Footwear
                    </span>

                    <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-base font-bold text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-red-600">
                      →
                    </span>
                  </Link>

                  <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Explore
                  </p>

                  <Link
                    to="/products/women?subcategory=sports-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sports Shoes
                  </Link>

                  <Link
                    to="/products/women?subcategory=formal-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Formal Shoes
                  </Link>

                  <Link
                    to="/products/women?subcategory=sneakers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sneakers
                  </Link>

                  <Link
                    to="/products/women?subcategory=sandals"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sandals
                  </Link>

                  <Link
                    to="/products/women?subcategory=home-slippers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Home Slippers
                  </Link>

                  {/* FANCY SLIPPERS */}

                  <div
                    className="relative"
                    onMouseEnter={() =>
                      setWomenFancyOpen(true)
                    }
                    onMouseLeave={() =>
                      setWomenFancyOpen(false)
                    }
                  >
                    <Link
                      to="/products/women?subcategory=fancy-slippers"
                      className={`${menuItemClass} justify-between`}
                      onClick={() =>
                        setWomenFancyOpen(true)
                      }
                    >
                      Fancy Slippers

                      <span className="text-base">›</span>
                    </Link>

                    {womenFancyOpen && (
                      <div className="absolute left-full top-0 z-[60] w-48 pl-3">
                        <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)]">

                          <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                            Fancy Styles
                          </p>

                          <Link
                            to="/products/women?subcategory=fancy-slippers&childCategory=heels"
                            onClick={closeAllMenus}
                            className={menuItemClass}
                          >
                            Heels
                          </Link>

                          <Link
                            to="/products/women?subcategory=fancy-slippers&childCategory=flats"
                            onClick={closeAllMenus}
                            className={menuItemClass}
                          >
                            Flats
                          </Link>

                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/products/women?subcategory=outside-slippers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Outside Slippers
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              KIDS
          ================================================= */}

          <div
            className="relative flex h-full items-center"
            onMouseEnter={() => {
              setActiveMenu("kids");
              setWomenFancyOpen(false);
              setAccountMenuOpen(false);
            }}
            onMouseLeave={() => {
              setActiveMenu(null);
              setWomenFancyOpen(false);
            }}
          >
            <Link
              to="/products/kids"
              onClick={closeAllMenus}
              className={topMenuClass("kids")}
            >
              Kids

              <DropdownArrow
                open={activeMenu === "kids"}
              />
            </Link>

            {activeMenu === "kids" && (
              <div className="absolute left-1/2 top-full z-50 w-[270px] -translate-x-1/2 pt-3">
                <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]">

                  <Link
                    to="/products/kids"
                    onClick={closeAllMenus}
                    className="group mb-2 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm font-bold text-red-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20"
                  >
                    <span>
                      Shop All Kids' Footwear
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-base text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-red-600">
                      →
                    </span>
                  </Link>

                  <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Explore
                  </p>

                  <Link
                    to="/products/kids?subcategory=sports-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sports Shoes
                  </Link>

                  <Link
                    to="/products/kids?subcategory=school-shoes"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    School Shoes
                  </Link>

                  <Link
                    to="/products/kids?subcategory=sandals"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Sandals
                  </Link>

                  <Link
                    to="/products/kids?subcategory=slippers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Slippers
                  </Link>

                  <div className="mt-1 border-t border-zinc-100 pt-1">
                    <Link
                      to="/kids-age-to-size"
                      onClick={closeAllMenus}
                      className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-zinc-900 transition hover:bg-red-50 hover:text-red-700"
                    >
                      Age to Size Guide

                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================
              ACCESSORIES
          ================================================= */}

          <Link
            to="/products/accessories"
            onClick={closeAllMenus}
            className={simpleNavClass}
          >
            Accessories
          </Link>

        </nav>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div className="flex items-center gap-3 sm:gap-4">

          {/* =================================================
              ACCOUNT
          ================================================= */}

          {isAuthenticated ? (
            <div className="relative">

              <button
                onClick={() => {
                  setAccountMenuOpen(
                    !accountMenuOpen
                  );

                  setActiveMenu(null);
                  setWomenFancyOpen(false);
                }}
                className="hidden items-center gap-2 rounded-full border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-zinc-200 hover:bg-zinc-50 sm:flex"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white">
                  {user?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </span>

                <span className="hidden max-w-24 truncate text-sm font-semibold text-zinc-700 xl:block">
                  {user?.name}
                </span>

                <DropdownArrow
                  open={accountMenuOpen}
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.14)] backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]">

                  <div className="rounded-xl bg-zinc-50 px-4 py-3.5">
                    <p className="truncate text-sm font-bold text-zinc-950">
                      {user?.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-500">
                      {user?.email}
                    </p>
                  </div>

                  <div className="mt-2">

                    <button
                      onClick={() => {
                        closeAllMenus();
                        navigate("/profile");
                      }}
                      className={menuItemClass}
                    >
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        closeAllMenus();
                        navigate("/my-orders");
                      }}
                      className={menuItemClass}
                    >
                      My Orders
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          closeAllMenus();
                          navigate("/admin");
                        }}
                        className="mt-1 flex w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-700 transition-all duration-200 hover:border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <span>Admin Panel</span>
                        <span>→</span>
                      </button>
                    )}

                  </div>

                  <div className="mt-2 border-t border-zinc-100 pt-2">

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                    >
                      Logout
                    </button>

                  </div>

                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeAllMenus}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 sm:block"
            >
              Login
            </Link>
          )}

          {/* =================================================
              CART
          ================================================= */}

          <Link
            to="/cart"
            onClick={closeAllMenus}
            aria-label="Open shopping cart"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:text-red-600 hover:shadow-lg hover:shadow-red-600/10 sm:h-11 sm:w-11"
          >
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2 4h12M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-[10px] font-black text-white shadow-sm">
                {totalItems > 99
                  ? "99+"
                  : totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
}

export default Header;