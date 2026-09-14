import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";

const initialStats = [
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
  const { token, user } = useContext(AuthContext);

  const [stats, setStats] = useState(initialStats);
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to load dashboard data"
          );
        }

        setDashboardData(data);

        const dashboardStats = data.stats || {};

        setStats([
          {
            label: "Total Products",
            value:
              dashboardStats.totalProducts ?? 0,
            description:
              "Manage your footwear collection",
            icon: "◈",
          },
          {
            label: "Total Orders",
            value:
              dashboardStats.totalOrders ?? 0,
            description:
              "Track customer purchases",
            icon: "□",
          },
          {
            label: "Customers",
            value:
              dashboardStats.totalCustomers ?? 0,
            description:
              "Your growing customer base",
            icon: "◎",
          },
          {
            label: "Revenue",
            value: `₹${Number(
              dashboardStats.totalRevenue || 0
            ).toLocaleString("en-IN")}`,
            description:
              "Sales performance overview",
            icon: "₹",
          },
        ]);
      } catch (err) {
        console.error(
          "Admin dashboard error:",
          err
        );

        setError(
          err.message ||
            "Unable to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
      setError("Admin authentication token is missing.");
    }
  }, [token]);

  const orderStatus =
    dashboardData?.ordersByStatus || {};

  const recentOrders =
    dashboardData?.recentOrders || [];

  const formatOrderId = (id) => {
    if (!id) return "—";

    return `#${String(id).slice(-8).toUpperCase()}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .charAt(0)
      .toUpperCase() +
      status.slice(1);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "packed":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200";
    }
  };

  return (
    <div className="mx-auto max-w-[1500px]">

      {/* ================= HEADING ================= */}

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
            <span className="block text-red-600">
              {user?.name || "Admin"}.
            </span>
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-500">
            Here's what's happening with
            Popular Book Depot today. Manage your
            store and keep track of everything from
            one place.
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

      {/* ================= ERROR ================= */}

      {error && (
        <div className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-red-700">
              Dashboard data couldn't be loaded
            </p>

            <p className="mt-1 text-xs text-red-600">
              {error}
            </p>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="shrink-0 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* ================= STATS ================= */}

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

            <p className="mt-2 break-words font-['Outfit'] text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl">
              {loading ? "..." : stat.value}
            </p>

            <p className="mt-3 text-xs text-zinc-400">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* ================= ORDER STATUS ================= */}

      <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              Order Overview
            </p>

            <h3 className="mt-3 font-['Outfit'] text-2xl font-bold text-zinc-950">
              Order status
            </h3>
          </div>

          <Link
            to="/admin/orders"
            className="text-sm font-bold text-red-600 transition hover:text-red-700"
          >
            View all orders →
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {[
            ["pending", "Pending"],
            ["confirmed", "Confirmed"],
            ["packed", "Packed"],
            ["shipped", "Shipped"],
            ["delivered", "Delivered"],
            ["cancelled", "Cancelled"],
          ].map(([key, label]) => (
            <div
              key={key}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
            >
              <p className="text-xs font-semibold text-zinc-500">
                {label}
              </p>

              <p className="mt-2 font-['Outfit'] text-2xl font-extrabold text-zinc-950">
                {loading
                  ? "..."
                  : orderStatus[key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">

        <section className="rounded-[2rem] bg-zinc-950 p-7 text-white sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-400">
            Quick Actions
          </p>

          <h3 className="mt-4 font-['Outfit'] text-3xl font-bold tracking-tight">
            Manage your store
            <span className="block text-white/50">
              with ease.
            </span>
          </h3>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">

            <Link
              to="/admin/products"
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-red-500/50 hover:bg-red-600"
            >
              <span className="text-xl">◈</span>

              <p className="mt-5 font-bold">
                Products
              </p>

              <p className="mt-2 text-xs leading-5 text-white/50 group-hover:text-white/70">
                Add, edit and manage your
                footwear.
              </p>
            </Link>

            <Link
              to="/admin/orders"
              className="group rounded-2xl border border-white/10 bg-white/[0.06] p-5 transition hover:border-red-500/50 hover:bg-red-600"
            >
              <span className="text-xl">□</span>

              <p className="mt-5 font-bold">
                Orders
              </p>

              <p className="mt-2 text-xs leading-5 text-white/50 group-hover:text-white/70">
                View and manage customer orders.
              </p>
            </Link>

          </div>
        </section>

        {/* ================= STORE STATUS ================= */}

        <section className="rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            Store Status
          </p>

          <h3 className="mt-4 font-['Outfit'] text-2xl font-bold text-zinc-950">
            Your store at a glance.
          </h3>

          <div className="mt-7 space-y-5">

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                01
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Active products
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {loading
                    ? "Loading..."
                    : `${dashboardData?.stats?.activeProducts ?? 0} products currently visible in your store.`}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                02
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Pending orders
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {loading
                    ? "Loading..."
                    : `${orderStatus.pending ?? 0} orders currently need attention.`}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
                03
              </div>

              <div>
                <p className="text-sm font-bold text-zinc-800">
                  Customers
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  {loading
                    ? "Loading..."
                    : `${dashboardData?.stats?.totalCustomers ?? 0} registered customers.`}
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* ================= RECENT ORDERS ================= */}

      <section className="mt-10 rounded-[2rem] border border-zinc-200 bg-white p-7 sm:p-9">

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              Latest Activity
            </p>

            <h3 className="mt-3 font-['Outfit'] text-2xl font-bold text-zinc-950">
              Recent orders
            </h3>
          </div>

          <Link
            to="/admin/orders"
            className="text-sm font-bold text-red-600 transition hover:text-red-700"
          >
            Manage orders →
          </Link>
        </div>

        {loading ? (
          <div className="mt-7 rounded-2xl bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-400">
            Loading recent orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="mt-7 rounded-2xl bg-zinc-50 px-5 py-10 text-center">
            <p className="text-sm font-bold text-zinc-700">
              No orders yet
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              Recent customer orders will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-zinc-200">
                  <th className="pb-4 pr-5 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Order
                  </th>

                  <th className="pb-4 pr-5 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Customer
                  </th>

                  <th className="pb-4 pr-5 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Date
                  </th>

                  <th className="pb-4 pr-5 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Amount
                  </th>

                  <th className="pb-4 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-zinc-100 last:border-0"
                  >
                    <td className="py-5 pr-5">
                      <p className="text-sm font-bold text-zinc-950">
                        {formatOrderId(order._id)}
                      </p>
                    </td>

                    <td className="py-5 pr-5">
                      <p className="text-sm font-semibold text-zinc-800">
                        {order.user?.name ||
                          "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {order.user?.email || "—"}
                      </p>
                    </td>

                    <td className="py-5 pr-5 text-sm text-zinc-500">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    <td className="py-5 pr-5 text-sm font-bold text-zinc-950">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {formatStatus(
                          order.orderStatus
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </section>
    </div>
  );
}

export default AdminDashboard;