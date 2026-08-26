import { Link } from "react-router-dom";

const stats = [
  {
    label: "Total Products",
    value: "—",
    description: "Manage your footwear collection",
    icon: "◈",
  },
  {
    label: "Total Orders",
    value: "—",
    description: "Track customer purchases",
    icon: "□",
  },
  {
    label: "Customers",
    value: "—",
    description: "Your growing customer base",
    icon: "◎",
  },
  {
    label: "Revenue",
    value: "—",
    description: "Sales performance overview",
    icon: "₹",
  },
];

function AdminDashboard() {
  return (
    <div className="mx-auto max-w-[1500px]">
      {/* Heading */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-red-600" />

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
              Overview
            </p>
          </div>

          <h2 className="mt-4 font-['Outfit'] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950 sm:text-5xl">
            Welcome back,
            <span className="block text-red-600">Admin.</span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Here's what's happening with Popular Book Depot today.
            Manage your store and keep track of everything from one place.
          </p>
        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:bg-red-700"
        >
          Manage Products
          <span>→</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group rounded-[1.5rem] border border-zinc-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-zinc-200/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                {stat.icon}
              </div>

              <span className="text-xs font-bold text-zinc-300">
                0{index + 1}
              </span>
            </div>

            <p className="mt-7 text-sm font-medium text-zinc-500">
              {stat.label}
            </p>

            <p className="mt-2 font-['Outfit'] text-4xl font-extrabold tracking-tight text-zinc-950">
              {stat.value}
            </p>

            <p className="mt-3 text-xs text-zinc-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[2rem] bg-zinc-950 p-7 text-white sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            Quick Actions
          </p>

          <h3 className="mt-4 font-['Outfit'] text-3xl font-bold tracking-tight">
            Manage your store
            <span className="block text-white/50">with ease.</span>
          </h3>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              to="/admin/products"
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-red-500/50 hover:bg-red-600"
            >
              <span className="text-xl">◈</span>

              <p className="mt-5 font-bold">Products</p>

              <p className="mt-2 text-xs leading-5 text-white/50 group-hover:text-white/70">
                Add, edit and manage your footwear.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-red-500/50 hover:bg-red-600"
            >
              <span className="text-xl">□</span>

              <p className="mt-5 font-bold">Orders</p>

              <p className="mt-2 text-xs leading-5 text-white/50 group-hover:text-white/70">
                View and manage customer orders.
              </p>
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Store Status
          </p>

          <h3 className="mt-4 font-['Outfit'] text-2xl font-bold text-zinc-950">
            Ready to manage your store.
          </h3>

          <div className="mt-7 space-y-5">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                01
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Add your products
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Keep your footwear collection updated.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                02
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Monitor orders
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Process and track customer purchases.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                03
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Grow your business
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Use your store data to make better decisions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;