import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f7f4] px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl">
            🛒
          </div>

          <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-red-600">
            Your Shopping Bag
          </p>

          <h1 className="mt-3 font-['Outfit'] text-4xl font-bold text-zinc-950">
            Your Cart is Empty
          </h1>

          <p className="mx-auto mt-4 max-w-md text-zinc-600">
            Looks like you haven't added any footwear yet. Explore our
            collection and find your next perfect pair.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl"
          >
            Continue Shopping
            <span className="text-base">→</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              Shopping Bag
            </p>

            <h1 className="mt-2 font-['Outfit'] text-4xl font-bold text-zinc-950">
              Your Cart
              <span className="ml-2 text-zinc-400">
                ({totalItems})
              </span>
            </h1>
          </div>

          <button
            onClick={clearCart}
            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Cart Items */}
          <div className="space-y-5">
            {cartItems.map((item) => (
              <div
                key={
                  item.cartItemId ||
                  `${item.productId}-${item.variantId}-${item.size}`
                }
                className="flex flex-col gap-5 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm transition duration-300 hover:shadow-md sm:flex-row"
              >
                {/* Product Image */}
                <Link
                  to={`/product/${item.productId}`}
                  className="h-40 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:w-40"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                      No Image
                    </div>
                  )}
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        {item.brand}
                      </p>

                      <Link
                        to={`/product/${item.productId}`}
                        className="mt-1 block text-xl font-bold text-zinc-950 transition hover:text-red-600"
                      >
                        {item.name}
                      </Link>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-600">
                        <p>
                          Color:{" "}
                          <span className="font-semibold text-zinc-800">
                            {item.color}
                          </span>
                        </p>

                        <p>
                          Size:{" "}
                          <span className="font-semibold text-zinc-800">
                            {item.size}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.productId,
                          item.variantId,
                          item.size,
                          item.cartItemId
                        )
                      }
                      className="h-fit rounded-full bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Bottom Section */}
                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    {/* Quantity */}
                    <div>
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                        Quantity
                      </p>

                      <div className="flex items-center overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.size,
                              item.quantity - 1,
                              item.cartItemId
                            )
                          }
                          className="px-4 py-2 text-lg text-zinc-700 transition hover:bg-zinc-200"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center text-sm font-bold text-zinc-950">
                          {item.quantity}
                        </span>

                        <button
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              item.size,
                              item.quantity + 1,
                              item.cartItemId
                            )
                          }
                          className={`px-4 py-2 text-lg transition ${
                            item.quantity >= item.stock
                              ? "cursor-not-allowed text-zinc-300"
                              : "text-zinc-700 hover:bg-zinc-200"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {item.quantity >= item.stock && (
                        <p className="mt-2 text-xs font-medium text-orange-600">
                          Maximum available stock reached
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-zinc-950">
                        ₹
                        {(
                          item.sellingPrice * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        ₹{item.sellingPrice.toLocaleString("en-IN")} each
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
              Checkout
            </p>

            <h2 className="mt-2 text-2xl font-bold text-zinc-950">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 border-b border-zinc-200 pb-5">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Items</span>
                <span className="font-semibold text-zinc-900">
                  {totalItems}
                </span>
              </div>

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">
                  ₹{totalPrice.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Delivery</span>
                <span className="font-medium text-zinc-500">
                  Calculated at checkout
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-between">
              <span className="text-lg font-bold text-zinc-950">
                Total
              </span>

              <span className="text-2xl font-bold text-zinc-950">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login?redirect=/checkout");
                  return;
                }

                navigate("/checkout");
              }}
              className="mt-6 w-full rounded-full bg-red-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/20 transition duration-300 hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl"
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-3 text-center text-sm font-bold text-zinc-800 transition hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            >
              <span>←</span>
              Continue Shopping
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-zinc-400">
              Secure checkout • Trusted footwear for 50+ years
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CartPage;