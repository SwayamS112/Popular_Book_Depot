import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";

const API_URL = "http://localhost:5001/api";

const STATUS_OPTIONS = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"];
const STATUS_LABELS = { pending:"Pending", confirmed:"Confirmed", packed:"Packed", shipped:"Shipped", delivered:"Delivered", cancelled:"Cancelled" };
const STATUS_STYLES = {
  pending:"bg-amber-50 text-amber-700 border-amber-200",
  confirmed:"bg-blue-50 text-blue-700 border-blue-200",
  packed:"bg-violet-50 text-violet-700 border-violet-200",
  shipped:"bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:"bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled:"bg-red-50 text-red-700 border-red-200",
};
const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;
const formatDate = (value) => value ? new Date(value).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";
const getCustomerName = (order) => order?.user?.name || order?.deliveryAddress?.fullName || "Customer";
const getCustomerEmail = (order) => order?.user?.email || "—";

function StatusBadge({ status }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${STATUS_STYLES[status] || "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>{STATUS_LABELS[status] || status || "Unknown"}</span>;
}

function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  const fetchOrders = async () => {
    if (!token) return;
    try {
      setLoading(true); setError("");
      const response = await fetch(`${API_URL}/orders/admin/all`, { headers:{ Authorization:`Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load orders");
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Admin orders fetch error:", err);
      setError(err.message || "Unable to load orders");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [token]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.orderStatus !== statusFilter) return false;
      if (!q) return true;
      const text = [order._id, getCustomerName(order), getCustomerEmail(order), order?.user?.phone, order?.deliveryAddress?.phone, order?.deliveryAddress?.city, order?.deliveryAddress?.pincode, ...(order.items || []).map((item) => item.name)].filter(Boolean).join(" ").toLowerCase();
      return text.includes(q);
    });
  }, [orders, search, statusFilter]);

  const summary = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => ["confirmed","packed","shipped"].includes(o.orderStatus)).length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    revenue: orders.filter((o) => o.orderStatus !== "cancelled").reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
  }), [orders]);

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      setUpdatingOrderId(orderId); setError("");
      const response = await fetch(`${API_URL}/orders/admin/${orderId}/status`, {
        method:"PUT",
        headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body:JSON.stringify({ orderStatus }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to update order status");
      setOrders((current) => current.map((order) => order._id === orderId ? data.order : order));
      setSelectedOrder((current) => current?._id === orderId ? data.order : current);
    } catch (err) {
      console.error("Order status update error:", err);
      setError(err.message || "Unable to update order status");
    } finally { setUpdatingOrderId(""); }
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">Sales</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
        <div><h2 className="font-['Outfit'] text-4xl font-extrabold tracking-[-0.04em] text-zinc-950">Orders</h2><p className="mt-3 text-sm text-zinc-500">View, track and manage customer orders.</p></div>
        <button type="button" onClick={fetchOrders} disabled={loading} className="rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Refreshing..." : "Refresh Orders"}</button>
      </div>

      {error && <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"><span>{error}</span><button type="button" onClick={fetchOrders} className="font-bold underline">Try Again</button></div>}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="Total Orders" value={summary.total}/><SummaryCard label="Pending" value={summary.pending}/><SummaryCard label="Processing" value={summary.processing}/><SummaryCard label="Delivered" value={summary.delivered}/><SummaryCard label="Sales Value" value={formatCurrency(summary.revenue)}/>
      </div>

      <div className="mt-8 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order ID, customer, email, phone, city or product..." className="w-full flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-950"/>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950"><option value="all">All Statuses</option>{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select>
        </div>
        <div className="mt-4 text-xs font-medium text-zinc-500">Showing {filteredOrders.length} of {orders.length} orders</div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
        {loading ? <div className="flex min-h-[350px] items-center justify-center text-sm text-zinc-500">Loading orders...</div> : filteredOrders.length === 0 ? <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-2xl">🧾</div><h3 className="mt-5 font-['Outfit'] text-2xl font-bold text-zinc-950">No orders found</h3><p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">{orders.length === 0 ? "Customer orders will appear here after an order is placed." : "Try changing your search or status filter."}</p></div> : <>
          <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[1000px] text-left"><thead className="border-b border-zinc-200 bg-zinc-50"><tr>{["Order","Customer","Items","Total","Payment","Status","Action"].map((head) => <th key={head} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500 ${head === "Action" ? "text-right" : ""}`}>{head}</th>)}</tr></thead><tbody className="divide-y divide-zinc-100">{filteredOrders.map((order) => <tr key={order._id} className="transition hover:bg-zinc-50">
            <td className="px-6 py-5"><button type="button" onClick={() => setSelectedOrder(order)} className="text-left"><p className="font-mono text-xs font-bold text-zinc-900">#{order._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-zinc-500">{formatDate(order.createdAt)}</p></button></td>
            <td className="px-6 py-5"><p className="font-semibold text-zinc-900">{getCustomerName(order)}</p><p className="mt-1 text-xs text-zinc-500">{getCustomerEmail(order)}</p></td>
            <td className="px-6 py-5"><p className="font-semibold text-zinc-900">{order.items?.length || 0} product{(order.items?.length || 0) !== 1 ? "s" : ""}</p><p className="mt-1 max-w-[220px] truncate text-xs text-zinc-500">{(order.items || []).map((item) => item.name).join(", ")}</p></td>
            <td className="px-6 py-5"><p className="font-bold text-zinc-950">{formatCurrency(order.totalAmount)}</p></td>
            <td className="px-6 py-5"><p className="text-sm font-semibold capitalize text-zinc-800">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</p><p className="mt-1 text-xs capitalize text-zinc-500">{order.paymentStatus}</p></td>
            <td className="px-6 py-5"><StatusBadge status={order.orderStatus}/></td>
            <td className="px-6 py-5 text-right"><button type="button" onClick={() => setSelectedOrder(order)} className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-bold text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white">View Details</button></td>
          </tr>)}</tbody></table></div>
          <div className="divide-y divide-zinc-100 lg:hidden">{filteredOrders.map((order) => <div key={order._id} className="p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs font-bold text-zinc-900">#{order._id.slice(-8).toUpperCase()}</p><p className="mt-1 text-xs text-zinc-500">{formatDate(order.createdAt)}</p></div><StatusBadge status={order.orderStatus}/></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><InfoBlock label="Customer" value={getCustomerName(order)}/><InfoBlock label="Email" value={getCustomerEmail(order)}/><InfoBlock label="Items" value={`${order.items?.length || 0} product${(order.items?.length || 0) !== 1 ? "s" : ""}`}/><InfoBlock label="Total" value={formatCurrency(order.totalAmount)}/></div><button type="button" onClick={() => setSelectedOrder(order)} className="mt-5 w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700">View & Manage Order</button></div>)}</div>
        </>}
      </div>

      {selectedOrder && <OrderDetailsModal order={selectedOrder} updatingOrderId={updatingOrderId} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateOrderStatus}/>} 
    </div>
  );
}

function SummaryCard({ label, value }) { return <div className="rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">{label}</p><p className="mt-3 font-['Outfit'] text-2xl font-extrabold text-zinc-950">{value}</p></div>; }
function InfoBlock({ label, value }) { return <div><p className="text-xs font-bold uppercase tracking-wider text-zinc-400">{label}</p><p className="mt-1 break-words text-sm font-semibold text-zinc-900">{value}</p></div>; }

function OrderDetailsModal({ order, updatingOrderId, onClose, onUpdateStatus }) {
  const [nextStatus, setNextStatus] = useState(order.orderStatus);
  useEffect(() => setNextStatus(order.orderStatus), [order.orderStatus]);
  const address = order.deliveryAddress || {};

  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
      <div className="flex items-start justify-between gap-5 border-b border-zinc-200 px-6 py-5 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Order Details</p><h3 className="mt-2 font-mono text-lg font-bold text-zinc-950">#{order._id}</h3><p className="mt-1 text-xs text-zinc-500">Placed {formatDate(order.createdAt)}</p></div><button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 text-xl text-zinc-500 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white" aria-label="Close order details">×</button></div>
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto p-6 sm:p-8"><div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 p-5"><h4 className="font-['Outfit'] text-lg font-bold text-zinc-950">Customer</h4><div className="mt-4 grid gap-4 sm:grid-cols-2"><InfoBlock label="Name" value={getCustomerName(order)}/><InfoBlock label="Email" value={getCustomerEmail(order)}/><InfoBlock label="Phone" value={order?.user?.phone || address.phone || "—"}/><InfoBlock label="Customer ID" value={order?.user?._id || "—"}/></div></section>
          <section className="rounded-2xl border border-zinc-200 p-5"><h4 className="font-['Outfit'] text-lg font-bold text-zinc-950">Delivery Address</h4><div className="mt-4 text-sm leading-6 text-zinc-600"><p className="font-bold text-zinc-900">{address.fullName || "—"}</p><p>{address.addressLine1 || "—"}</p>{address.addressLine2 && <p>{address.addressLine2}</p>}<p>{address.city || "—"}, {address.state || "—"} - {address.pincode || "—"}</p><p>{address.country || "India"}</p><p className="mt-2 font-semibold text-zinc-800">Phone: {address.phone || "—"}</p></div></section>
          <section className="rounded-2xl border border-zinc-200 p-5"><div className="flex items-center justify-between gap-4"><h4 className="font-['Outfit'] text-lg font-bold text-zinc-950">Ordered Products</h4><span className="text-xs font-semibold text-zinc-500">{order.items?.length || 0} product{(order.items?.length || 0) !== 1 ? "s" : ""}</span></div><div className="mt-5 divide-y divide-zinc-100">{(order.items || []).map((item, index) => <div key={`${order._id}-${index}`} className="flex gap-4 py-4 first:pt-0 last:pb-0"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">{item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center text-xs text-zinc-400">No Image</div>}</div><div className="min-w-0 flex-1"><p className="font-semibold text-zinc-950">{item.name}</p><p className="mt-1 text-xs text-zinc-500">Color: {item.color} • Size: {item.size} • Qty: {item.quantity}</p><p className="mt-2 text-sm font-bold text-zinc-900">{formatCurrency(item.price)} each</p></div><p className="shrink-0 text-sm font-bold text-zinc-950">{formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</p></div>)}</div></section>
        </div>
        <aside className="h-fit space-y-5 lg:sticky lg:top-0">
          <section className="rounded-2xl bg-zinc-50 p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Current Status</p><div className="mt-3"><StatusBadge status={order.orderStatus}/></div><div className="mt-5"><label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Update Status</label><select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="mt-2 w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 outline-none focus:border-zinc-950">{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}</select><button type="button" disabled={nextStatus === order.orderStatus || updatingOrderId === order._id} onClick={() => onUpdateStatus(order._id, nextStatus)} className="mt-3 w-full rounded-xl bg-zinc-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-300">{updatingOrderId === order._id ? "Updating..." : "Update Order Status"}</button><p className="mt-3 text-xs leading-5 text-zinc-500">The backend controls valid status transitions. Cancelled orders will also restore stock.</p></div></section>
          <section className="rounded-2xl border border-zinc-200 p-5"><h4 className="font-['Outfit'] text-lg font-bold text-zinc-950">Payment</h4><div className="mt-4 space-y-3"><div className="flex justify-between gap-4 text-sm"><span className="text-zinc-500">Method</span><span className="font-semibold capitalize text-zinc-900">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}</span></div><div className="flex justify-between gap-4 text-sm"><span className="text-zinc-500">Status</span><span className="font-semibold capitalize text-zinc-900">{order.paymentStatus || "pending"}</span></div></div></section>
          <section className="rounded-2xl border border-zinc-200 p-5"><h4 className="font-['Outfit'] text-lg font-bold text-zinc-950">Order Total</h4><div className="mt-4 space-y-3"><div className="flex justify-between text-sm text-zinc-600"><span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span></div><div className="flex justify-between text-sm text-zinc-600"><span>Delivery</span><span>{Number(order.shippingFee || 0) === 0 ? "Free" : formatCurrency(order.shippingFee)}</span></div><div className="flex justify-between border-t border-zinc-200 pt-4"><span className="font-bold text-zinc-950">Total</span><span className="text-xl font-extrabold text-zinc-950">{formatCurrency(order.totalAmount)}</span></div></div></section>
        </aside>
      </div></div>
    </div>
  </div>;
}

export default AdminOrders;
