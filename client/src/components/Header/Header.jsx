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

  // =========================================================
  // MOBILE / TABLET DRAWER STATE
  // =========================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileExpandedMenu, setMobileExpandedMenu] =
    useState(null);

  const [mobileWomenFancyOpen, setMobileWomenFancyOpen] =
    useState(false);

  const [mobileCollectionsOpen, setMobileCollectionsOpen] =
    useState(false);

  const { totalItems } = useContext(CartContext);

  const {
    user,
    logout,
    isAuthenticated,
    isAdmin,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const headerRef = useRef(null);

  // =========================================================
  // CLOSE DESKTOP MENUS
  // =========================================================

  const closeDesktopMenus = () => {
    setActiveMenu(null);
    setWomenFancyOpen(false);
    setAccountMenuOpen(false);
  };

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileExpandedMenu(null);
    setMobileWomenFancyOpen(false);
    setMobileCollectionsOpen(false);
  };

  // =========================================================
  // CLOSE EVERYTHING
  // =========================================================

  const closeAllMenus = () => {
    closeDesktopMenus();
    closeMobileMenu();
  };

  // =========================================================
  // TOGGLE MOBILE SUBMENU
  // =========================================================

  const toggleMobileMenu = (menuName) => {
    setMobileExpandedMenu((current) =>
      current === menuName ? null : menuName
    );

    if (menuName !== "women") {
      setMobileWomenFancyOpen(false);
    }

    if (menuName !== "collections") {
      setMobileCollectionsOpen(false);
    }
  };

  // =========================================================
  // SCROLL EFFECT
  // =========================================================

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

  // =========================================================
  // LOCK BODY SCROLL WHEN MOBILE DRAWER IS OPEN
  // =========================================================

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  // =========================================================
  // ESC KEY
  // =========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  // =========================================================
  // CLICK OUTSIDE DESKTOP HEADER
  // =========================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target)
      ) {
        closeDesktopMenus();
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

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate("/");
  };

  // =========================================================
  // DESKTOP MENU STYLES
  // =========================================================

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

  // =========================================================
  // DROPDOWN ARROW
  // =========================================================

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

  // =========================================================
  // MOBILE CHEVRON
  // =========================================================

  const MobileChevron = ({ open }) => (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m6 9 6 6 6-6"
      />
    </svg>
  );

  // =========================================================
  // MOBILE MENU ROW
  // =========================================================

  const MobileMenuRow = ({
    children,
    onClick,
    href,
    active = false,
  }) => {
    if (href) {
      return (
        <Link
          to={href}
          onClick={onClick}
          className={`flex min-h-[52px] w-full items-center justify-between rounded-xl px-4 text-[15px] font-semibold transition-all duration-200 ${
            active
              ? "bg-red-50 text-red-700"
              : "text-zinc-800 hover:bg-zinc-100 active:bg-zinc-100"
          }`}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex min-h-[52px] w-full items-center justify-between rounded-xl px-4 text-left text-[15px] font-semibold transition-all duration-200 ${
          active
            ? "bg-red-50 text-red-700"
            : "text-zinc-800 hover:bg-zinc-100 active:bg-zinc-100"
        }`}
      >
        {children}
      </button>
    );
  };

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-zinc-200/80 bg-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.07)] backdrop-blur-xl"
            : "border-b border-zinc-100 bg-white"
        }`}
      >
        {/* ===================================================
            MAIN HEADER
        =================================================== */}

        <div className="mx-auto flex h-[64px] max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:px-10">

          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            onClick={closeAllMenus}
            className="group flex shrink-0 items-center"
          >
            <div className="leading-none">
              <p className="font-['Outfit'] text-[20px] font-extrabold tracking-[-0.055em] text-zinc-950 transition-colors duration-200 group-hover:text-zinc-800 sm:text-[21px]">
                POPULAR
              </p>

              <div className="mt-[4px] flex items-center gap-1.5">
                <span className="h-[3px] w-7 bg-red-600 transition-all duration-300 group-hover:w-9 sm:w-8 sm:group-hover:w-10" />

                <p className="text-[7px] font-bold tracking-[0.28em] text-zinc-500 sm:text-[8px]">
                  FOOTWEAR
                </p>
              </div>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION

              Hidden below lg.
          ================================================= */}

          <nav className="hidden h-full items-center gap-5 lg:flex xl:gap-7">

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

                        <span className="text-base">
                          ›
                        </span>
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

            {/* =================================================
                COLLECTIONS
            ================================================= */}

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => {
                setActiveMenu("collections");
                setWomenFancyOpen(false);
                setAccountMenuOpen(false);
              }}
              onMouseLeave={() => {
                setActiveMenu(null);
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveMenu(
                    activeMenu === "collections"
                      ? null
                      : "collections"
                  )
                }
                className={topMenuClass("collections")}
              >
                Collections

                <DropdownArrow
                  open={activeMenu === "collections"}
                />
              </button>

              {activeMenu === "collections" && (
                <div className="absolute left-1/2 top-full z-50 w-[270px] -translate-x-1/2 pt-3">
                  <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/95 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl animate-[fadeIn_0.18s_ease-out]">

                    <p className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      Discover
                    </p>

                    <Link
                      to="/collection/most-popular"
                      onClick={closeAllMenus}
                      className={menuItemClass}
                    >
                      Most Popular
                    </Link>

                    <Link
                      to="/collection/best-sellers"
                      onClick={closeAllMenus}
                      className={menuItemClass}
                    >
                      Best Sellers
                    </Link>

                    <Link
                      to="/collection/new-arrivals"
                      onClick={closeAllMenus}
                      className={menuItemClass}
                    >
                      New Arrivals
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* ===================================================
              RIGHT SIDE
          =================================================== */}

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

            {/* =================================================
                DESKTOP ACCOUNT
            ================================================= */}

            {isAuthenticated ? (
              <div className="relative hidden sm:block">

                <button
                  onClick={() => {
                    setAccountMenuOpen(
                      !accountMenuOpen
                    );

                    setActiveMenu(null);
                    setWomenFancyOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-full border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-zinc-200 hover:bg-zinc-50"
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

            {/* =================================================
                HAMBURGER

                Visible only below lg.
            ================================================= */}

            <button
              type="button"
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                if (mobileMenuOpen) {
                  closeMobileMenu();
                } else {
                  closeDesktopMenus();
                  setMobileMenuOpen(true);
                }
              }}
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-sm transition-all duration-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95 lg:hidden sm:h-11 sm:w-11"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 6l12 12M18 6 6 18"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7h16M4 12h16M4 17h16"
                  />
                </svg>
              )}
            </button>

          </div>
        </div>
      </header>

      {/* =======================================================
          MOBILE / TABLET BACKDROP
      ======================================================= */}

      <div
        className={`fixed inset-0 z-[80] bg-black/45 backdrop-blur-[2px] transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
        onClick={closeMobileMenu}
        aria-hidden={!mobileMenuOpen}
      />

      {/* =======================================================
          MOBILE / TABLET DRAWER
      ======================================================= */}

      <aside
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        className={`fixed right-0 top-0 z-[90] flex h-[100dvh] w-[min(88vw,390px)] flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.18)] transition-transform duration-400 ease-[cubic-bezier(.22,1,.36,1)] lg:hidden ${
          mobileMenuOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >

        {/* =====================================================
            DRAWER HEADER
        ===================================================== */}

        <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-5 py-4 sm:px-6">

          <Link
            to="/"
            onClick={closeAllMenus}
            className="group"
          >
            <div className="leading-none">
              <p className="font-['Outfit'] text-[21px] font-extrabold tracking-[-0.055em] text-zinc-950">
                POPULAR
              </p>

              <div className="mt-[4px] flex items-center gap-1.5">
                <span className="h-[3px] w-8 bg-red-600" />

                <p className="text-[8px] font-bold tracking-[0.28em] text-zinc-500">
                  FOOTWEAR
                </p>
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-800 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6 6 18"
              />
            </svg>
          </button>
        </div>

        {/* =====================================================
            DRAWER CONTENT
        ===================================================== */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">

          {/* =================================================
              QUICK ACCOUNT CARD
          ================================================= */}

          {isAuthenticated ? (
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-zinc-950 p-4 text-white">

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-zinc-950">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">
                  {user?.name || "My Account"}
                </p>

                <p className="mt-0.5 truncate text-[11px] text-white/60">
                  {user?.email || ""}
                </p>
              </div>

            </div>
          ) : (
            <Link
              to="/login"
              onClick={closeAllMenus}
              className="mb-4 flex min-h-[52px] items-center justify-between rounded-2xl bg-zinc-950 px-5 text-sm font-bold text-white shadow-lg transition-all hover:bg-zinc-800 active:scale-[0.99]"
            >
              <span>Login to Your Account</span>

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-zinc-950">
                →
              </span>
            </Link>
          )}

          {/* =================================================
              HOME
          ================================================= */}

          <MobileMenuRow
            href="/"
            onClick={closeAllMenus}
          >
            <span>Home</span>
          </MobileMenuRow>

          {/* =================================================
              MEN
          ================================================= */}

          <div className="mt-1">
            <MobileMenuRow
              active={
                mobileExpandedMenu === "men"
              }
              onClick={() =>
                toggleMobileMenu("men")
              }
            >
              <span>Men</span>

              <MobileChevron
                open={
                  mobileExpandedMenu === "men"
                }
              />
            </MobileMenuRow>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                mobileExpandedMenu === "men"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-3 mt-1 border-l-2 border-zinc-100 pl-3">

                  <Link
                    to="/products/men"
                    onClick={closeAllMenus}
                    className="mb-1 flex min-h-[48px] items-center justify-between rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700"
                  >
                    <span>
                      Shop All Men's Footwear
                    </span>

                    <span>→</span>
                  </Link>

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
            </div>
          </div>

          {/* =================================================
              WOMEN
          ================================================= */}

          <div className="mt-1">
            <MobileMenuRow
              active={
                mobileExpandedMenu === "women"
              }
              onClick={() =>
                toggleMobileMenu("women")
              }
            >
              <span>Women</span>

              <MobileChevron
                open={
                  mobileExpandedMenu === "women"
                }
              />
            </MobileMenuRow>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                mobileExpandedMenu === "women"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-3 mt-1 border-l-2 border-zinc-100 pl-3">

                  <Link
                    to="/products/women"
                    onClick={closeAllMenus}
                    className="mb-1 flex min-h-[48px] items-center justify-between rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700"
                  >
                    <span>
                      Shop All Women's Footwear
                    </span>

                    <span>→</span>
                  </Link>

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

                  <button
                    type="button"
                    onClick={() =>
                      setMobileWomenFancyOpen(
                        !mobileWomenFancyOpen
                      )
                    }
                    className="flex min-h-[48px] w-full items-center justify-between rounded-xl px-4 text-left text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    <span>Fancy Slippers</span>

                    <MobileChevron
                      open={
                        mobileWomenFancyOpen
                      }
                    />
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                      mobileWomenFancyOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="ml-3 border-l border-zinc-200 pl-3">

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
            </div>
          </div>

          {/* =================================================
              KIDS
          ================================================= */}

          <div className="mt-1">
            <MobileMenuRow
              active={
                mobileExpandedMenu === "kids"
              }
              onClick={() =>
                toggleMobileMenu("kids")
              }
            >
              <span>Kids</span>

              <MobileChevron
                open={
                  mobileExpandedMenu === "kids"
                }
              />
            </MobileMenuRow>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                mobileExpandedMenu === "kids"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-3 mt-1 border-l-2 border-zinc-100 pl-3">

                  <Link
                    to="/products/kids"
                    onClick={closeAllMenus}
                    className="mb-1 flex min-h-[48px] items-center justify-between rounded-xl bg-red-50 px-4 text-sm font-bold text-red-700"
                  >
                    <span>
                      Shop All Kids' Footwear
                    </span>

                    <span>→</span>
                  </Link>

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

                  <Link
                    to="/kids-age-to-size"
                    onClick={closeAllMenus}
                    className="mt-1 flex min-h-[48px] items-center justify-between rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-bold text-red-700"
                  >
                    <span>
                      Age to Size Guide
                    </span>

                    <span>→</span>
                  </Link>

                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              ACCESSORIES
          ================================================= */}

          <div className="mt-1">
            <MobileMenuRow
              href="/products/accessories"
              onClick={closeAllMenus}
            >
              <span>Accessories</span>
            </MobileMenuRow>
          </div>

          {/* =================================================
              COLLECTIONS
          ================================================= */}

          <div className="mt-1">
            <MobileMenuRow
              active={
                mobileExpandedMenu ===
                "collections"
              }
              onClick={() =>
                toggleMobileMenu("collections")
              }
            >
              <span>Collections</span>

              <MobileChevron
                open={
                  mobileExpandedMenu ===
                  "collections"
                }
              />
            </MobileMenuRow>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                mobileExpandedMenu ===
                "collections"
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="ml-3 mt-1 border-l-2 border-zinc-100 pl-3">

                  <Link
                    to="/collection/most-popular"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Most Popular
                  </Link>

                  <Link
                    to="/collection/best-sellers"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    Best Sellers
                  </Link>

                  <Link
                    to="/collection/new-arrivals"
                    onClick={closeAllMenus}
                    className={menuItemClass}
                  >
                    New Arrivals
                  </Link>

                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              CART
          ================================================= */}

          <div className="mt-4 border-t border-zinc-100 pt-4">

            <Link
              to="/cart"
              onClick={closeAllMenus}
              className="flex min-h-[54px] items-center justify-between rounded-xl bg-zinc-950 px-4 text-sm font-bold text-white transition-all hover:bg-zinc-800 active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">

                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-2 4h12"
                    />
                  </svg>
                </span>

                <span>My Cart</span>

              </div>

              <span className="flex min-w-7 items-center justify-center rounded-full bg-white px-2 py-1 text-[11px] font-black text-zinc-950">
                {totalItems > 99
                  ? "99+"
                  : totalItems}
              </span>

            </Link>

          </div>

          {/* =================================================
              ACCOUNT LINKS
          ================================================= */}

          <div className="mt-4 border-t border-zinc-100 pt-4">

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={closeAllMenus}
                  className={menuItemClass}
                >
                  My Profile
                </Link>

                <Link
                  to="/my-orders"
                  onClick={closeAllMenus}
                  className={menuItemClass}
                >
                  My Orders
                </Link>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      navigate("/admin");
                    }}
                    className="mt-1 flex min-h-[52px] w-full items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 text-left text-sm font-bold text-red-700 transition-all hover:border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    <span>Admin Panel</span>

                    <span>→</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex min-h-[52px] w-full items-center rounded-xl px-4 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeAllMenus}
                className={menuItemClass}
              >
                Login
              </Link>
            )}

          </div>

          {/* =================================================
              DRAWER FOOTER
          ================================================= */}

          <div className="mt-6 border-t border-zinc-100 py-5">

            <p className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Popular Footwear
            </p>

            <p className="mt-2 px-4 text-xs leading-5 text-zinc-500">
              Good Shoes. Better Days.
            </p>

          </div>

        </div>
      </aside>
    </>
  );
}

export default Header;