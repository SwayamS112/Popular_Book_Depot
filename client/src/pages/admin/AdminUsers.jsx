import { useEffect, useMemo, useState } from "react";
import API_BASE from "../../config/api.js";
const API_URL = `${API_BASE}/api`;

function AdminUsers() {
  const [customers, setCustomers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [actionLoading, setActionLoading] =
    useState(false);

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await fetch(
        `${API_URL}/api/admin/customers?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load customers"
        );
      }

      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Admin customers error:", err);
      setError(
        err.message || "Unable to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CUSTOMERS
  // ==========================================
  useEffect(() => {
    fetchCustomers();
  }, [statusFilter]);

  // ==========================================
  // SEARCH
  // ==========================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================
  // VIEW CUSTOMER
  // ==========================================
  const viewCustomer = async (customerId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load customer"
        );
      }

      setSelectedCustomer(data.customer);
    } catch (err) {
      console.error("Customer details error:", err);

      setError(
        err.message || "Unable to load customer details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================
  // CHANGE CUSTOMER STATUS
  // ==========================================
  const changeCustomerStatus = async (
    customer
  ) => {
    const nextStatus = !customer.isActive;

    const actionText = nextStatus
      ? "activate"
      : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} ${customer.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      const response = await fetch(
        `${API_URL}/admin/customers/${customer._id}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            isActive: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update customer status"
        );
      }

      setCustomers((previous) =>
        previous.map((item) =>
          item._id === customer._id
            ? {
                ...item,
                isActive: nextStatus,
              }
            : item
        )
      );

      setSelectedCustomer((previous) =>
        previous &&
        previous._id === customer._id
          ? {
              ...previous,
              isActive: nextStatus,
            }
          : previous
      );
    } catch (err) {
      console.error(
        "Customer status error:",
        err
      );

      setError(
        err.message ||
          "Unable to update customer status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // SUMMARY
  // ==========================================
  const summary = useMemo(() => {
    const total = customers.length;

    const active = customers.filter(
      (customer) => customer.isActive
    ).length;

    const inactive = customers.filter(
      (customer) => !customer.isActive
    ).length;

    const customersWithOrders =
      customers.filter(
        (customer) => customer.totalOrders > 0
      ).length;

    const totalRevenue = customers.reduce(
      (sum, customer) =>
        sum + (customer.totalSpent || 0),
      0
    );

    return {
      total,
      active,
      inactive,
      customersWithOrders,
      totalRevenue,
    };
  }, [customers]);

  // ==========================================
  // FORMATTERS
  // ==========================================
  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  const getInitial = (name) => {
    return (
      String(name || "?")
        .trim()
        .charAt(0)
        .toUpperCase() || "?"
    );
  };

  const getOrderStatusClass = (status) => {
    const classes = {
      pending:
        "bg-amber-50 text-amber-700",
      confirmed:
        "bg-blue-50 text-blue-700",
      packed:
        "bg-violet-50 text-violet-700",
      shipped:
        "bg-indigo-50 text-indigo-700",
      delivered:
        "bg-emerald-50 text-emerald-700",
      cancelled:
        "bg-red-50 text-red-700",
    };

    return (
      classes[status] ||
      "bg-zinc-100 text-zinc-600"
    );
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">
          Customers
        </p>

        <h2 className="mt-3 font-['Outfit'] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950">
          Customer Management
        </h2>

        <p className="mt-3 text-sm text-zinc-500">
          View and manage your Popular Book Depot
          customers.
        </p>
      </div>

      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {/* ====================================== */}
      {/* SUMMARY CARDS */}
      {/* ====================================== */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Total Customers"
          value={summary.total}
          icon="◎"
        />

        <SummaryCard
          label="Active Customers"
          value={summary.active}
          icon="✓"
        />

        <SummaryCard
          label="With Orders"
          value={summary.customersWithOrders}
          icon="◌"
        />

        <SummaryCard
          label="Customer Spend"
          value={formatCurrency(
            summary.totalRevenue
          )}
          icon="₹"
        />
      </div>

      {/* ====================================== */}
      {/* MAIN CARD */}
      {/* ====================================== */}

      <div className="mt-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white">
        {/* FILTER BAR */}

        <div className="border-b border-zinc-100 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}

            <div className="relative w-full lg:max-w-md">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                ⌕
              </span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search name, email or phone..."
                className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-50"
              />
            </div>

            {/* Status */}

            <div className="flex gap-2">
              {[
                ["all", "All"],
                ["active", "Active"],
                ["inactive", "Inactive"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(value)
                  }
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    statusFilter === value
                      ? "bg-zinc-950 text-white"
                      : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-950"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ====================================== */}
        {/* LOADING */}
        {/* ====================================== */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
              Loading customers...
            </div>
          </div>
        ) : customers.length === 0 ? (
          /* ==================================== */
          /* EMPTY */
          /* ==================================== */

          <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-2xl text-red-600">
              ◎
            </div>

            <h3 className="mt-5 font-['Outfit'] text-2xl font-bold text-zinc-950">
              No customers found
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500">
              Try changing your search or status
              filter.
            </p>
          </div>
        ) : (
          <>
            {/* ================================== */}
            {/* DESKTOP TABLE */}
            {/* ================================== */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/70 text-left">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Contact
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Joined
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Orders
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Spent
                    </th>

                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <CustomerRow
                      key={customer._id}
                      customer={customer}
                      onView={viewCustomer}
                      onStatusChange={
                        changeCustomerStatus
                      }
                      formatDate={formatDate}
                      formatCurrency={
                        formatCurrency
                      }
                      getInitial={getInitial}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* ================================== */}
            {/* MOBILE CARDS */}
            {/* ================================== */}

            <div className="divide-y divide-zinc-100 lg:hidden">
              {customers.map((customer) => (
                <div
                  key={customer._id}
                  className="p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar
                        name={customer.name}
                        getInitial={getInitial}
                      />

                      <div className="min-w-0">
                        <h3 className="truncate font-['Outfit'] font-bold text-zinc-950">
                          {customer.name}
                        </h3>

                        <p className="truncate text-xs text-zinc-500">
                          {customer.email}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      active={customer.isActive}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <MiniInfo
                      label="Phone"
                      value={
                        customer.phone || "—"
                      }
                    />

                    <MiniInfo
                      label="Orders"
                      value={customer.totalOrders}
                    />

                    <MiniInfo
                      label="Spent"
                      value={formatCurrency(
                        customer.totalSpent
                      )}
                    />

                    <MiniInfo
                      label="Joined"
                      value={formatDate(
                        customer.createdAt
                      )}
                    />
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        viewCustomer(
                          customer._id
                        )
                      }
                      className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-zinc-800"
                    >
                      View Customer
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        changeCustomerStatus(
                          customer
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-xs font-bold transition ${
                        customer.isActive
                          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {customer.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ====================================== */}
      {/* CUSTOMER DETAILS MODAL */}
      {/* ====================================== */}

      {(selectedCustomer ||
        detailsLoading) && (
        <CustomerModal
          customer={selectedCustomer}
          loading={detailsLoading}
          actionLoading={actionLoading}
          onClose={() =>
            setSelectedCustomer(null)
          }
          onStatusChange={
            changeCustomerStatus
          }
          formatDate={formatDate}
          formatCurrency={formatCurrency}
          getInitial={getInitial}
          getOrderStatusClass={
            getOrderStatusClass
          }
        />
      )}
    </div>
  );
}

// ==========================================
// SUMMARY CARD
// ==========================================

function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {label}
          </p>

          <p className="mt-3 font-['Outfit'] text-3xl font-extrabold tracking-tight text-zinc-950">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 font-bold text-red-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CUSTOMER TABLE ROW
// ==========================================

function CustomerRow({
  customer,
  onView,
  onStatusChange,
  formatDate,
  formatCurrency,
  getInitial,
}) {
  return (
    <tr className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar
            name={customer.name}
            getInitial={getInitial}
          />

          <div>
            <p className="font-['Outfit'] font-bold text-zinc-950">
              {customer.name}
            </p>

            <p className="mt-0.5 text-xs text-zinc-500">
              {customer.gender
                ? customer.gender
                    .charAt(0)
                    .toUpperCase() +
                  customer.gender.slice(1)
                : "—"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="text-sm font-medium text-zinc-800">
          {customer.email}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {customer.phone || "—"}
        </p>
      </td>

      <td className="px-6 py-5 text-sm text-zinc-600">
        {formatDate(customer.createdAt)}
      </td>

      <td className="px-6 py-5">
        <span className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs font-bold text-zinc-700">
          {customer.totalOrders}
        </span>
      </td>

      <td className="px-6 py-5 text-sm font-bold text-zinc-900">
        {formatCurrency(customer.totalSpent)}
      </td>

      <td className="px-6 py-5">
        <StatusBadge active={customer.isActive} />
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              onView(customer._id)
            }
            className="rounded-xl bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-zinc-800"
          >
            View
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange(customer)
            }
            className={`rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
              customer.isActive
                ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            {customer.isActive
              ? "Deactivate"
              : "Activate"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ==========================================
// AVATAR
// ==========================================

function Avatar({ name, getInitial }) {
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 font-['Outfit'] font-bold text-zinc-700">
      {getInitial(name)}
    </div>
  );
}

// ==========================================
// STATUS BADGE
// ==========================================

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

// ==========================================
// MINI INFO
// ==========================================

function MiniInfo({ label, value }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-semibold text-zinc-800">
        {value}
      </p>
    </div>
  );
}

// ==========================================
// CUSTOMER MODAL
// ==========================================

function CustomerModal({
  customer,
  loading,
  actionLoading,
  onClose,
  onStatusChange,
  formatDate,
  formatCurrency,
  getInitial,
  getOrderStatusClass,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
              Customer Details
            </p>

            <h3 className="mt-1 font-['Outfit'] text-2xl font-extrabold text-zinc-950">
              {customer?.name ||
                "Loading customer..."}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            ×
          </button>
        </div>

        {loading || !customer ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-medium text-zinc-500">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-200 border-t-red-600" />
              Loading customer...
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 sm:p-8">
            {/* Profile */}

            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="rounded-2xl border border-zinc-200 p-5">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={customer.name}
                    getInitial={getInitial}
                  />

                  <div>
                    <h4 className="font-['Outfit'] text-xl font-bold text-zinc-950">
                      {customer.name}
                    </h4>

                    <p className="text-sm text-zinc-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <DetailItem
                    label="Phone"
                    value={customer.phone}
                  />

                  <DetailItem
                    label="Gender"
                    value={
                      customer.gender
                        ? customer.gender
                            .charAt(0)
                            .toUpperCase() +
                          customer.gender.slice(
                            1
                          )
                        : "—"
                    }
                  />

                  <DetailItem
                    label="Joined"
                    value={formatDate(
                      customer.createdAt
                    )}
                  />

                  <DetailItem
                    label="Account Status"
                    value={
                      customer.isActive
                        ? "Active"
                        : "Inactive"
                    }
                  />
                </div>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <StatBox
                  label="Total Orders"
                  value={customer.totalOrders}
                />

                <StatBox
                  label="Total Spent"
                  value={formatCurrency(
                    customer.totalSpent
                  )}
                />
              </div>
            </div>

            {/* Account action */}

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-zinc-900">
                  Account Status
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  {customer.isActive
                    ? "This customer can use their account normally."
                    : "This customer account is currently inactive."}
                </p>
              </div>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  onStatusChange(customer)
                }
                className={`rounded-xl px-5 py-3 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  customer.isActive
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {actionLoading
                  ? "Updating..."
                  : customer.isActive
                  ? "Deactivate Customer"
                  : "Activate Customer"}
              </button>
            </div>

            {/* Addresses */}

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h4 className="font-['Outfit'] text-xl font-bold text-zinc-950">
                  Saved Addresses
                </h4>

                <span className="text-xs font-semibold text-zinc-400">
                  {customer.addresses?.length ||
                    0}{" "}
                  address
                  {customer.addresses?.length ===
                  1
                    ? ""
                    : "es"}
                </span>
              </div>

              {!customer.addresses ||
              customer.addresses.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500">
                  No saved addresses.
                </div>
              ) : (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {customer.addresses.map(
                    (address) => (
                      <div
                        key={address._id}
                        className="rounded-2xl border border-zinc-200 p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="font-bold text-zinc-900">
                            {address.fullName}
                          </p>

                          {address.isDefault && (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-3 text-sm leading-6 text-zinc-600">
                          {address.addressLine1}

                          {address.addressLine2
                            ? `, ${address.addressLine2}`
                            : ""}
                          <br />
                          {address.city},{" "}
                          {address.state}{" "}
                          {address.pincode}
                          <br />
                          {address.country}
                        </p>

                        <p className="mt-3 text-xs font-semibold text-zinc-500">
                          {address.phone}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>

            {/* Orders */}

            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h4 className="font-['Outfit'] text-xl font-bold text-zinc-950">
                  Order History
                </h4>

                <span className="text-xs font-semibold text-zinc-400">
                  {customer.orders?.length || 0}{" "}
                  orders
                </span>
              </div>

              {!customer.orders ||
              customer.orders.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500">
                  This customer has not placed any
                  orders yet.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {customer.orders.map(
                    (order) => (
                      <div
                        key={order._id}
                        className="rounded-2xl border border-zinc-200 p-4 sm:p-5"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-['Outfit'] font-bold text-zinc-950">
                              Order #
                              {String(
                                order._id
                              ).slice(-8).toUpperCase()}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {formatDate(
                                order.createdAt
                              )}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase ${getOrderStatusClass(
                                order.orderStatus
                              )}`}
                            >
                              {String(
                                order.orderStatus ||
                                  "pending"
                              ).replace(
                                "_",
                                " "
                              )}
                            </span>

                            <span className="font-['Outfit'] font-bold text-zinc-950">
                              {formatCurrency(
                                order.totalAmount
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 border-t border-zinc-100 pt-4">
                          <p className="text-xs text-zinc-500">
                            {order.items?.length ||
                              0}{" "}
                            item
                            {order.items?.length ===
                            1
                              ? ""
                              : "s"}{" "}
                            ·{" "}
                            {order.paymentMethod ===
                            "online"
                              ? "Online Payment"
                              : "Cash on Delivery"}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// DETAIL ITEM
// ==========================================

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-zinc-800">
        {value || "—"}
      </p>
    </div>
  );
}

// ==========================================
// STAT BOX
// ==========================================

function StatBox({ label, value }) {
  return (
    <div className="rounded-2xl bg-zinc-950 p-5 text-white">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-2 font-['Outfit'] text-2xl font-extrabold">
        {value}
      </p>
    </div>
  );
}

export default AdminUsers;