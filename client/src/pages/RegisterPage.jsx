import { useContext, useEffect, useState } from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    login,
    loading,
    setLoading,
    isAuthenticated,
  } = useContext(AuthContext);

  const { mergeGuestCart } =
    useContext(CartContext);

  // Get redirect URL from:
  // /register?redirect=/checkout
  const redirectTo =
    searchParams.get("redirect") || "/";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    phone: "",
  });

  const [error, setError] = useState("");

  // If already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
    redirectTo,
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Check password confirmation
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      // Save new user and token
      login(data.user, data.token);

      // Merge guest cart into the new user's backend cart
      // Pass the new token directly because React state
      // does not update immediately after login()
      await mergeGuestCart(data.token);

      // Redirect user to the original requested page
      navigate(redirectTo, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Heading */}
          <div className="text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-zinc-500">
              PBD
            </p>

            <h1 className="mt-2 text-3xl font-bold text-zinc-900">
              Create Account
            </h1>

            <p className="mt-3 text-sm text-zinc-600">
              Sign up to shop and manage your orders.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                autoComplete="name"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                autoComplete="tel"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              >
                <option value="">
                  Select gender
                </option>

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                minLength="6"
                required
                autoComplete="new-password"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-zinc-900"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl px-5 py-3.5 text-sm font-bold text-white transition ${
                loading
                  ? "cursor-not-allowed bg-zinc-400"
                  : "bg-zinc-900 hover:bg-zinc-700"
              }`}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* Login */}
          <p className="mt-6 text-center text-sm text-zinc-600">
            Already have an account?{" "}

            <Link
              to={`/login?redirect=${encodeURIComponent(
                redirectTo
              )}`}
              className="font-semibold text-zinc-900 hover:underline"
            >
              Login
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}

export default RegisterPage;