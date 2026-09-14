import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";
import API_BASE from "../config/api.js";

function MyOrdersPage() {
  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
  } = useContext(AuthContext);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    // User must be logged in
    if (!isAuthenticated) {
      navigate(
        "/login?redirect=/my-orders",
        {
          replace: true,
        }
      );

      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
         `${API_BASE}/api/orders/my-orders`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch orders"
          );
        }

        setOrders(
          data.orders || []
        );
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error
        );

        setError(
          error.message ||
            "Something went wrong while loading your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [
    isAuthenticated,
    token,
    navigate,
  ]);

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-zinc-900">
            My Orders
          </h1>

          <p className="mt-6 text-zinc-600">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  // =====================================
  // ERROR
  // =====================================
  if (error) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-zinc-900">
            My Orders
          </h1>

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =====================================
  // EMPTY ORDERS
  // =====================================
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
            MY ORDERS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            No Orders Yet
          </h1>

          <p className="mt-3 text-zinc-600">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  // =====================================
  // ORDERS
  // =====================================
  return (
    <main className="min-h-screen bg-white px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
            MY ORDERS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Your Orders
          </h1>

          <p className="mt-3 text-zinc-600">
            Track and manage your placed orders.
          </p>
        </div>

        {/* Orders List */}
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >

              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-zinc-200 bg-zinc-50 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Order ID
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold text-zinc-900">
                    {order._id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Order Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-sm font-bold text-zinc-900">
                      ₹
                      {Number(
                        order.totalAmount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Status
                    </p>

                    <span className="mt-1 inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold capitalize text-white">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-zinc-200">
                {order.items?.map(
                  (item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex gap-4 p-5"
                    >
                      {/* Image */}
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <h2 className="font-bold text-zinc-900">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm text-zinc-600">
                            Color:{" "}
                            {item.color}
                          </p>

                          <p className="mt-1 text-sm text-zinc-600">
                            Size: {item.size}
                          </p>

                          <p className="mt-1 text-sm text-zinc-600">
                            Quantity:{" "}
                            {item.quantity}
                          </p>
                        </div>

                        <p className="mt-3 font-bold text-zinc-900">
                          ₹
                          {Number(
                            item.price *
                              item.quantity
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-4 border-t border-zinc-200 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm text-zinc-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-semibold uppercase text-zinc-900">
                    {order.paymentMethod}
                  </p>
                </div>

                <Link
                    to={`/my-orders/${order._id}`}
                    className="inline-flex justify-center rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                  >
                    View Order Details
                  </Link>
              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default MyOrdersPage; 