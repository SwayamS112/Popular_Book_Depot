import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

function CheckoutPage() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
  } = useContext(CartContext);

  const {
    user,
    token,
    isAuthenticated,
  } = useContext(AuthContext);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] =
    useState("");

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [savingAddress, setSavingAddress] =
    useState(false);

  const [error, setError] = useState("");

  // Redirect guest users to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(
        "/login?redirect=/checkout",
        {
          replace: true,
        }
      );
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  // Fetch user profile and saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;

      try {
        setLoadingAddresses(true);
        setError("");

        const response = await fetch(
          "http://localhost:5001/api/users/profile",
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
              "Unable to load addresses"
          );
        }

        const userAddresses =
          data.user.addresses || [];

        setAddresses(userAddresses);

        // Select default address automatically
        const defaultAddress =
          userAddresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddressId(
            defaultAddress._id
          );
        } else if (userAddresses.length > 0) {
          setSelectedAddressId(
            userAddresses[0]._id
          );
        } else {
          // No saved address
          setShowAddressForm(true);
        }
      } catch (error) {
        console.error(
          "Address fetch error:",
          error
        );

        setError(
          error.message ||
            "Unable to load saved addresses"
        );
      } finally {
        setLoadingAddresses(false);
      }
    };

    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [
    token,
    isAuthenticated,
  ]);

  // Redirect if cart is empty
  if (
    isAuthenticated &&
    cartItems.length === 0
  ) {
    return (
      <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-zinc-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-zinc-600">
            Add some products before proceeding to
            checkout.
          </p>

          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // Save new address
  const handleAddAddress = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSavingAddress(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/users/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(addressForm),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to save address"
        );
      }

      // Add new address to list
      setAddresses((currentAddresses) => [
        ...currentAddresses,
        data.address,
      ]);

      // Automatically select new address
      setSelectedAddressId(
        data.address._id
      );

      // Hide form
      setShowAddressForm(false);

      // Reset form
      setAddressForm({
        fullName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
    } catch (error) {
      console.error(
        "Add address error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while saving the address"
      );
    } finally {
      setSavingAddress(false);
    }
  };

  // Place order
  const handlePlaceOrder = async (
    event
  ) => {
    event?.preventDefault();

    setError("");

    if (!selectedAddressId) {
      setError(
        "Please select or add a delivery address"
      );
      return;
    }

    setPlacingOrder(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            addressId: selectedAddressId,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to place order"
        );
      }

      // Clear frontend local cart
      clearCart();

      alert(
        "Order placed successfully! 🎉"
      );

      // Later we can redirect to:
      // /orders or /order-success
      navigate("/");
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while placing your order"
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
            CHECKOUT
          </p>

          <h1 className="mt-2 text-3xl font-bold text-zinc-900">
            Complete Your Order
          </h1>

          <p className="mt-2 text-zinc-600">
            Select your delivery address and
            payment method.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Left Side */}
          <div className="space-y-8">

            {/* DELIVERY ADDRESS */}
            <section className="rounded-2xl border border-zinc-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">

                <h2 className="text-xl font-bold text-zinc-900">
                  Delivery Address
                </h2>

                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAddressForm(
                        !showAddressForm
                      )
                    }
                    className="text-sm font-semibold text-zinc-900 hover:underline"
                  >
                    {showAddressForm
                      ? "Cancel"
                      : "+ Add New Address"}
                  </button>
                )}
              </div>

              {/* Loading */}
              {loadingAddresses && (
                <p className="mt-5 text-sm text-zinc-500">
                  Loading saved addresses...
                </p>
              )}

              {/* Saved Addresses */}
              {!loadingAddresses &&
                addresses.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {addresses.map(
                      (address) => (
                        <label
                          key={address._id}
                          className={`block cursor-pointer rounded-xl border p-4 transition ${
                            selectedAddressId ===
                            address._id
                              ? "border-zinc-900 bg-zinc-50"
                              : "border-zinc-200 hover:bg-zinc-50"
                          }`}
                        >
                          <div className="flex items-start gap-3">

                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={
                                selectedAddressId ===
                                address._id
                              }
                              onChange={() =>
                                setSelectedAddressId(
                                  address._id
                                )
                              }
                              className="mt-1"
                            />

                            <div>
                              <div className="flex flex-wrap items-center gap-2">

                                <p className="font-bold text-zinc-900">
                                  {address.fullName}
                                </p>

                                {address.isDefault && (
                                  <span className="rounded-full bg-zinc-900 px-2 py-1 text-xs font-medium text-white">
                                    Default
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm text-zinc-600">
                                {address.addressLine1}
                              </p>

                              {address.addressLine2 && (
                                <p className="text-sm text-zinc-600">
                                  {
                                    address.addressLine2
                                  }
                                </p>
                              )}

                              <p className="text-sm text-zinc-600">
                                {address.city},{" "}
                                {address.state} -{" "}
                                {address.pincode}
                              </p>

                              <p className="mt-2 text-sm font-medium text-zinc-700">
                                Phone: {address.phone}
                              </p>
                            </div>
                          </div>
                        </label>
                      )
                    )}
                  </div>
                )}

              {/* Add New Address Form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mt-6 border-t border-zinc-200 pt-6"
                >
                  <h3 className="text-lg font-bold text-zinc-900">
                    Add New Address
                  </h3>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="text-sm font-medium text-zinc-700">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={
                          addressForm.fullName
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                        placeholder="Enter full name"
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-700">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={
                          addressForm.phone
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                        placeholder="Enter phone number"
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-medium text-zinc-700">
                      Address Line 1
                    </label>

                    <input
                      type="text"
                      name="addressLine1"
                      value={
                        addressForm.addressLine1
                      }
                      onChange={
                        handleAddressChange
                      }
                      required
                      placeholder="House number, street, area"
                      className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="mt-5">
                    <label className="text-sm font-medium text-zinc-700">
                      Address Line 2
                      (Optional)
                    </label>

                    <input
                      type="text"
                      name="addressLine2"
                      value={
                        addressForm.addressLine2
                      }
                      onChange={
                        handleAddressChange
                      }
                      placeholder="Landmark, apartment, etc."
                      className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-3">

                    <div>
                      <label className="text-sm font-medium text-zinc-700">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={
                          addressForm.city
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                        placeholder="City"
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-700">
                        State
                      </label>

                      <input
                        type="text"
                        name="state"
                        value={
                          addressForm.state
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                        placeholder="State"
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-zinc-700">
                        Pincode
                      </label>

                      <input
                        type="text"
                        name="pincode"
                        value={
                          addressForm.pincode
                        }
                        onChange={
                          handleAddressChange
                        }
                        required
                        placeholder="Pincode"
                        className="mt-2 w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-zinc-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="mt-6 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
                  >
                    {savingAddress
                      ? "Saving Address..."
                      : "Save Address"}
                  </button>
                </form>
              )}
            </section>

            {/* PAYMENT METHOD */}
            <section className="rounded-2xl border border-zinc-200 p-6">

              <h2 className="text-xl font-bold text-zinc-900">
                Payment Method
              </h2>

              <div className="mt-5 space-y-3">

                {/* COD */}
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                  paymentMethod === "cod"
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={
                      paymentMethod === "cod"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold text-zinc-900">
                      Cash on Delivery
                    </p>

                    <p className="text-sm text-zinc-500">
                      Pay when your order arrives.
                    </p>
                  </div>
                </label>

                {/* Online */}
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                  paymentMethod === "online"
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:bg-zinc-50"
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={
                      paymentMethod === "online"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <div>
                    <p className="font-semibold text-zinc-900">
                      Online Payment
                    </p>

                    <p className="text-sm text-zinc-500">
                      Razorpay payment integration
                      will be connected next.
                    </p>
                  </div>
                </label>
              </div>
            </section>

            {/* Mobile Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                !selectedAddressId
              }
              className="w-full rounded-xl bg-zinc-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 lg:hidden"
            >
              {placingOrder
                ? "Placing Order..."
                : paymentMethod === "online"
                ? "Proceed to Payment"
                : "Place Order"}
            </button>

          </div>

          {/* ORDER SUMMARY */}
          <aside className="h-fit rounded-2xl bg-zinc-100 p-6 lg:sticky lg:top-24">

            <h2 className="text-xl font-bold text-zinc-900">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-zinc-600">
              {totalItems} item
              {totalItems !== 1 ? "s" : ""} in
              your order
            </p>

            {/* Items */}
            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto">

              {cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId}-${item.size}`}
                  className="flex gap-3"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">

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

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      {item.color} • Size{" "}
                      {item.size} • Qty{" "}
                      {item.quantity}
                    </p>

                    <p className="mt-1 text-sm font-bold text-zinc-900">
                      ₹
                      {(
                        item.sellingPrice *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mt-6 space-y-4 border-t border-zinc-300 pt-5">

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Subtotal</span>

                <span>
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm text-zinc-600">
                <span>Delivery</span>

                <span>Free</span>
              </div>

              <div className="flex justify-between border-t border-zinc-300 pt-4">

                <span className="text-lg font-bold text-zinc-900">
                  Total
                </span>

                <span className="text-xl font-bold text-zinc-900">
                  ₹
                  {totalPrice.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>

            {/* Desktop Button */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={
                placingOrder ||
                !selectedAddressId
              }
              className="mt-6 hidden w-full rounded-xl bg-zinc-900 px-5 py-4 text-sm font-bold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400 lg:block"
            >
              {placingOrder
                ? "Placing Order..."
                : paymentMethod === "online"
                ? "Proceed to Payment"
                : "Place Order"}
            </button>

            <Link
              to="/cart"
              className="mt-4 block text-center text-sm font-medium text-zinc-600 hover:text-black"
            >
              ← Back to Cart
            </Link>

          </aside>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;