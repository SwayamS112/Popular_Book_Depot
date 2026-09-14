import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const menuItems = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: "⌂",
    end: true,
  },
  {
    to: "/admin/home",
    label: "Home Page",
    icon: "▣",
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: "◈",
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: "□",
  },
  {
    to: "/admin/users",
    label: "Customers",
    icon: "◎",
  },
];

function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const adminName =
    user?.name ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Admin";

  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f6f6f3] text-zinc-900">
      <div className="flex min-h-screen">

        {/* ================= SIDEBAR ================= */}
        <aside className="hidden w-[270px] shrink-0 border-r border-zinc-200 bg-white lg:flex lg:flex-col">

          {/* Logo */}
          <div className="flex h-24 items-center gap-3 border-b border-zinc-100 px-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 font-['Outfit'] text-xl font-extrabold text-white shadow-lg shadow-red-600/20">
              P
            </div>

            <div>
              <p className="font-['Outfit'] text-lg font-extrabold tracking-tight text-zinc-950">
                PBD Admin
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                Control Center
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-7">
            <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Main Menu
            </p>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                    }`
                  }
                >
                  <span className="flex h-7 w-7 items-center justify-center text-lg">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Store Section */}
            <p className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Store
            </p>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              <span className="flex h-7 w-7 items-center justify-center text-lg">
                ↗
              </span>

              View Store
            </Link>
          </nav>

          {/* Bottom Card */}
          <div className="m-4 rounded-2xl bg-zinc-950 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Popular Book Depot
            </p>

            <p className="mt-3 font-['Outfit'] text-lg font-bold">
              50+ Years of Trust
            </p>

            <p className="mt-2 text-xs leading-5 text-white/60">
              Manage products, customer orders and store activity from one
              place.
            </p>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <div className="min-w-0 flex-1">

          {/* TOPBAR */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200 bg-[#f6f6f3]/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                Administration
              </p>

              <h1 className="mt-1 font-['Outfit'] text-lg font-bold text-zinc-950">
                Popular Book Depot
              </h1>
            </div>

            <div className="flex items-center gap-3">

              <Link
                to="/"
                className="hidden rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-red-200 hover:text-red-600 sm:inline-flex"
              >
                View Store ↗
              </Link>

              {/* Admin Profile */}
              <div className="group relative">

                <button
                  type="button"
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-1.5 pr-3 transition hover:border-zinc-300 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
                    {adminInitial}
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="max-w-[130px] truncate text-sm font-bold text-zinc-900">
                      {adminName}
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-600">
                      Administrator
                    </p>
                  </div>
                </button>

                {/* Dropdown */}
                <div className="invisible absolute right-0 top-full z-50 mt-2 w-48 translate-y-2 rounded-xl border border-zinc-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">

                  <Link
                    to="/"
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    View Store
                  </Link>

                  <div className="my-1 border-t border-zinc-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="p-5 sm:p-8 lg:p-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout; 