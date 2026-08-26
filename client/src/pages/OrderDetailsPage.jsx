import { useContext, useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";

function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    token,
    isAuthenticated,
  } = useContext(AuthContext);

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          `/my-orders/${id}`
        )}`,
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
    id,
  ]);

  // Get order details
  useEffect(() => {
    if (!isAuthenticated || !token) {
      return;
    }

    const getOrderDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5001/api/orders/my-orders/${id}`,
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
              "Unable to load order details"
          );
        }

        setOrder(data.order);
      } catch (error) {
        console.error(
          "Get order details error:",
          error
        );

        setError(
          error.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [
    id,
    token,
    isAuthenticated,
  ]);

  // Cancel Order
  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancelling(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:5001/api/orders/my-orders/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to cancel order"
        );
      }

      // Update order immediately on screen
      setOrder(data.order);

      setSuccess(
        "Order cancelled successfully"
      );
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while cancelling the order"
      );
    } finally {
      setCancelling(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${Number(
      price
    ).toLocaleString("en-IN")}`;
  };

  const formatDate = (date) => {
    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // User can cancel only before packing
  const canCancelOrder =
    order &&
    ["pending", "confirmed"].includes(
      order.orderStatus
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-zinc-600">
            Loading order details...
          </p>
        </div>
      </main>
    );
  }

  if (error && !order) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">
              {error}
            </p>

            <Link
              to="/my-orders"
              className="mt-5 inline-block rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back Button */}
        <button
          onClick={() => navigate("/my-orders")}
          className="mb-6 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          ← Back to My Orders
        </button>

        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
            ORDER DETAILS
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Order #{order._id}
          </h1>

          <p className="mt-2 text-sm text-zinc-600">
            Placed on{" "}
            {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left Side */}
          <div className="space-y-6 lg:col-span-2">

            {/* Order Status */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-zinc-900">
                  Order Status
                </h2>

                {/* Cancel Button */}
                {canCancelOrder && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelling}
                    className="rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400"
                  >
                    {cancelling
                      ? "Cancelling..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3">

                {[
                  "pending",
                  "confirmed",
                  "packed",
                  "shipped",
                  "delivered",
                ].map((status) => (
                  <div
                    key={status}
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                      order.orderStatus === status
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {status}
                  </div>
                ))}
              </div>

              {order.orderStatus ===
                "cancelled" && (
                <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 font-semibold text-red-600">
                  This order has been cancelled
                </p>
              )}

              {!canCancelOrder &&
                order.orderStatus !==
                  "cancelled" && (
                  <p className="mt-4 text-sm text-zinc-500">
                    This order can no longer be cancelled.
                  </p>
                )}
            </section>

            {/* Products */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">
                Ordered Products
              </h2>

              <div className="mt-5 space-y-5">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 border-b border-zinc-200 pb-5 last:border-b-0 last:pb-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl border border-zinc-200 object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-zinc-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-600">
                        Color: {item.color}
                      </p>

                      <p className="text-sm text-zinc-600">
                        Size: {item.size}
                      </p>

                      <p className="text-sm text-zinc-600">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 font-bold text-zinc-900">
                        {formatPrice(
                          item.price *
                            item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">
                Delivery Address
              </h2>

              <div className="mt-4 text-sm leading-7 text-zinc-600">
                <p className="font-bold text-zinc-900">
                  {order.deliveryAddress.fullName}
                </p>

                <p>
                  {order.deliveryAddress.addressLine1}
                </p>

                {order.deliveryAddress
                  .addressLine2 && (
                  <p>
                    {
                      order.deliveryAddress
                        .addressLine2
                    }
                  </p>
                )}

                <p>
                  {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state}
                  {" - "}
                  {order.deliveryAddress.pincode}
                </p>

                <p>
                  {order.deliveryAddress.country}
                </p>

                <p className="mt-2">
                  Phone:{" "}
                  {order.deliveryAddress.phone}
                </p>
              </div>
            </section>

          </div>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Payment Summary */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    {formatPrice(
                      order.subtotal
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-zinc-600">
                    Shipping Fee
                  </span>

                  <span className="font-semibold">
                    {formatPrice(
                      order.shippingFee
                    )}
                  </span>
                </div>

                <div className="border-t border-zinc-200 pt-4">
                  <div className="flex justify-between text-base font-bold">
                    <span>Total Amount</span>

                    <span>
                      {formatPrice(
                        order.totalAmount
                      )}
                    </span>
                  </div>
                </div>

              </div>
            </section>

            {/* Payment Information */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h2 className="text-xl font-bold text-zinc-900">
                Payment Information
              </h2>

              <div className="mt-4 space-y-3 text-sm">

                <div>
                  <p className="text-zinc-500">
                    Payment Method
                  </p>

                  <p className="mt-1 font-bold uppercase">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-500">
                    Payment Status
                  </p>

                  <p className="mt-1 font-bold capitalize">
                    {order.paymentStatus}
                  </p>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderDetailsPage;